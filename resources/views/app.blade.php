<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- SEO Meta Tags -->
        {!! \Artesaos\SEOTools\Facades\SEOMeta::generate() !!}
        {!! \Artesaos\SEOTools\Facades\OpenGraph::generate() !!}
        {!! \Artesaos\SEOTools\Facades\TwitterCard::generate() !!}
        {!! \Artesaos\SEOTools\Facades\JsonLd::generate() !!}

        <title inertia>{{ config('app.name', 'Fortco Company Limited') }}</title>

        <!-- Favicons -->
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="apple-touch-icon" href="/construction-site-architecture-black-woman-with-smartphone-typing-connection-african-person-engineering-inspector-with-cellphone-safety-online-reading-with-digital-app-internet_590464-510750.jpg">
        <link rel="manifest" href="/manifest.json">

        <!-- Preconnect for performance -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="dns-prefetch" href="//www.google-analytics.com">
        <link rel="dns-prefetch" href="//fonts.googleapis.com">

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=SN+Pro:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet">

        <!-- Additional SEO Meta Tags -->
        <meta name="theme-color" content="#2563eb">
        <meta name="msapplication-TileColor" content="#2563eb">
        <meta name="application-name" content="FortCo ERP">
        <meta name="apple-mobile-web-app-title" content="FortCo ERP">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        
        <!-- Geo Tags for East Africa -->
        <meta name="geo.region" content="KE">
        <meta name="geo.placename" content="East Africa">
        <meta name="geo.position" content="-1.286389;36.817223">
        <meta name="ICBM" content="-1.286389, 36.817223">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
