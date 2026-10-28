<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email')->unique();
                $table->string('password');
                $table->string('role')->default('admin');
                $table->string('api_token', 100)->nullable()->unique();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('settings')) {
            Schema::create('settings', function (Blueprint $table) {
                $table->id();
                $table->string('group')->default('general')->index();
                $table->string('key')->unique();
                $table->text('value')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('pages')) {
            Schema::create('pages', function (Blueprint $table) {
                $table->id();
                $table->string('slug')->unique();
                $table->string('title');
                $table->string('meta_title')->nullable();
                $table->text('meta_description')->nullable();
                $table->string('og_image')->nullable();
                $table->boolean('is_published')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('page_sections')) {
            Schema::create('page_sections', function (Blueprint $table) {
                $table->id();
                $table->foreignId('page_id')->nullable()->constrained('pages')->nullOnDelete();
                $table->string('page_slug')->index();
                $table->string('section_key')->index();
                $table->string('eyebrow')->nullable();
                $table->string('heading')->nullable();
                $table->text('subheading')->nullable();
                $table->longText('content_json')->nullable();
                $table->string('image_url')->nullable();
                $table->string('primary_cta_text')->nullable();
                $table->string('primary_cta_url')->nullable();
                $table->string('secondary_cta_text')->nullable();
                $table->string('secondary_cta_url')->nullable();
                $table->integer('display_order')->default(0);
                $table->boolean('is_published')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('timeline_milestones')) {
            Schema::create('timeline_milestones', function (Blueprint $table) {
                $table->id();
                $table->string('year')->nullable();
                $table->string('eyebrow');
                $table->string('heading');
                $table->text('description');
                $table->string('image_url')->nullable();
                $table->integer('display_order')->default(0);
                $table->boolean('is_published')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('team_members')) {
            Schema::create('team_members', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('designation');
                $table->string('category')->default('squad')->index(); // 'leadership' or 'squad'
                $table->string('discipline')->nullable()->index();
                $table->text('biography')->nullable();
                $table->string('portrait_url')->nullable();
                $table->integer('display_order')->default(0);
                $table->boolean('is_published')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('disciplines')) {
            Schema::create('disciplines', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('category')->default('sports')->index(); // 'sports' or 'performing-arts'
                $table->string('tagline')->nullable();
                $table->string('scene_heading')->nullable();
                $table->string('animation_style')->default('stadium-light');
                $table->text('short_description');
                $table->longText('full_description')->nullable();
                $table->longText('benefits_json')->nullable();
                $table->longText('highlights_json')->nullable();
                $table->string('cover_image')->nullable();
                $table->longText('gallery_json')->nullable();
                $table->string('cta_text')->default('EXPLORE DISCIPLINE');
                $table->integer('display_order')->default(0);
                $table->boolean('is_published')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('programs')) {
            Schema::create('programs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('discipline_id')->nullable()->constrained('disciplines')->nullOnDelete();
                $table->string('title');
                $table->string('slug')->unique();
                $table->string('category')->default('sports');
                $table->text('description');
                $table->string('age_group')->nullable();
                $table->string('coaching_format')->nullable();
                $table->string('schedule_info')->nullable();
                $table->string('cover_image')->nullable();
                $table->integer('display_order')->default(0);
                $table->boolean('is_published')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('events')) {
            Schema::create('events', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('slug')->unique();
                $table->text('short_description')->nullable();
                $table->longText('description');
                $table->string('cover_image')->nullable();
                $table->longText('additional_images_json')->nullable();
                $table->string('discipline')->nullable()->index();
                $table->date('start_date')->nullable();
                $table->date('end_date')->nullable();
                $table->string('start_time')->nullable();
                $table->string('end_time')->nullable();
                $table->string('venue')->nullable();
                $table->string('registration_url')->nullable();
                $table->string('contact_details')->nullable();
                $table->boolean('is_featured')->default(false);
                $table->string('status')->default('published')->index(); // draft, published, archived
                $table->string('meta_title')->nullable();
                $table->text('meta_description')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('gallery_albums')) {
            Schema::create('gallery_albums', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->string('cover_image')->nullable();
                $table->integer('display_order')->default(0);
                $table->boolean('is_published')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('gallery_items')) {
            Schema::create('gallery_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('album_id')->nullable()->constrained('gallery_albums')->nullOnDelete();
                $table->foreignId('event_id')->nullable()->constrained('events')->nullOnDelete();
                $table->string('title');
                $table->text('caption')->nullable();
                $table->string('category')->default('Training Sessions')->index();
                $table->string('discipline')->nullable()->index();
                $table->string('media_type')->default('photo'); // photo or video
                $table->string('media_url');
                $table->string('alt_text')->nullable();
                $table->integer('display_order')->default(0);
                $table->boolean('is_featured')->default(false);
                $table->boolean('is_published')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('product_categories')) {
            Schema::create('product_categories', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->integer('display_order')->default(0);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('products')) {
            Schema::create('products', function (Blueprint $table) {
                $table->id();
                $table->foreignId('category_id')->nullable()->constrained('product_categories')->nullOnDelete();
                $table->string('category_name')->default('Training Gear')->index();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('sku')->unique();
                $table->text('description');
                $table->decimal('price', 10, 2)->default(0);
                $table->decimal('sale_price', 10, 2)->nullable();
                $table->integer('stock_quantity')->default(10);
                $table->string('image_url')->nullable();
                $table->longText('gallery_json')->nullable();
                $table->boolean('is_featured')->default(false);
                $table->boolean('is_published')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('leads')) {
            Schema::create('leads', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email');
                $table->string('phone')->nullable();
                $table->string('preferred_discipline')->nullable()->index();
                $table->string('enquiry_type')->default('General Enquiry');
                $table->text('message');
                $table->string('source_page')->default('/');
                $table->string('status')->default('New')->index(); // New, Contacted, Follow-up, Converted, Closed
                $table->string('assigned_to')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('lead_notes')) {
            Schema::create('lead_notes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('lead_id')->constrained('leads')->cascadeOnDelete();
                $table->string('author_name')->default('Administrator');
                $table->text('note');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('media')) {
            Schema::create('media', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('filename');
                $table->string('file_url');
                $table->string('mime_type')->nullable();
                $table->integer('file_size')->default(0);
                $table->string('alt_text')->nullable();
                $table->string('usage_role')->default('general')->index();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('activity_logs')) {
            Schema::create('activity_logs', function (Blueprint $table) {
                $table->id();
                $table->string('actor_name')->default('Admin');
                $table->string('action');
                $table->string('entity_type')->nullable();
                $table->unsignedBigInteger('entity_id')->nullable();
                $table->text('details')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('media');
        Schema::dropIfExists('lead_notes');
        Schema::dropIfExists('leads');
        Schema::dropIfExists('products');
        Schema::dropIfExists('product_categories');
        Schema::dropIfExists('gallery_items');
        Schema::dropIfExists('gallery_albums');
        Schema::dropIfExists('events');
        Schema::dropIfExists('programs');
        Schema::dropIfExists('disciplines');
        Schema::dropIfExists('team_members');
        Schema::dropIfExists('timeline_milestones');
        Schema::dropIfExists('page_sections');
        Schema::dropIfExists('pages');
        Schema::dropIfExists('settings');
        Schema::dropIfExists('users');
    }
};
