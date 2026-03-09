import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const FaqSection = ({ faqs, title = "Maswali Yanayoulizwa Mara Kwa Mara | Frequently Asked Questions" }) => {
    const [openItems, setOpenItems] = useState({});

    const toggleItem = (index) => {
        setOpenItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Generate FAQ Schema JSON-LD
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <section className="py-16 bg-gray-50">
            {/* FAQ Schema JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        {title}
                    </h2>
                    <p className="text-lg text-gray-600">
                        Jibu la haraka kwa maswali yako kuhusu mfumo wetu wa uongozi wa miradi ya ujenzi.
                        Quick answers to your questions about our construction management system.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-sm border border-gray-200"
                        >
                            <button
                                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                                onClick={() => toggleItem(index)}
                                aria-expanded={openItems[index] || false}
                            >
                                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                                    {faq.question}
                                </h3>
                                {openItems[index] ? (
                                    <ChevronUpIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                ) : (
                                    <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                )}
                            </button>
                            
                            {openItems[index] && (
                                <div className="px-6 pb-4">
                                    <div className="text-gray-700 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">
                        Je, una swali lingine? | Have another question?
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Wasiliana Nasi | Contact Us
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FaqSection;
