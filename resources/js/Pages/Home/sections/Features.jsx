import AnimatedIcon from '../../../Components/AnimatedIcon';
import activity from 'react-useanimations/lib/activity';
import calendar from 'react-useanimations/lib/calendar';
import checkmark from 'react-useanimations/lib/checkmark';
import lock from 'react-useanimations/lib/lock';
import settings from 'react-useanimations/lib/settings';
import explore from 'react-useanimations/lib/explore';

export default function Features() {
    return (
        <section id="features" className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                <div className="max-w-screen-md mb-8 lg:mb-16">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                        Built for real business operations
                    </h2>
                    <p className="text-gray-500 sm:text-xl dark:text-gray-400">
                        Run your company with clarity—from enquiries to delivery. Automate approvals, track performance,
                        and keep every team aligned across real estate and construction.
                    </p>
                </div>

                <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
                    <div>
                        <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <AnimatedIcon
                                animation={lock}
                                size={24}
                                strokeColor="#2563eb"
                                autoplay
                                loop
                                speed={0.9}
                            />
                        </div>
                        <h3 className="mb-2 text-xl font-bold dark:text-white">Access Control & Security</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Give every staff member the right access. Roles, permissions and audit-ready accountability.
                        </p>
                    </div>

                    <div>
                        <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <AnimatedIcon
                                animation={explore}
                                size={24}
                                strokeColor="#2563eb"
                                autoplay
                                loop
                                speed={0.9}
                            />
                        </div>
                        <h3 className="mb-2 text-xl font-bold dark:text-white">Sales-Ready Property Management</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Manage listings, approvals, enquiries, bookings and client follow ups. Help your team close
                            faster.
                        </p>
                    </div>

                    <div>
                        <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <AnimatedIcon
                                animation={settings}
                                size={24}
                                strokeColor="#2563eb"
                                autoplay
                                loop
                                speed={0.9}
                            />
                        </div>
                        <h3 className="mb-2 text-xl font-bold dark:text-white">Project Execution Tracking</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Track phases, materials, workers, expenses and progress. Know exactly where every project
                            stands.
                        </p>
                    </div>

                    <div>
                        <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <AnimatedIcon
                                animation={activity}
                                size={24}
                                strokeColor="#2563eb"
                                autoplay
                                loop
                                speed={0.9}
                            />
                        </div>
                        <h3 className="mb-2 text-xl font-bold dark:text-white">Loan Workflow Management</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Receive applications, review documents, approve, and follow repayments with a structured,
                            trackable process.
                        </p>
                    </div>

                    <div>
                        <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <AnimatedIcon
                                animation={calendar}
                                size={24}
                                strokeColor="#2563eb"
                                autoplay
                                loop
                                speed={0.9}
                            />
                        </div>
                        <h3 className="mb-2 text-xl font-bold dark:text-white">Bookings & Client Scheduling</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Schedule visits, confirm appointments and manage services. Reduce missed meetings and improve
                            conversion.
                        </p>
                    </div>

                    <div>
                        <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <AnimatedIcon
                                animation={checkmark}
                                size={24}
                                strokeColor="#2563eb"
                                autoplay
                                loop
                                speed={0.9}
                            />
                        </div>
                        <h3 className="mb-2 text-xl font-bold dark:text-white">Reports & Business Insights</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Get audit-friendly reports and exports for management decisions. Sales, finance and project
                            performance.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
