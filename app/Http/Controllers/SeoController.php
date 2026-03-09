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
                'question' => 'Ni nini Fortco Company Limited na inafanya nini? | What is Fortco Company Limited and what does it do?',
                'answer' => 'Fortco Company Limited ni kampuni kuu ya ujenzi inayotoa huduma za ujenzi wa majengo, barabara, na miundombinu Afrika Mashariki. Tunajihusisha na miradi ya ujenzi wa makazi, biashara, na viwanda. Tunatoa huduma za ubora wa hali ya juu kutoka mipango hadi ukamilishaji wa mradi. | Fortco Company Limited is a leading construction company providing building, road, and infrastructure construction services across East Africa. We specialize in residential, commercial, and industrial construction projects. We provide high-quality services from planning to project completion.'
            ],
            [
                'question' => 'Je, Fortco inafanya aina gani za miradi ya ujenzi? | What types of construction projects does Fortco handle?',
                'answer' => 'Fortco Company Limited inafanya miradi yote ya ujenzi ikiwa ni pamoja na ujenzi wa nyumba za kibinafsi, majengo ya biashara, barabara, madaraja, na miradi ya miundombinu. Tunafanya miradi ya kila ukubwa kutoka ndogo hadi kubwa. | Fortco Company Limited handles all types of construction projects including residential buildings, commercial structures, roads, bridges, and infrastructure projects. We handle projects of all sizes from small to large scale.'
            ],
            [
                'question' => 'Je, Fortco inatoa huduma katika lugha gani? | What languages does Fortco provide services in?',
                'answer' => 'Fortco Company Limited inatoa huduma kwa lugha za Kiswahili na Kiingereza ili kurahisisha mawasiliano na wateja wote. Tunajumuisha mazingira ya kilugha ya Afrika Mashariki. | Fortco Company Limited provides services in both Swahili and English to facilitate communication with all clients. We include the linguistic environment of East Africa.'
            ],
            [
                'question' => 'Ni nchi zipi za Afrika Mashariki mnazoitumikia? | Which East African countries do you serve?',
                'answer' => 'Tunatoa huduma zetu katika nchi za Kenya, Tanzania, Uganda, Rwanda, na maeneo mengine ya Afrika Mashariki. Mfumo wetu umejengwa kwa kuzingatia mahitaji ya kikanda. | We provide our services in Kenya, Tanzania, Uganda, Rwanda, and other East African regions. Our system is built considering regional requirements.'
            ],
            [
                'question' => 'Je, Fortco ina wafanyakazi wa kutosha kwa miradi mikubwa? | Does Fortco have enough workforce for large projects?',
                'answer' => 'Ndio, Fortco Company Limited ina timu kubwa ya wafanyakazi wenye ujuzi ikiwa ni pamoja na wahandisi, mafundi, na wataalamu wa ujenzi. Tunaweza kushughulikia miradi mikubwa na midogo pia. | Yes, Fortco Company Limited has a large team of skilled workers including engineers, craftsmen, and construction specialists. We can handle both large and small projects.'
            ],
            [
                'question' => 'Je, ni gharama gani za huduma za Fortco? | What are the costs of Fortco services?',
                'answer' => 'Tunatoa bei za ushindani kulingana na ukubwa wa mradi na mahitaji yako. Wasiliana nasi kupata nukuu ya kibinafsi na mazungumzo ya bure ya mradi. | We offer competitive prices based on project size and your requirements. Contact us for a personalized quote and free project consultation.'
            ],
            [
                'question' => 'Je, Fortco ina uhakika wa ubora wa kazi? | Does Fortco guarantee quality of work?',
                'answer' => 'Ndio, Fortco Company Limited inahakikisha ubora wa hali ya juu katika kila mradi. Tunatumia vifaa vya kisasa na wafanyakazi wenye ujuzi. Tunatoa dhamana ya kazi zetu. | Yes, Fortco Company Limited ensures high quality in every project. We use modern equipment and skilled workers. We provide warranty for our work.'
            ],
            [
                'question' => 'Je, Fortco inaweza kufanya kazi na makampuni mengine? | Can Fortco work with other companies?',
                'answer' => 'Ndio, Fortco Company Limited inaweza kushirikiana na makampuni mengine ya ujenzi, wauzaji wa vifaa, na watoa huduma. Tunatoa ushirikiano wa kina katika miradi mikubwa. | Yes, Fortco Company Limited can collaborate with other construction companies, equipment suppliers, and service providers. We provide comprehensive partnerships in large projects.'
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
            'name' => 'Fortco Company Limited',
            'alternateName' => 'Fortco Construction Company',
            'description' => 'Fortco Company Limited ni kampuni kuu ya ujenzi inayotoa huduma za ujenzi wa majengo, barabara, na miundombinu Afrika Mashariki. Leading construction company providing building, road, and infrastructure construction services across East Africa.',
            'url' => url('/'),
            'logo' => url('/construction-site-architecture-black-woman-with-smartphone-typing-connection-african-person-engineering-inspector-with-cellphone-safety-online-reading-with-digital-app-internet_590464-510750.jpg'),
            'foundingDate' => '2020',
            'numberOfEmployees' => '100-500',
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => 'Dar es Salaam Business District',
                'addressLocality' => 'Dar es Salaam',
                'addressRegion' => 'Dar es Salaam',
                'addressCountry' => 'Tanzania',
                'postalCode' => '12345'
            ],
            'contactPoint' => [
                '@type' => 'ContactPoint',
                'telephone' => '+255-XXX-XXXX',
                'contactType' => 'customer service',
                'availableLanguage' => ['Swahili', 'English'],
                'areaServed' => 'East Africa'
            ],
            'sameAs' => [
                'https://www.facebook.com/fortcocompany',
                'https://www.twitter.com/fortcocompany',
                'https://www.linkedin.com/company/fortco-company-limited',
                'https://www.instagram.com/fortcocompany'
            ],
            'areaServed' => [
                'Tanzania', 'Kenya', 'Uganda', 'Rwanda', 'Burundi', 'East Africa'
            ],
            'serviceType' => [
                'Building Construction',
                'Road Construction',
                'Bridge Construction',
                'Infrastructure Development',
                'Residential Construction',
                'Commercial Construction',
                'Industrial Construction',
                'Civil Engineering',
                'Project Management',
                'Construction Supervision'
            ],
            'knowsAbout' => [
                'Building Construction',
                'Road Construction',
                'Infrastructure Development',
                'Civil Engineering',
                'Project Management',
                'Construction Materials',
                'Quality Control',
                'Safety Management',
                'Construction Planning',
                'Structural Engineering'
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
                    'body' => 'Fortco Company Limited imefanya kazi nzuri sana katika ujenzi wa nyumba yangu. Wafanyakazi wao ni wataalamu na wanafanya kazi kwa wakati. Ninashukuru sana! | Fortco Company Limited did excellent work in building my house. Their workers are professionals and work on time. Thank you very much!',
                    'date' => '2024-01-15'
                ],
                [
                    'author' => 'Grace Wanjiku',
                    'rating' => 5,
                    'body' => 'Huduma za Fortco ni bora sana. Walijenga ofisi yetu kwa ubora wa hali ya juu na kwa bei nzuri. Tunapendekeza kampuni hii kwa kila mtu. | Fortco services are excellent. They built our office with high quality and at a good price. We recommend this company to everyone.',
                    'date' => '2024-02-10'
                ],
                [
                    'author' => 'Peter Kimani',
                    'rating' => 5,
                    'body' => 'Fortco walijenga barabara ya kijiji chetu kwa ubora mkubwa. Mradi ulikamilika kwa wakati na hakuna matatizo yoyote. Asanteni sana! | Fortco built our village road with great quality. The project was completed on time with no problems. Thank you very much!',
                    'date' => '2024-02-28'
                ],
                [
                    'author' => 'Sarah Muthoni',
                    'rating' => 5,
                    'body' => 'Kampuni bora ya ujenzi Afrika Mashariki. Walijenga duka langu la biashara kwa ubora wa hali ya juu. Nawapendekeza sana! | Best construction company in East Africa. They built my business shop with high quality. I highly recommend them!',
                    'date' => '2024-03-05'
                ]
            ],
            'aggregateRating' => [
                'rating' => 4.9,
                'count' => 247
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
                'anchor' => 'Kampuni ya Ujenzi | Leading Construction Company',
                'title' => 'Fortco Company Limited - Nyumbani | Home',
                'description' => 'Ukurasa mkuu wa kampuni kuu ya ujenzi Afrika Mashariki'
            ],
            [
                'url' => '/services',
                'anchor' => 'Huduma za Ujenzi | Construction Services', 
                'title' => 'Huduma zetu za ujenzi wa majengo na miundombinu',
                'description' => 'Huduma kamili za ujenzi wa nyumba, barabara na miundombinu'
            ],
            [
                'url' => '/projects',
                'anchor' => 'Miradi ya Ujenzi | Construction Projects',
                'title' => 'Miradi yetu ya ujenzi na mafanikio',
                'description' => 'Mifano ya miradi ya ujenzi tuliyokamilisha kwa mafanikio'
            ],
            [
                'url' => '/about',
                'anchor' => 'Kuhusu Sisi | About Us',
                'title' => 'Kuhusu Fortco Company Limited na huduma zetu',
                'description' => 'Historia yetu na malengo ya kampuni ya ujenzi'
            ],
            [
                'url' => '/contact',
                'anchor' => 'Wasiliana Nasi | Contact Us',
                'title' => 'Wasiliana na timu yetu ya wataalamu wa ujenzi',
                'description' => 'Pata msaada na maelezo zaidi kuhusu huduma za ujenzi'
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
