import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function TermsAndConditions() {
    const terms = [
        {
            number: "01",
            title: "Acceptance of Terms",
            image: "/images/acceptance.jpg",
            text: [
                "By creating an account, accessing the platform, or using any FixIt service, you acknowledge that you have read, understood, and agreed to these Terms & Conditions. If you do not agree with these terms, you should not use the platform.",
            ],
        },
        {
            number: "02",
            title: "User Accounts",
            image: "/images/user.jpg",
            text: [
                "Users may create accounts as customers or service providers. You are responsible for providing accurate information when creating your account and for keeping your login credentials secure.",
                "You are responsible for activities carried out through your account and should notify FixIt if you believe your account has been accessed without your permission.",
            ],
        },
        {
            number: "03",
            title: "Service Providers",
            image: "/images/service.jpg",
            text: [
                "Service providers are responsible for the accuracy of the information they submit to FixIt, including their business details, service category, experience, location, and availability.",
                "Provider enrolment and verification may be subject to review by FixIt administrators. Approval does not constitute a guarantee of the quality, availability, or outcome of any service provided.",
            ],
        },
        {
            number: "04",
            title: "Service Requests",
            image: "/images/request.png",
            text: [
                "Customers may use FixIt to submit service requests and connect with service providers. Customers are responsible for providing accurate information about their requested services, location, preferred dates, and other relevant details.",
            ],
        },
        {
            number: "05",
            title: "Communication",
            image: "/images/communication.jpg",
            text: [
                "FixIt may provide messaging functionality to allow customers and service providers to communicate about service requests. Users should use this functionality responsibly and respectfully.",
            ],
        },
        {
            number: "06",
            title: "Reviews and Ratings",
            image: "/images/reviews.jpg",
            text: [
                "Customers may be able to leave ratings or reviews for services received through the platform. Reviews should be honest, relevant, and based on the user's actual experience.",
                "FixIt may remove content that violates platform rules or applicable policies.",
            ],
        },
        {
            number: "07",
            title: "Payments",
            image: "/images/payments.jpg",
            text: [
                "Where payments are required for FixIt services or provider subscriptions, users are responsible for providing accurate payment information and following the applicable payment process.",
                "Payment records may be associated with user accounts for administrative and verification purposes.",
            ],
        },
        {
            number: "08",
            title: "Prohibited Use",
            image: "/images/prohibited.jpg",
            text: [
                "Users must not use FixIt for unlawful, fraudulent, abusive, or misleading activities. Users must not attempt to interfere with the operation or security of the platform.",
            ],
        },
        {
            number: "09",
            title: "Platform Availability",
            image: "/images/availability.jpg",
            text: [
                "FixIt aims to keep the platform available and functional, but access may sometimes be interrupted because of maintenance, technical issues, network problems, or circumstances outside the platform's control.",
            ],
        },
        {
            number: "10",
            title: "Limitation of Responsibility",
            image: "/images/limitations.jpg",
            text: [
                "FixIt provides a platform for customers and service providers to connect. Users are responsible for exercising appropriate judgment when communicating with, selecting, and engaging service providers.",
                "FixIt does not guarantee that every service provider will meet a customer's expectations or that every requested service will be available.",
            ],
        },
        {
            number: "11",
            title: "Account Suspension or Termination",
            image: "/images/suspension.png",
            text: [
                "FixIt may restrict, suspend, or terminate an account where there is a violation of these Terms & Conditions, misuse of the platform, or other circumstances requiring administrative action.",
            ],
        },
        {
            number: "12",
            title: "Changes to These Terms",
            image: "/images/change.jpg",
            text: [
                "These Terms & Conditions may be updated from time to time as FixIt develops and changes its services. Updated terms will be made available through the platform.",
            ],
        },
        {
            number: "13",
            title: "Contact",
            image: "/images/contact.jpg",
            text: [
                "If you have questions about these Terms & Conditions, you can contact FixIt through the contact information provided on the Contact Us page.",
            ],
        },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#dbe7f3] via-[#e8eef5] to-[#cbd5e1]">
            <Navbar />

            {/* Introduction */}
            <section className="px-5 pb-12 pt-32 sm:px-8 sm:pb-16 sm:pt-36 lg:px-10 lg:pb-20 lg:pt-40">
                <div className="mx-auto max-w-6xl">

                    {/* Page Introduction */}
                    <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                            FixIt Platform
                        </p>

                        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl lg:text-4xl">
                            Terms & Conditions
                        </h1>

                        <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
                            Welcome to FixIt. These Terms & Conditions govern
                            your use of the FixIt platform and the services
                            provided through it. By accessing or using FixIt,
                            you agree to comply with these terms.
                        </p>
                    </div>

                    {/* Terms */}
                    <div className="space-y-10 sm:space-y-14 lg:space-y-20">
                        {terms.map((term, index) => {
                            const imageFirst = index % 2 === 0;

                            return (
                                <div
                                    key={term.number}
                                    className="
                                        grid
                                        grid-cols-1
                                        items-stretch
                                        gap-5

                                        md:grid-cols-2
                                        md:gap-8

                                        lg:gap-10
                                    "
                                >
                                    {/* Image Card */}
                                    <div
                                        className={
                                            imageFirst
                                                ? "md:order-1"
                                                : "md:order-2"
                                        }
                                    >
                                        <div
                                            className="
                                                flex
                                                h-full
                                                min-h-[260px]
                                                items-center
                                                justify-center
                                                overflow-hidden
                                                rounded-2xl
                                                border
                                                border-slate-200
                                                bg-white
                                                p-4
                                                shadow-sm
                                                transition
                                                duration-300
                                                hover:-translate-y-1
                                                hover:shadow-md

                                                sm:min-h-[300px]
                                                sm:p-5

                                                lg:min-h-[340px]
                                            "
                                        >
                                            <img
                                                src={term.image}
                                                alt={term.title}
                                                className="
                                                    h-full
                                                    max-h-[330px]
                                                    w-full
                                                    object-contain
                                                    rounded-xl
                                                "
                                            />
                                        </div>
                                    </div>

                                    {/* Text Card */}
                                    <div
                                        className={
                                            imageFirst
                                                ? "md:order-2"
                                                : "md:order-1"
                                        }
                                    >
                                        <article
                                            className="
                                                flex
                                                h-full
                                                flex-col
                                                justify-center
                                                rounded-2xl
                                                border
                                                border-slate-200
                                                bg-white/90
                                                p-6
                                                shadow-sm
                                                backdrop-blur-sm
                                                transition
                                                duration-300
                                                hover:shadow-md

                                                sm:p-8

                                                lg:p-10
                                            "
                                        >
                                            {/* Number */}
                                            <div className="flex items-center gap-4">
                                                <span
                                                    className="
                                                        flex
                                                        h-11
                                                        w-11
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        bg-blue-50
                                                        text-sm
                                                        font-bold
                                                        text-blue-600
                                                    "
                                                >
                                                    {term.number}
                                                </span>

                                                <div className="h-px flex-1 bg-slate-200" />
                                            </div>

                                            {/* Title */}
                                            <h2
                                                className="
                                                    mt-6
                                                    text-xl
                                                    font-bold
                                                    tracking-tight
                                                    text-slate-800

                                                    sm:text-2xl

                                                    lg:text-[1.65rem]
                                                "
                                            >
                                                {term.title}
                                            </h2>

                                            {/* Text */}
                                            <div className="mt-5 space-y-4">
                                                {term.text.map(
                                                    (
                                                        paragraph,
                                                        paragraphIndex
                                                    ) => (
                                                        <p
                                                            key={
                                                                paragraphIndex
                                                            }
                                                            className="
                                                                text-sm
                                                                leading-7
                                                                text-slate-600

                                                                sm:text-base
                                                            "
                                                        >
                                                            {paragraph}
                                                        </p>
                                                    )
                                                )}
                                            </div>
                                        </article>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Notice */}
                    <div
                        className="
                            mx-auto
                            mt-14
                            max-w-4xl
                            rounded-2xl
                            border
                            border-blue-100
                            bg-blue-50/70
                            p-6

                            sm:mt-20
                            sm:p-8
                        "
                    >
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default TermsAndConditions;