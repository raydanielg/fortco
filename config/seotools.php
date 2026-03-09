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
            'title'        => "Fortco Company Limited - Kampuni ya Ujenzi | Leading Construction Company in East Africa", // set false to total remove
            'titleBefore'  => false, // Put defaults.title before page title, like 'It's Over 9000! - Dashboard'
            'description'  => 'Fortco Company Limited ni kampuni kuu ya ujenzi inayotoa huduma za ujenzi wa majengo, barabara, na miundombinu Afrika Mashariki. Tunatoa huduma za ubora wa hali ya juu kwa miradi yote ya ujenzi. Leading construction company providing building, road, and infrastructure construction services across East Africa.', // set false to total remove
            'separator'    => ' | ',
            'keywords'     => [
                // Swahili Keywords - Construction Focus
                'kampuni ya ujenzi', 'ujenzi wa nyumba', 'ujenzi wa majengo', 'huduma za ujenzi',
                'wafanyakazi wa ujenzi', 'vifaa vya ujenzi', 'miradi ya ujenzi', 'ujenzi wa barabara',
                'ujenzi wa daraja', 'ujenzi wa makazi', 'ujenzi wa ofisi', 'ujenzi wa duka',
                'ujenzi wa shule', 'ujenzi wa hospitali', 'ujenzi wa kiwanda', 'mipango ya ujenzi',
                'uongozi wa miradi', 'usimamizi wa ujenzi', 'huduma za kiufundi', 'teknolojia ya ujenzi',
                'viwanda vya ujenzi', 'makontrakta wa ujenzi', 'injinia wa ujenzi', 'foreman wa ujenzi',
                
                // English Keywords - Construction Company Focus
                'construction company', 'building construction', 'construction services', 'construction contractor',
                'building contractor', 'construction projects', 'infrastructure construction', 'road construction',
                'bridge construction', 'residential construction', 'commercial construction', 'industrial construction',
                'construction management', 'project management', 'construction planning', 'building services',
                'construction technology', 'construction equipment', 'construction materials', 'construction workers',
                'civil engineering', 'structural engineering', 'construction supervision', 'quality construction',
                
                // Location-based Keywords
                'ujenzi Kenya', 'construction Tanzania', 'ujenzi Uganda', 'construction East Africa',
                'building contractors Kenya', 'construction companies Tanzania', 'ujenzi Nairobi',
                'construction Dar es Salaam', 'building services Kampala', 'ujenzi Mombasa',
                'construction Arusha', 'ujenzi Dodoma', 'construction Kampala', 'building contractors East Africa'
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
            'title'       => 'Fortco Company Limited - Kampuni ya Ujenzi', // set false to total remove
            'description' => 'Fortco Company Limited ni kampuni kuu ya ujenzi inayotoa huduma za ujenzi wa majengo, barabara, na miundombinu Afrika Mashariki. Leading construction company in East Africa providing quality building and infrastructure services.', // set false to total remove
            'url'         => null, // Set null for using Url::current(), set false to total remove
            'type'        => 'website',
            'site_name'   => 'Fortco Company Limited',
            'images'      => ['/construction-site-architecture-black-woman-with-smartphone-typing-connection-african-person-engineering-inspector-with-cellphone-safety-online-reading-with-digital-app-internet_590464-510750.jpg'],
        ],
    ],
    'twitter' => [
        /*
         * The default values to be used by the twitter cards generator.
         */
        'defaults' => [
            'card'        => 'summary_large_image',
            'site'        => '@FortcoCompany',
            'creator'     => '@FortcoCompany',
        ],
    ],
    'json-ld' => [
        /*
         * The default configurations to be used by the json-ld generator.
         */
        'defaults' => [
            'title'       => 'Fortco Company Limited - Kampuni ya Ujenzi', // set false to total remove
            'description' => 'Fortco Company Limited ni kampuni kuu ya ujenzi inayotoa huduma za ujenzi wa majengo, barabara, na miundombinu Afrika Mashariki. Leading construction company in East Africa providing quality building and infrastructure services.', // set false to total remove
            'url'         => 'current', // Set to null or 'full' to use Url::full(), set to 'current' to use Url::current(), set false to total remove
            'type'        => 'WebPage',
            'images'      => ['/construction-site-architecture-black-woman-with-smartphone-typing-connection-african-person-engineering-inspector-with-cellphone-safety-online-reading-with-digital-app-internet_590464-510750.jpg'],
        ],
    ],
];
