<?php

namespace App\Http\Controllers;

use App\Services\SeoService;
use Illuminate\Http\Request;

class SeoController extends Controller
{
    protected $seoService;

    public function __construct(SeoService $seoService)
    {
        $this->seoService = $seoService;
    }

    /**
     * Get FAQ data with Swahili and English content
     */
    public function getFaqData()
    {
        return [
            [
                'question' => 'Ni nini FortCo ERP na inafanya nini? | What is FortCo ERP and what does it do?',
                'answer' => 'FortCo ERP ni mfumo mkuu wa uongozi wa miradi ya ujenzi unaowezesha kampuni za ujenzi kusimamia miradi yao, wafanyakazi, na rasilimali kwa ufanisi. Mfumo huu unaongoza kila kitu kutoka mipango ya awali hadi ukamilishaji wa mradi. | FortCo ERP is a comprehensive construction management system that enables construction companies to efficiently manage their projects, workforce, and resources. The system handles everything from initial planning to project completion.'
            ],
            [
                'question' => 'Je, mfumo huu unaweza kutumika kwa miradi ya aina gani? | What types of projects can this system handle?',
                'answer' => 'Mfumo wetu unaweza kusimamia miradi yote ya ujenzi ikiwa ni pamoja na ujenzi wa nyumba za kibinafsi, majengo ya biashara, barabara, madaraja, na miradi ya miundombinu. Tunasaidia miradi ya kila ukubwa kutoka ndogo hadi kubwa. | Our system can manage all types of construction projects including residential buildings, commercial structures, roads, bridges, and infrastructure projects. We support projects of all sizes from small to large scale.'
            ],
            [
                'question' => 'Je, mfumo huu unatumika lugha gani? | What languages does the system support?',
                'answer' => 'Mfumo wetu unapatikana kwa lugha za Kiswahili na Kiingereza ili kurahisisha matumizi kwa wafanyakazi wote. Tunajumuisha mazingira ya kilugha ya Afrika Mashariki. | Our system is available in both Swahili and English to make it accessible to all workers. We include the linguistic environment of East Africa.'
            ],
            [
                'question' => 'Ni nchi zipi za Afrika Mashariki mnazoitumikia? | Which East African countries do you serve?',
                'answer' => 'Tunatoa huduma zetu katika nchi za Kenya, Tanzania, Uganda, Rwanda, na maeneo mengine ya Afrika Mashariki. Mfumo wetu umejengwa kwa kuzingatia mahitaji ya kikanda. | We provide our services in Kenya, Tanzania, Uganda, Rwanda, and other East African regions. Our system is built considering regional requirements.'
            ],
            [
                'question' => 'Je, mfumo huu unaweza kusaidia katika usimamizi wa wafanyakazi? | Can this system help with workforce management?',
                'answer' => 'Ndio, mfumo wetu una vipengele vya kina vya usimamizi wa wafanyakazi ikiwa ni pamoja na ufuatiliaji wa mahudhurio, usimamizi wa mishahara, ugavi wa kazi, na tathmini ya utendaji. | Yes, our system has comprehensive workforce management features including attendance tracking, payroll management, task assignment, and performance evaluation.'
            ],
            [
                'question' => 'Je, ni gharama gani za kutumia mfumo huu? | What are the costs of using this system?',
                'answer' => 'Tunatoa mipango ya bei tofauti kulingana na ukubwa wa kampuni yako na mahitaji yako. Wasiliana nasi kupata nukuu ya kibinafsi na onyesho la bure la mfumo. | We offer different pricing plans based on your company size and requirements. Contact us for a personalized quote and free system demonstration.'
            ],
            [
                'question' => 'Je, mfumo huu una usalama wa kutosha wa data? | Does this system have adequate data security?',
                'answer' => 'Tunatumia teknolojia ya hali ya juu ya usalama ikiwa ni pamoja na usimbaji fiche, uthibitishaji wa hatua mbili, na kuhifadhi data kwa njia salama. Data yako ni salama na imehifadhiwa. | We use advanced security technology including encryption, two-factor authentication, and secure data storage. Your data is safe and protected.'
            ],
            [
                'question' => 'Je, mfumo huu unaweza kuunganishwa na mifumo mingine? | Can this system integrate with other systems?',
                'answer' => 'Ndio, mfumo wetu unaweza kuunganishwa na mifumo mingine ya hesabu, benki, na usimamizi wa rasilimali. Tunatoa API na viunganishi vya kimsingi. | Yes, our system can integrate with other accounting, banking, and resource management systems. We provide APIs and standard connectors.'
            ]
        ];
    }

