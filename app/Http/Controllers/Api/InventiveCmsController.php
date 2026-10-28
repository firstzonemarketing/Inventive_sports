<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class InventiveCmsController
{
    private function verifyAdmin(Request $request): ?object
    {
        $header = $request->header('Authorization', '');
        $token = '';
        if (str_starts_with($header, 'Bearer ')) {
            $token = trim(substr($header, 7));
        } elseif ($request->has('api_token')) {
            $token = (string) $request->query('api_token');
        }

        if ($token === '') {
            return null;
        }

        return DB::table('users')->where('api_token', $token)->first();
    }

    private function logActivity(string $actor, string $action, string $entityType = '', ?int $entityId = null, string $details = ''): void
    {
        DB::table('activity_logs')->insert([
            'actor_name' => $actor,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'details' => $details,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /* =========================================================================
       PUBLIC ENDPOINTS (/api/v1/public/...)
       ========================================================================= */

    public function publicBootstrap(): JsonResponse
    {
        $settingsRows = DB::table('settings')->get();
        $settings = [];
        foreach ($settingsRows as $row) {
            $settings[$row->key] = $row->value;
        }

        $milestones = DB::table('timeline_milestones')
            ->where('is_published', true)
            ->orderBy('display_order')
            ->get();

        $leadership = DB::table('team_members')
            ->where('is_published', true)
            ->where('category', 'leadership')
            ->orderBy('display_order')
            ->get();

        $squad = DB::table('team_members')
            ->where('is_published', true)
            ->where('category', 'squad')
            ->orderBy('display_order')
            ->get();

        $disciplines = DB::table('disciplines')
            ->where('is_published', true)
            ->orderBy('display_order')
            ->get()
            ->map(function ($d) {
                $d->benefits = json_decode($d->benefits_json ?? '[]', true) ?: [];
                $d->highlights = json_decode($d->highlights_json ?? '[]', true) ?: [];
                return $d;
            });

        $events = DB::table('events')
            ->where('status', 'published')
            ->orderBy('start_date')
            ->get();

        $albums = DB::table('gallery_albums')
            ->where('is_published', true)
            ->orderBy('display_order')
            ->get();

        $gallery = DB::table('gallery_items')
            ->where('is_published', true)
            ->orderBy('display_order')
            ->get();

        $products = DB::table('products')
            ->where('is_published', true)
            ->orderByDesc('is_featured')
            ->orderBy('id')
            ->get();

        $categories = DB::table('product_categories')
            ->orderBy('display_order')
            ->get();

        return response()->json([
            'status' => 'ok',
            'settings' => $settings,
            'milestones' => $milestones,
            'leadership' => $leadership,
            'squad' => $squad,
            'disciplines' => $disciplines,
            'events' => $events,
            'albums' => $albums,
            'gallery' => $gallery,
            'products' => $products,
            'product_categories' => $categories,
        ]);
    }

    public function submitLead(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:2|max:120',
            'email' => 'required|email|max:150',
            'phone' => 'nullable|string|max:40',
            'preferred_discipline' => 'nullable|string|max:100',
            'enquiry_type' => 'nullable|string|max:100',
            'message' => 'required|string|min:5|max:2500',
            'source_page' => 'nullable|string|max:150',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        $now = now();

        $id = DB::table('leads')->insertGetId([
            'name' => strip_tags($data['name']),
            'email' => strip_tags($data['email']),
            'phone' => isset($data['phone']) ? strip_tags($data['phone']) : null,
            'preferred_discipline' => $data['preferred_discipline'] ?? 'General',
            'enquiry_type' => $data['enquiry_type'] ?? 'Website Enquiry',
            'message' => strip_tags($data['message']),
            'source_page' => $data['source_page'] ?? '/',
            'status' => 'New',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $this->logActivity('Visitor', 'Submitted new enquiry', 'lead', $id, $data['name'] . ' (' . ($data['preferred_discipline'] ?? 'General') . ')');

        return response()->json([
            'status' => 'ok',
            'message' => 'Your enquiry has been received by Inventive Sports Academy.',
            'lead_id' => $id,
        ], 201);
    }

    /* =========================================================================
       ADMIN AUTHENTICATION & OVERVIEW (/api/v1/admin/...)
       ========================================================================= */

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => 'Invalid credentials format.'], 422);
        }

        $user = DB::table('users')->where('email', $request->input('email'))->first();
        if (!$user || !Hash::check($request->input('password'), $user->password)) {
            return response()->json(['status' => 'error', 'message' => 'Invalid email or password.'], 401);
        }

        $token = $user->api_token ?: ('inv-' . Str::random(40));
        DB::table('users')->where('id', $user->id)->update([
            'api_token' => $token,
            'updated_at' => now(),
        ]);

        $this->logActivity($user->name, 'Logged into Admin CMS', 'user', $user->id);

        return response()->json([
            'status' => 'ok',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if ($admin) {
            $this->logActivity($admin->name, 'Logged out of Admin CMS', 'user', $admin->id);
        }
        return response()->json(['status' => 'ok']);
    }

    public function adminDashboard(Request $request): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        $metrics = [
            'total_leads' => DB::table('leads')->count(),
            'new_enquiries' => DB::table('leads')->where('status', 'New')->count(),
            'followup_leads' => DB::table('leads')->where('status', 'Follow-up')->count(),
            'upcoming_events' => DB::table('events')->where('status', 'published')->count(),
            'published_gallery_items' => DB::table('gallery_items')->where('is_published', true)->count(),
            'active_products' => DB::table('products')->where('is_published', true)->count(),
        ];

        $settingsRows = DB::table('settings')->get();
        $settings = [];
        foreach ($settingsRows as $row) {
            $settings[$row->key] = $row->value;
        }

        $disciplines = DB::table('disciplines')->orderBy('display_order')->get()->map(function ($d) {
            $d->benefits = json_decode($d->benefits_json ?? '[]', true) ?: [];
            $d->highlights = json_decode($d->highlights_json ?? '[]', true) ?: [];
            return $d;
        });

        $leads = DB::table('leads')->orderByDesc('created_at')->get()->map(function ($lead) {
            $lead->notes = DB::table('lead_notes')->where('lead_id', $lead->id)->orderByDesc('created_at')->get();
            return $lead;
        });

        return response()->json([
            'status' => 'ok',
            'metrics' => $metrics,
            'settings' => $settings,
            'milestones' => DB::table('timeline_milestones')->orderBy('display_order')->get(),
            'team' => DB::table('team_members')->orderBy('category')->orderBy('display_order')->get(),
            'disciplines' => $disciplines,
            'events' => DB::table('events')->orderByDesc('start_date')->get(),
            'albums' => DB::table('gallery_albums')->orderBy('display_order')->get(),
            'gallery' => DB::table('gallery_items')->orderBy('display_order')->get(),
            'products' => DB::table('products')->orderByDesc('id')->get(),
            'product_categories' => DB::table('product_categories')->orderBy('display_order')->get(),
            'leads' => $leads,
            'media' => DB::table('media')->orderByDesc('id')->get(),
            'activity_logs' => DB::table('activity_logs')->orderByDesc('created_at')->limit(25)->get(),
        ]);
    }

    /* =========================================================================
       MODULE A — WEBSITE CONTENT & TIMELINE MANAGEMENT
       ========================================================================= */

    public function updateSettings(Request $request): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        $entries = $request->input('settings', []);
        if (is_array($entries)) {
            foreach ($entries as $key => $value) {
                DB::table('settings')->updateOrInsert(
                    ['key' => (string) $key],
                    ['value' => (string) $value, 'updated_at' => now()]
                );
            }
        }

        $this->logActivity($admin->name, 'Updated website content settings', 'settings');
        return response()->json(['status' => 'ok', 'message' => 'Settings saved successfully.']);
    }

    public function saveMilestone(Request $request, ?int $id = null): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        $payload = [
            'year' => $request->input('year', ''),
            'eyebrow' => $request->input('eyebrow', 'MILESTONE'),
            'heading' => $request->input('heading', ''),
            'description' => $request->input('description', ''),
            'image_url' => $request->input('image_url', '/images/about/founded.png'),
            'display_order' => (int) $request->input('display_order', 1),
            'is_published' => (bool) $request->input('is_published', true),
            'updated_at' => now(),
        ];

        if ($id) {
            DB::table('timeline_milestones')->where('id', $id)->update($payload);
            $this->logActivity($admin->name, 'Updated timeline milestone', 'timeline_milestone', $id, $payload['heading']);
        } else {
            $payload['created_at'] = now();
            $id = DB::table('timeline_milestones')->insertGetId($payload);
            $this->logActivity($admin->name, 'Created timeline milestone', 'timeline_milestone', $id, $payload['heading']);
        }

        return response()->json(['status' => 'ok', 'id' => $id]);
    }

    public function deleteMilestone(Request $request, int $id): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        DB::table('timeline_milestones')->where('id', $id)->delete();
        $this->logActivity($admin->name, 'Deleted timeline milestone', 'timeline_milestone', $id);
        return response()->json(['status' => 'ok']);
    }

    /* =========================================================================
       MODULE B — LEADERSHIP & TEAM MANAGEMENT
       ========================================================================= */

    public function saveTeamMember(Request $request, ?int $id = null): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        $payload = [
            'name' => $request->input('name', ''),
            'designation' => $request->input('designation', ''),
            'category' => $request->input('category', 'squad'),
            'discipline' => $request->input('discipline', ''),
            'biography' => $request->input('biography', ''),
            'portrait_url' => $request->input('portrait_url', ''),
            'display_order' => (int) $request->input('display_order', 1),
            'is_published' => (bool) $request->input('is_published', true),
            'updated_at' => now(),
        ];

        if ($id) {
            DB::table('team_members')->where('id', $id)->update($payload);
            $this->logActivity($admin->name, 'Updated team member', 'team_member', $id, $payload['name']);
        } else {
            $payload['created_at'] = now();
            $id = DB::table('team_members')->insertGetId($payload);
            $this->logActivity($admin->name, 'Created team member', 'team_member', $id, $payload['name']);
        }

        return response()->json(['status' => 'ok', 'id' => $id]);
    }

    public function deleteTeamMember(Request $request, int $id): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        DB::table('team_members')->where('id', $id)->delete();
        $this->logActivity($admin->name, 'Deleted team member', 'team_member', $id);
        return response()->json(['status' => 'ok']);
    }

    /* =========================================================================
       MODULE C — SPORTS & PROGRAMS MANAGEMENT
       ========================================================================= */

    public function saveDiscipline(Request $request, ?int $id = null): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        $name = (string) $request->input('name', 'New Discipline');
        $slug = $request->input('slug') ? Str::slug($request->input('slug')) : Str::slug($name);
        $benefits = $request->input('benefits', []);
        $highlights = $request->input('highlights', []);

        $payload = [
            'name' => $name,
            'slug' => $slug,
            'category' => $request->input('category', 'sports'),
            'tagline' => $request->input('tagline', 'HIGH-PERFORMANCE DISCIPLINE'),
            'scene_heading' => $request->input('scene_heading', strtoupper($name) . ' EXCELLENCE.'),
            'animation_style' => $request->input('animation_style', 'cricket-sweep'),
            'short_description' => $request->input('short_description', ''),
            'full_description' => $request->input('full_description', ''),
            'benefits_json' => is_string($benefits) ? $benefits : json_encode($benefits),
            'highlights_json' => is_string($highlights) ? $highlights : json_encode($highlights),
            'cover_image' => $request->input('cover_image', '/images/sports/football-main.jpg'),
            'cta_text' => $request->input('cta_text', 'EXPLORE ' . strtoupper($name)),
            'display_order' => (int) $request->input('display_order', 1),
            'is_published' => (bool) $request->input('is_published', true),
            'updated_at' => now(),
        ];

        if ($id) {
            DB::table('disciplines')->where('id', $id)->update($payload);
            $this->logActivity($admin->name, 'Updated discipline', 'discipline', $id, $name);
        } else {
            $payload['created_at'] = now();
            $id = DB::table('disciplines')->insertGetId($payload);
            $this->logActivity($admin->name, 'Created discipline', 'discipline', $id, $name);
        }

        return response()->json(['status' => 'ok', 'id' => $id]);
    }

    public function deleteDiscipline(Request $request, int $id): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        DB::table('disciplines')->where('id', $id)->delete();
        $this->logActivity($admin->name, 'Deleted discipline', 'discipline', $id);
        return response()->json(['status' => 'ok']);
    }

    /* =========================================================================
       MODULE D — EVENTS MANAGEMENT
       ========================================================================= */

    public function saveEvent(Request $request, ?int $id = null): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        $title = (string) $request->input('title', 'Untitled Event');
        $slug = $request->input('slug') ? Str::slug($request->input('slug')) : Str::slug($title);

        $payload = [
            'title' => $title,
            'slug' => $slug,
            'short_description' => $request->input('short_description', ''),
            'description' => $request->input('description', ''),
            'cover_image' => $request->input('cover_image', '/images/events/events-main.jpg'),
            'discipline' => $request->input('discipline', 'General'),
            'start_date' => $request->input('start_date') ?: null,
            'end_date' => $request->input('end_date') ?: null,
            'start_time' => $request->input('start_time', ''),
            'end_time' => $request->input('end_time', ''),
            'venue' => $request->input('venue', 'Bangalore Campus'),
            'registration_url' => $request->input('registration_url', '/contact'),
            'contact_details' => $request->input('contact_details', ''),
            'is_featured' => (bool) $request->input('is_featured', false),
            'status' => $request->input('status', 'published'),
            'meta_title' => $request->input('meta_title', $title),
            'meta_description' => $request->input('meta_description', ''),
            'updated_at' => now(),
        ];

        if ($id) {
            DB::table('events')->where('id', $id)->update($payload);
            $this->logActivity($admin->name, 'Updated event', 'event', $id, $title);
        } else {
            $payload['created_at'] = now();
            $id = DB::table('events')->insertGetId($payload);
            $this->logActivity($admin->name, 'Created event', 'event', $id, $title);
        }

        return response()->json(['status' => 'ok', 'id' => $id]);
    }

    public function deleteEvent(Request $request, int $id): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        DB::table('events')->where('id', $id)->delete();
        $this->logActivity($admin->name, 'Deleted event', 'event', $id);
        return response()->json(['status' => 'ok']);
    }

    /* =========================================================================
       MODULE E — GALLERY MANAGEMENT
       ========================================================================= */

    public function saveGalleryItem(Request $request, ?int $id = null): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        $payload = [
            'album_id' => $request->input('album_id') ? (int) $request->input('album_id') : null,
            'title' => $request->input('title', 'Gallery Media'),
            'caption' => $request->input('caption', ''),
            'category' => $request->input('category', 'Training Sessions'),
            'discipline' => $request->input('discipline', 'General'),
            'media_type' => $request->input('media_type', 'photo'),
            'media_url' => $request->input('media_url', '/images/sports/football-main.jpg'),
            'alt_text' => $request->input('alt_text', $request->input('title', 'Academy gallery image')),
            'display_order' => (int) $request->input('display_order', 1),
            'is_featured' => (bool) $request->input('is_featured', false),
            'is_published' => (bool) $request->input('is_published', true),
            'updated_at' => now(),
        ];

        if ($id) {
            DB::table('gallery_items')->where('id', $id)->update($payload);
            $this->logActivity($admin->name, 'Updated gallery item', 'gallery_item', $id, $payload['title']);
        } else {
            $payload['created_at'] = now();
            $id = DB::table('gallery_items')->insertGetId($payload);
            $this->logActivity($admin->name, 'Added gallery item', 'gallery_item', $id, $payload['title']);
        }

        return response()->json(['status' => 'ok', 'id' => $id]);
    }

    public function deleteGalleryItem(Request $request, int $id): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        DB::table('gallery_items')->where('id', $id)->delete();
        $this->logActivity($admin->name, 'Deleted gallery item', 'gallery_item', $id);
        return response()->json(['status' => 'ok']);
    }

    /* =========================================================================
       MODULE F — SHOP MANAGEMENT
       ========================================================================= */

    public function saveProduct(Request $request, ?int $id = null): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        $name = (string) $request->input('name', 'Academy Product');
        $slug = $request->input('slug') ? Str::slug($request->input('slug')) : Str::slug($name);

        $payload = [
            'category_name' => $request->input('category_name', 'Academy Apparel'),
            'name' => $name,
            'slug' => $slug,
            'sku' => $request->input('sku', 'INV-' . strtoupper(Str::random(5))),
            'description' => $request->input('description', ''),
            'price' => (float) $request->input('price', 0),
            'sale_price' => $request->input('sale_price') !== null && $request->input('sale_price') !== '' ? (float) $request->input('sale_price') : null,
            'stock_quantity' => (int) $request->input('stock_quantity', 10),
            'image_url' => $request->input('image_url', '/images/athletics/athletics-main.jpg'),
            'is_featured' => (bool) $request->input('is_featured', false),
            'is_published' => (bool) $request->input('is_published', true),
            'updated_at' => now(),
        ];

        if ($id) {
            DB::table('products')->where('id', $id)->update($payload);
            $this->logActivity($admin->name, 'Updated shop product', 'product', $id, $name);
        } else {
            $payload['created_at'] = now();
            $id = DB::table('products')->insertGetId($payload);
            $this->logActivity($admin->name, 'Created shop product', 'product', $id, $name);
        }

        return response()->json(['status' => 'ok', 'id' => $id]);
    }

    public function deleteProduct(Request $request, int $id): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        DB::table('products')->where('id', $id)->delete();
        $this->logActivity($admin->name, 'Deleted shop product', 'product', $id);
        return response()->json(['status' => 'ok']);
    }

    /* =========================================================================
       MODULE G — LEAD MANAGEMENT & CSV EXPORT
       ========================================================================= */

    public function updateLead(Request $request, int $id): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        DB::table('leads')->where('id', $id)->update([
            'status' => $request->input('status', 'Contacted'),
            'assigned_to' => $request->input('assigned_to'),
            'updated_at' => now(),
        ]);

        if ($request->filled('note')) {
            DB::table('lead_notes')->insert([
                'lead_id' => $id,
                'author_name' => $admin->name,
                'note' => strip_tags((string) $request->input('note')),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->logActivity($admin->name, 'Updated lead status', 'lead', $id, 'Status: ' . $request->input('status'));
        return response()->json(['status' => 'ok']);
    }

    public function deleteLead(Request $request, int $id): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        DB::table('leads')->where('id', $id)->delete();
        $this->logActivity($admin->name, 'Deleted lead record', 'lead', $id);
        return response()->json(['status' => 'ok']);
    }

    public function exportLeadsCsv(Request $request)
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        $leads = DB::table('leads')->orderByDesc('created_at')->get();
        $csvLines = ["ID,Name,Email,Phone,Discipline,Enquiry Type,Status,Source Page,Created At,Message"];
        foreach ($leads as $l) {
            $msg = str_replace('"', '""', (string) $l->message);
            $name = str_replace('"', '""', (string) $l->name);
            $csvLines[] = sprintf(
                '%d,"%s","%s","%s","%s","%s","%s","%s","%s","%s"',
                $l->id,
                $name,
                $l->email,
                $l->phone ?? '',
                $l->preferred_discipline ?? '',
                $l->enquiry_type ?? '',
                $l->status,
                $l->source_page ?? '',
                $l->created_at,
                $msg
            );
        }

        return response(implode("\n", $csvLines), 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="inventive-sports-leads.csv"',
        ]);
    }

    /* =========================================================================
       MODULE H — MEDIA LIBRARY & FILE UPLOAD
       ========================================================================= */

    public function uploadMedia(Request $request): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:jpg,jpeg,png,webp,gif,svg,mp4|max:10240',
            'title' => 'nullable|string|max:150',
            'alt_text' => 'nullable|string|max:180',
            'usage_role' => 'nullable|string|max:60',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid file upload.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $file = $request->file('file');
        $ext = strtolower($file->getClientOriginalExtension());
        $safeName = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '-' . time() . '.' . $ext;
        $uploadDir = public_path('uploads');
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $file->move($uploadDir, $safeName);
        $fileUrl = '/uploads/' . $safeName;

        $id = DB::table('media')->insertGetId([
            'title' => $request->input('title') ?: $file->getClientOriginalName(),
            'filename' => $safeName,
            'file_url' => $fileUrl,
            'mime_type' => $file->getClientMimeType(),
            'file_size' => 0,
            'alt_text' => $request->input('alt_text') ?: $file->getClientOriginalName(),
            'usage_role' => $request->input('usage_role', 'general'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->logActivity($admin->name, 'Uploaded media file', 'media', $id, $fileUrl);

        return response()->json([
            'status' => 'ok',
            'id' => $id,
            'file_url' => $fileUrl,
        ], 201);
    }

    public function deleteMedia(Request $request, int $id): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        DB::table('media')->where('id', $id)->delete();
        $this->logActivity($admin->name, 'Removed media item', 'media', $id);
        return response()->json(['status' => 'ok']);
    }
}
