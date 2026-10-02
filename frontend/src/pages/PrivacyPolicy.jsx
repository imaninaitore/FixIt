import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-[#d5e1ed] via-[#e1e9f2] to-[#c4d1df] text-slate-700">
            <Navbar />

            {/* Header */}
            <section className="px-6 pb-12 pt-36 sm:px-8 lg:px-10">
                <div className="mx-auto max-w-4xl">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                        Privacy
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl lg:text-5xl">
                        Privacy Policy
                    </h1>

                    <p className="mt-4 text-sm text-slate-500 sm:text-base">
                        This policy explains how FixIt handles information
                        provided through the platform.
                    </p>
                </div>
            </section>

            {/* Privacy Content */}
            <section className="px-6 pb-20 sm:px-8 lg:px-10">
                <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200/70 bg-white/85 p-7 shadow-[0_10px_35px_rgba(15,23,42,0.06)] sm:p-10">

                    <div className="space-y-8">

                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">
                                1. Information We Collect
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                Depending on how you use FixIt, we may collect
                                information such as your name, email address,
                                account information, service details, provider
                                information, messages, reviews, and other
                                information you choose to provide.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">
                                2. How We Use Information
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                Information may be used to create and manage
                                accounts, connect customers with service
                                providers, process service requests, provide
                                customer support, improve the platform, and
                                maintain platform security.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">
                                3. Account Information
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                Users are responsible for keeping their account
                                credentials secure. Account information may be
                                used to authenticate users and provide
                                account-specific features.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">
                                4. Service Provider Information
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                Information submitted by service providers may
                                be displayed to customers where necessary for
                                provider discovery and service-related
                                communication.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">
                                5. Messages and Reviews
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                Messages sent through FixIt and reviews
                                submitted on the platform may be stored to
                                provide communication, service, moderation, and
                                platform functionality.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">
                                6. Data Security
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                FixIt uses reasonable technical and
                                organizational measures to help protect
                                information. However, no online system can
                                guarantee absolute security.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">
                                7. Information Sharing
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                Information may be shared within the platform
                                where necessary to provide requested services.
                                For example, information relevant to a service
                                request may be made available to the relevant
                                service provider.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">
                                8. Cookies and Local Storage
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                FixIt may use browser technologies such as local
                                storage to maintain authentication information
                                and user preferences required for the
                                application to function.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">
                                9. Your Information
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                Users may have rights concerning their personal
                                information depending on applicable laws.
                                Requests concerning personal information can be
                                directed to the FixIt support team.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">
                                10. Policy Updates
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                This Privacy Policy may be updated when the
                                platform, its features, or applicable
                                requirements change. The updated version will
                                be made available through FixIt.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">
                                11. Contact Us
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                If you have questions about this Privacy Policy
                                or how information is handled, please contact
                                the FixIt support team.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default PrivacyPolicy;