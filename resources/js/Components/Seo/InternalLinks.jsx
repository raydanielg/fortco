import React from 'react';
import { Link } from '@inertiajs/react';

const InternalLinks = ({ links, currentPage, className = "" }) => {
    // Filter out current page from links
    const filteredLinks = links.filter(link => 
        !link.url.includes(currentPage) && link.url !== window.location.pathname
    );

    return (
        <div className={`internal-links ${className}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Viungo Muhimu | Important Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLinks.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url}
                        className="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200"
                        title={link.title}
                    >
                        <h4 className="font-medium text-blue-600 hover:text-blue-800 mb-2">
                            {link.anchor}
                        </h4>
                        {link.description && (
                            <p className="text-sm text-gray-600">
                                {link.description}
                            </p>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default InternalLinks;
