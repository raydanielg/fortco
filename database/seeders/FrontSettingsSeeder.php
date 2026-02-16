<?php

namespace Database\Seeders;

use App\Models\FrontSetting;
use Illuminate\Database\Seeder;

class FrontSettingsSeeder extends Seeder
{
    public function run(): void
    {
        FrontSetting::query()->updateOrCreate(
            ['section' => 'header', 'key' => 'logo_url'],
            ['value' => '/logo.png']
        );

        FrontSetting::query()->updateOrCreate(
            ['section' => 'header', 'key' => 'menu_items'],
            [
                'value' => [
                    ['label' => 'Home', 'href' => '/'],
                    ['label' => 'About', 'href' => '/about'],
                    ['label' => 'Services', 'href' => '/services'],
                    ['label' => 'Portfolio', 'href' => '/portfolio'],
                    ['label' => 'Contact', 'href' => '/#contact'],
                    ['label' => 'Login', 'href' => '/login'],
                ],
            ]
        );

        FrontSetting::query()->updateOrCreate(
            ['section' => 'header', 'key' => 'cta_text'],
            ['value' => 'BOOK ONLINE']
        );

        FrontSetting::query()->updateOrCreate(
            ['section' => 'header', 'key' => 'cta_link'],
            ['value' => '/#contact']
        );
    }
}