    /**
     * Get organization schema data
     */
    public function getOrganizationSchema()
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => 'FortCo ERP',
            'alternateName' => 'FortCo Construction Management System',
            'description' => 'Mfumo mkuu wa uongozi wa miradi ya ujenzi, usimamizi wa wafanyakazi, na huduma za kiufundi. Professional construction ERP system for project management in East Africa.',
            'url' => url('/'),
            'logo' => url('/construction-site-architecture-black-woman-with-smartphone-typing-connection-african-person-engineering-inspector-with-cellphone-safety-online-reading-with-digital-app-internet_590464-510750.jpg'),
            'foundingDate' => '2024',
            'address' => [
                '@type' => 'PostalAddress',
                'addressLocality' => 'Nairobi',
                'addressCountry' => 'Kenya',
                'addressRegion' => 'East Africa'
            ],
            'contactPoint' => [
                '@type' => 'ContactPoint',
                'telephone' => '+254-XXX-XXXX',
                'contactType' => 'customer service',
                'availableLanguage' => ['Swahili', 'English'],
                'areaServed' => 'East Africa'
            ],
            'sameAs' => [
                'https://www.facebook.com/fortcoerp',
                'https://www.twitter.com/fortcoerp',
                'https://www.linkedin.com/company/fortcoerp'
            ],
            'areaServed' => [
                'Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'East Africa'
            ],
            'serviceType' => [
                'Construction Management',
                'Project Management', 
                'ERP Software',
                'Workforce Management',
                'Technical Services'
            ],
            'knowsAbout' => [
                'Construction Management',
                'Project Planning',
                'Workforce Coordination',
                'Resource Management',
                'Quality Control',
                'Safety Management',
                'Cost Management',
                'Schedule Management'
            ]
        ];
    }

    /**
     * Get sample reviews data
     */
    public function getReviewsData()
    {
        return [
            'reviews' => [
                [
                    'author' => 'John Mwangi',
                    'rating' => 5,
                    'body' => 'Mfumo huu umebadilisha jinsi tunavyosimamia miradi yetu ya ujenzi. Ni rahisi kutumia na una vipengele vyote tunavyohitaji. | This system has transformed how we manage our construction projects. It\'s easy to use and has all the features we need.',
                    'date' => '2024-01-15'
                ],
                [
                    'author' => 'Grace Wanjiku',
                    'rating' => 5,
                    'body' => 'Huduma za wateja ni bora na mfumo unafanya kazi vizuri. Tunashukuru kwa msaada wao wa haraka. | Customer service is excellent and the system works perfectly. We appreciate their quick support.',
                    'date' => '2024-02-10'
                ],
                [
                    'author' => 'Peter Kimani',
                    'rating' => 4,
                    'body' => 'Mfumo mzuri wa kusimamia wafanyakazi na miradi. Umesaidia sana katika kupunguza gharama za mradi. | Great system for managing workers and projects. It has helped a lot in reducing project costs.',
                    'date' => '2024-02-28'
                ]
            ],
            'aggregateRating' => [
                'rating' => 4.7,
                'count' => 127
            ]
        ];
    }

    /**
     * Get internal linking data
     */
    public function getInternalLinks()
    {
        return [
            [
                'url' => '/',
                'anchor' => 'Mfumo wa Uongozi wa Miradi | Construction Management System',
                'title' => 'FortCo ERP - Nyumbani | Home',
                'description' => 'Ukurasa mkuu wa mfumo wa uongozi wa miradi ya ujenzi'
            ],
            [
                'url' => '/services',
                'anchor' => 'Huduma za Ujenzi | Construction Services', 
                'title' => 'Huduma zetu za ujenzi na usimamizi wa miradi',
                'description' => 'Huduma kamili za uongozi wa miradi ya ujenzi'
            ],
            [
                'url' => '/projects',
                'anchor' => 'Miradi ya Ujenzi | Construction Projects',
                'title' => 'Miradi yetu ya ujenzi na mafanikio',
                'description' => 'Mifano ya miradi tuliyokamilisha kwa mafanikio'
            ],
            [
                'url' => '/about',
                'anchor' => 'Kuhusu Sisi | About Us',
                'title' => 'Kuhusu FortCo ERP na huduma zetu',
                'description' => 'Historia yetu na malengo ya kampuni'
            ],
            [
                'url' => '/contact',
                'anchor' => 'Wasiliana Nasi | Contact Us',
                'title' => 'Wasiliana na timu yetu ya wataalamu',
                'description' => 'Pata msaada na maelezo zaidi kuhusu huduma zetu'
            ]
        ];
    }

    /**
     * Get breadcrumb data for different pages
     */
    public function getBreadcrumbs($currentPage)
    {
        $breadcrumbs = [
            [
                'name' => 'Nyumbani | Home',
                'url' => url('/')
            ]
        ];

        switch ($currentPage) {
            case 'services':
                $breadcrumbs[] = [
                    'name' => 'Huduma | Services',
                    'url' => url('/services')
                ];
                break;
            case 'projects':
                $breadcrumbs[] = [
                    'name' => 'Miradi | Projects', 
                    'url' => url('/projects')
                ];
                break;
            case 'about':
                $breadcrumbs[] = [
                    'name' => 'Kuhusu | About',
                    'url' => url('/about')
                ];
                break;
            case 'contact':
                $breadcrumbs[] = [
                    'name' => 'Mawasiliano | Contact',
                    'url' => url('/contact')
                ];
                break;
        }

        return $breadcrumbs;
    }
}
