<?php
/**
 * @see https://github.com/artesaos/seotools
 */

return [
    'inertia' => env('SEO_TOOLS_INERTIA', false),
    'meta' => [
        /*
         * The default configurations to be used by the meta generator.
         */
        'defaults'       => [
            'title'        => "FortCo ERP - Mfumo wa Uongozi wa Miradi ya Ujenzi | Construction Management System", // set false to total remove
            'titleBefore'  => false, // Put defaults.title before page title, like 'It's Over 9000! - Dashboard'
            'description'  => 'Mfumo mkuu wa uongozi wa miradi ya ujenzi, usimamizi wa wafanyakazi, na huduma za kiufundi. Professional construction ERP system for project management, workforce coordination, and technical services in East Africa.', // set false to total remove
            'separator'    => ' | ',
            'keywords'     => [
                // Swahili Keywords
                'mfumo wa uongozi wa miradi', 'ujenzi wa nyumba', 'usimamizi wa mradi', 'huduma za ujenzi',
                'wafanyakazi wa ujenzi', 'vifaa vya ujenzi', 'uongozi wa kampuni', 'miradi ya ujenzi',
                'ujenzi wa majengo', 'huduma za kiufundi', 'uongozi wa biashara', 'mipango ya ujenzi',
                'ujenzi wa barabara', 'viwanda vya ujenzi', 'teknolojia ya ujenzi', 'uongozi wa rasilimali',
                
                // English Keywords  
                'construction management system', 'ERP software', 'project management', 'construction ERP',
                'building construction', 'construction services', 'workforce management', 'construction technology',
                'project coordination', 'construction planning', 'building management', 'construction company',
                'infrastructure development', 'construction projects', 'technical services', 'business management',
                
                // Location-based Keywords
                'ujenzi Kenya', 'construction Tanzania', 'ujenzi Uganda', 'construction East Africa',
                'building contractors Kenya', 'construction companies Tanzania', 'ujenzi Nairobi',
                'construction Dar es Salaam', 'building services Kampala'
            ],
            'canonical'    => 'current', // Set to null or 'full' to use Url::full(), set to 'current' to use Url::current(), set false to total remove
            'robots'       => 'index,follow', // Set to 'all', 'none' or any combination of index/noindex and follow/nofollow
        ],
        /*
         * Webmaster tags are always added.
         */
        'webmaster_tags' => [
            'google'    => null,
            'bing'      => null,
            'alexa'     => null,
            'pinterest' => null,
            'yandex'    => null,
            'norton'    => null,
        ],

        'add_notranslate_class' => false,
    ],
    'opengraph' => [
        /*
         * The default configurations to be used by the opengraph generator.
         */
        'defaults' => [
            'title'       => 'FortCo ERP - Mfumo wa Uongozi wa Miradi ya Ujenzi', // set false to total remove
            'description' => 'Mfumo mkuu wa uongozi wa miradi ya ujenzi, usimamizi wa wafanyakazi, na huduma za kiufundi. Professional construction ERP system for East Africa.', // set false to total remove
            'url'         => null, // Set null for using Url::current(), set false to total remove
            'type'        => 'website',
            'site_name'   => 'FortCo ERP',
            'images'      => ['/construction-site-architecture-black-woman-with-smartphone-typing-connection-african-person-engineering-inspector-with-cellphone-safety-online-reading-with-digital-app-internet_590464-510750.jpg'],
        ],
    ],
    'twitter' => [
        /*
         * The default values to be used by the twitter cards generator.
         */
        'defaults' => [
            'card'        => 'summary_large_image',
            'site'        => '@FortCoERP',
            'creator'     => '@FortCoERP',
        ],
    ],
    'json-ld' => [
        /*
         * The default configurations to be used by the json-ld generator.
         */
        'defaults' => [
            'title'       => 'FortCo ERP - Mfumo wa Uongozi wa Miradi ya Ujenzi', // set false to total remove
            'description' => 'Mfumo mkuu wa uongozi wa miradi ya ujenzi, usimamizi wa wafanyakazi, na huduma za kiufundi. Professional construction ERP system for East Africa.', // set false to total remove
            'url'         => 'current', // Set to null or 'full' to use Url::full(), set to 'current' to use Url::current(), set false to total remove
            'type'        => 'WebPage',
            'images'      => ['/construction-site-architecture-black-woman-with-smartphone-typing-connection-african-person-engineering-inspector-with-cellphone-safety-online-reading-with-digital-app-internet_590464-510750.jpg'],
        ],
    ],
];
