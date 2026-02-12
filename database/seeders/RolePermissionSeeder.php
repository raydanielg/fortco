<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $dashboardPermissions = [
            'view_dashboard',
            'view_analytics',
            'view_reports',
            'export_reports',
        ];

        $userPermissions = [
            'view_users',
            'create_users',
            'edit_users',
            'delete_users',
            'assign_roles',
            'view_roles',
            'create_roles',
            'edit_roles',
            'delete_roles',
            'view_permissions',
            'assign_permissions',
        ];

        $propertyPermissions = [
            'view_properties',
            'create_properties',
            'edit_properties',
            'delete_properties',
            'approve_properties',
            'view_property_bookings',
            'manage_property_bookings',
            'view_property_inquiries',
            'respond_inquiries',
        ];

        $constructionPermissions = [
            'view_projects',
            'create_projects',
            'edit_projects',
            'delete_projects',
            'manage_project_phases',
            'view_materials',
            'manage_materials',
            'view_workers',
            'manage_workers',
            'view_project_expenses',
            'manage_project_expenses',
            'view_progress_reports',
            'create_progress_reports',
        ];

        $loanPermissions = [
            'view_loan_companies',
            'manage_loan_companies',
            'view_loan_applications',
            'process_loan_applications',
            'approve_loans',
            'reject_loans',
            'view_loan_payments',
            'manage_loan_payments',
            'view_credit_scores',
        ];

        $appointmentPermissions = [
            'view_appointments',
            'create_appointments',
            'edit_appointments',
            'delete_appointments',
            'confirm_appointments',
            'cancel_appointments',
            'view_services',
            'manage_services',
            'view_consultants',
            'manage_consultants',
        ];

        $portfolioPermissions = [
            'view_portfolio',
            'create_portfolio',
            'edit_portfolio',
            'delete_portfolio',
            'view_gallery',
            'manage_gallery',
            'view_testimonials',
            'manage_testimonials',
        ];

        $contentPermissions = [
            'view_posts',
            'create_posts',
            'edit_posts',
            'delete_posts',
            'publish_posts',
            'view_pages',
            'manage_pages',
            'view_faqs',
            'manage_faqs',
            'view_newsletter',
            'manage_newsletter',
        ];

        $communicationPermissions = [
            'view_contacts',
            'respond_contacts',
            'view_tickets',
            'create_tickets',
            'respond_tickets',
            'close_tickets',
            'view_chat',
            'send_messages',
            'view_email_templates',
            'manage_email_templates',
        ];

        $inventoryPermissions = [
            'view_products',
            'manage_products',
            'view_suppliers',
            'manage_suppliers',
            'view_purchase_orders',
            'manage_purchase_orders',
            'view_stock',
            'manage_stock',
            'view_inventory_alerts',
        ];

        $financialPermissions = [
            'view_transactions',
            'process_payments',
            'view_invoices',
            'create_invoices',
            'view_financial_reports',
            'view_budgets',
            'manage_budgets',
        ];

        $settingsPermissions = [
            'view_settings',
            'manage_settings',
            'view_company_profile',
            'manage_company_profile',
            'view_backups',
            'manage_backups',
            'view_audit_logs',
        ];

        $allPermissions = array_merge(
            $dashboardPermissions,
            $userPermissions,
            $propertyPermissions,
            $constructionPermissions,
            $loanPermissions,
            $appointmentPermissions,
            $portfolioPermissions,
            $contentPermissions,
            $communicationPermissions,
            $inventoryPermissions,
            $financialPermissions,
            $settingsPermissions
        );

        foreach ($allPermissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        $role = Role::findOrCreate('Super Admin', 'web');
        $role->syncPermissions(Permission::all());

        $role = Role::findOrCreate('Admin', 'web');
        $role->syncPermissions([
            'view_dashboard',
            'view_analytics',
            'view_reports',
            'export_reports',
            'view_users',
            'create_users',
            'edit_users',
            'assign_roles',
            'view_properties',
            'create_properties',
            'edit_properties',
            'view_projects',
            'create_projects',
            'edit_projects',
            'view_loan_applications',
            'view_appointments',
            'view_portfolio',
            'view_posts',
            'view_contacts',
            'view_tickets',
            'view_transactions',
            'view_settings',
            'view_company_profile',
        ]);

        $role = Role::findOrCreate('Property Manager', 'web');
        $role->syncPermissions([
            'view_dashboard',
            'view_properties',
            'create_properties',
            'edit_properties',
            'delete_properties',
            'approve_properties',
            'view_property_bookings',
            'manage_property_bookings',
            'view_property_inquiries',
            'respond_inquiries',
            'view_portfolio',
            'view_gallery',
            'manage_gallery',
        ]);

        $role = Role::findOrCreate('Construction Manager', 'web');
        $role->syncPermissions([
            'view_dashboard',
            'view_projects',
            'create_projects',
            'edit_projects',
            'delete_projects',
            'manage_project_phases',
            'view_materials',
            'manage_materials',
            'view_workers',
            'manage_workers',
            'view_project_expenses',
            'manage_project_expenses',
            'view_progress_reports',
            'create_progress_reports',
        ]);

        $role = Role::findOrCreate('Loan Officer', 'web');
        $role->syncPermissions([
            'view_dashboard',
            'view_loan_companies',
            'view_loan_applications',
            'process_loan_applications',
            'approve_loans',
            'reject_loans',
            'view_loan_payments',
            'manage_loan_payments',
            'view_credit_scores',
            'view_transactions',
        ]);

        $role = Role::findOrCreate('Sales Agent', 'web');
        $role->syncPermissions([
            'view_dashboard',
            'view_properties',
            'view_property_bookings',
            'create_appointments',
            'view_appointments',
            'view_contacts',
            'respond_contacts',
            'view_portfolio',
        ]);

        $role = Role::findOrCreate('Consultant', 'web');
        $role->syncPermissions([
            'view_dashboard',
            'view_appointments',
            'edit_appointments',
            'confirm_appointments',
            'cancel_appointments',
            'view_services',
            'view_consultants',
            'view_portfolio',
            'view_properties',
            'view_projects',
        ]);

        $role = Role::findOrCreate('Accountant', 'web');
        $role->syncPermissions([
            'view_dashboard',
            'view_reports',
            'export_reports',
            'view_transactions',
            'process_payments',
            'view_invoices',
            'create_invoices',
            'view_financial_reports',
            'view_budgets',
            'view_project_expenses',
            'view_loan_payments',
        ]);

        $role = Role::findOrCreate('Support Staff', 'web');
        $role->syncPermissions([
            'view_dashboard',
            'view_contacts',
            'respond_contacts',
            'view_tickets',
            'create_tickets',
            'respond_tickets',
            'close_tickets',
            'view_chat',
            'send_messages',
            'view_faqs',
            'manage_faqs',
        ]);

        $role = Role::findOrCreate('Client', 'web');
        $role->syncPermissions([
            'view_properties',
            'view_property_bookings',
            'create_appointments',
            'view_appointments',
            'view_portfolio',
            'view_posts',
            'create_tickets',
            'view_tickets',
            'send_messages',
        ]);

        $role = Role::findOrCreate('Investor', 'web');
        $role->syncPermissions([
            'view_dashboard',
            'view_analytics',
            'view_reports',
            'export_reports',
            'view_financial_reports',
            'view_portfolio',
        ]);

        $role = Role::findOrCreate('Partner', 'web');
        $role->syncPermissions([
            'view_dashboard',
            'view_reports',
            'view_portfolio',
            'view_properties',
        ]);
    }
}
