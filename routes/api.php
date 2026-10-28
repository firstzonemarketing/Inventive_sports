<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\InventiveCmsController;

/*
|--------------------------------------------------------------------------
| Inventive Sports & Performing Arts — Versioned REST API (/api/v1)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Public Endpoints
    Route::get('/public/bootstrap', [InventiveCmsController::class, 'publicBootstrap']);
    Route::post('/public/leads', [InventiveCmsController::class, 'submitLead']);

    // Admin Authentication
    Route::post('/admin/login', [InventiveCmsController::class, 'login']);
    Route::post('/admin/logout', [InventiveCmsController::class, 'logout']);
    Route::get('/admin/dashboard', [InventiveCmsController::class, 'adminDashboard']);

    // Module A — Website Content & Timeline Milestones
    Route::post('/admin/settings', [InventiveCmsController::class, 'updateSettings']);
    Route::post('/admin/milestones', [InventiveCmsController::class, 'saveMilestone']);
    Route::match(['put', 'post'], '/admin/milestones/{id}', [InventiveCmsController::class, 'saveMilestone']);
    Route::delete('/admin/milestones/{id}', [InventiveCmsController::class, 'deleteMilestone']);

    // Module B — Leadership & Team Management
    Route::post('/admin/team', [InventiveCmsController::class, 'saveTeamMember']);
    Route::match(['put', 'post'], '/admin/team/{id}', [InventiveCmsController::class, 'saveTeamMember']);
    Route::delete('/admin/team/{id}', [InventiveCmsController::class, 'deleteTeamMember']);

    // Module C — Sports & Programs Management
    Route::post('/admin/disciplines', [InventiveCmsController::class, 'saveDiscipline']);
    Route::match(['put', 'post'], '/admin/disciplines/{id}', [InventiveCmsController::class, 'saveDiscipline']);
    Route::delete('/admin/disciplines/{id}', [InventiveCmsController::class, 'deleteDiscipline']);

    // Module D — Events Management
    Route::post('/admin/events', [InventiveCmsController::class, 'saveEvent']);
    Route::match(['put', 'post'], '/admin/events/{id}', [InventiveCmsController::class, 'saveEvent']);
    Route::delete('/admin/events/{id}', [InventiveCmsController::class, 'deleteEvent']);

    // Module E — Gallery Management
    Route::post('/admin/gallery', [InventiveCmsController::class, 'saveGalleryItem']);
    Route::match(['put', 'post'], '/admin/gallery/{id}', [InventiveCmsController::class, 'saveGalleryItem']);
    Route::delete('/admin/gallery/{id}', [InventiveCmsController::class, 'deleteGalleryItem']);

    // Module F — Shop Management
    Route::post('/admin/products', [InventiveCmsController::class, 'saveProduct']);
    Route::match(['put', 'post'], '/admin/products/{id}', [InventiveCmsController::class, 'saveProduct']);
    Route::delete('/admin/products/{id}', [InventiveCmsController::class, 'deleteProduct']);

    // Module G — Lead Management & CSV Export
    Route::match(['put', 'post'], '/admin/leads/{id}', [InventiveCmsController::class, 'updateLead']);
    Route::delete('/admin/leads/{id}', [InventiveCmsController::class, 'deleteLead']);
    Route::get('/admin/leads/export/csv', [InventiveCmsController::class, 'exportLeadsCsv']);

    // Module H — Media Library
    Route::post('/admin/media/upload', [InventiveCmsController::class, 'uploadMedia']);
    Route::delete('/admin/media/{id}', [InventiveCmsController::class, 'deleteMedia']);
});
