import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const services = [
    {
        number: "01",
        title: "Home repairs",
        description:
            "Find professionals for plumbing, electrical work, carpentry, and everyday repairs around your home.",
        image: "/images/repairs.jpg",
        alt: "Home repair professional at work",
    },
    {
        number: "02",
        title: "Technical services",
        description:
            "Connect with technicians who can help with appliance repairs and other practical technical needs.",
        image: "/images/technical.jpg",
        alt: "Technician working on equipment",
    },
    {
        number: "03",
        title: "Everyday services",
        description:
            "Explore services such as painting, pest control, moving assistance, and other tasks that make life easier.",
        image: "/images/everyday.jpg",
        alt: "Professional providing a local service",
    },
];

const steps = [
    {
        number: "01",
        title: "Explore",
        description:
            "Browse available service categories and discover professionals who offer the help you need.",
    },
    {
        number: "02",
        title: "Connect",
        description:
            "View provider information, submit a service request, and communicate about the work you need done.",
    },
    {
        number: "03",
        title: "Get things done",
        description:
            "Manage your service requests and, where available, share feedback about your experience.",
    },
];

function Reveal({ children, direction = "left", className = "" }) {
    const elementRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = elementRef.current;

        if (!element) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduceMotion || !("IntersectionObserver" in window)) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px",
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    const hiddenDirection =
        direction === "right"
            ? "translate-x-10"
            : direction === "up"
              ? "translate-y-8"
              : "-translate-x-10";

    return (
        <div
            ref={elementRef}
            className={`
                transform-gpu
                transition-all
                duration-700
                ease-out
                motion-reduce:transform-none
                motion-reduce:transition-none
                ${
                    isVisible
                        ? "translate-x-0 translate-y-0 opacity-100"
                        : `${hiddenDirection} opacity-0`
                }
                ${className}
            `}
        >
            {children}
        </div>
    );
}

function ImagePanel({
    src,
    alt,
    className = "",
    imageClassName = "",
    children,
}) {
    const [imageFailed, setImageFailed] = useState(false);

    return (
        <div
            className={`
                relative
                isolate
                overflow-hidden
                rounded-2xl
                border
                border-[#D9B99B]/70
                bg-[#172A46]
                shadow-lg
                ${className}
            `}
        >
            {!imageFailed && (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    onError={() => setImageFailed(true)}
                    className={`
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        hover:scale-[1.03]
                        ${imageClassName}
                    `}
                />
            )}

            <div className="absolute inset-0 -z-0 bg-[#172A46]/10" />

            {children}
        </div>
    );
}

function About() {
    return (
        <section
            id="about"
            className="
                overflow-hidden
                bg-[#F4EDE5]
                text-[#172A46]
            "
        >
            {/* Introduction */}
            <div className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
                <div className="mx-auto max-w-7xl">
                    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
                        <Reveal direction="left">
                            <div className="max-w-2xl">
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C66A4A] sm:text-sm">
                                    About FixIt
                                </p>

                                <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
                                    Finding the right professional should be
                                    simple.
                                </h2>

                                <p className="mt-5 text-base leading-7 text-[#536070] sm:mt-6 sm:text-lg sm:leading-8">
                                    FixIt connects customers with skilled local
                                    service providers, making it easier to find
                                    the right person for the job.
                                </p>

                                <p className="mt-4 text-sm leading-7 text-[#536070] sm:text-base sm:leading-8">
                                    Whether you need a plumber, electrician,
                                    technician, or another professional, FixIt
                                    gives you a simple way to discover providers,
                                    explore your options, and get in touch.
                                </p>

                            </div>
                        </Reveal>

                      
<Reveal direction="right" className="min-w-0 w-full">
    <ImagePanel
        src="/images/about.jpg"
        alt="Local service professionals representing FixIt"
        className="
            mx-auto
            aspect-[4/3]
            w-full
            max-w-md
            min-h-0
            sm:aspect-[5/4]
            lg:max-w-[500px]
            transition-transform
            duration-700
            hover:scale-[1.03]
        " >
    </ImagePanel>
</Reveal>
                    </div>
                </div>
            </div>

            {/* Mission and vision */}
            <div className="border-y border-[#D9B99B]/60 bg-[#EAE0D4] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
                <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-20">
                    <Reveal direction="left" className="order-2 lg:order-1">
                        <ImagePanel
                            src="/images/skills.jpg"
                            alt="A professional carrying out a service for a customer"
                            className=" w-full min-w-0 aspect-[4/3] min-h-[220px] sm:min-h-[280px] md:aspect-[5/4] md:min-h-[320px] lg:aspect-[4/3] lg:min-h-[360px] transition-transform duration-500 hover:scale-[1.02]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-[#172A46]/40 to-transparent" />
                        </ImagePanel>
                    </Reveal>

                    

<Reveal
    direction="right"
    className="order-1 min-w-0 lg:order-2"
>
    <div className="mx-auto max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C66A4A] sm:text-sm">
            Why we exist
        </p>

        <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.7rem]">
            Skills deserve opportunities.
        </h2>

        <p className="mt-4 text-sm leading-7 text-[#536070] sm:text-base">
            Many people complete technical courses but struggle to
            find employment. Others already have jobs and want to
            earn extra income through a side hustle.
        </p>

        <p className="mt-3 text-sm leading-7 text-[#536070] sm:text-base">
            FixIt aims to connect these skilled individuals with
            customers who need their services, helping turn
            practical skills into opportunities to earn, gain
            experience, and grow.
        </p>

<div className="mt-7 space-y-6 lg:mt-9 lg:space-y-7">
    {/* Our Mission */}
    <div>
        <div className="mb-2 h-1 w-9 rounded-full bg-[#C66A4A]" />

        <h3 className="text-xl font-semibold tracking-tight text-[#172A46]">
            Our mission
        </h3>

        <p className="mt-2 max-w-3xl text-sm leading-7 text-[#536070] sm:text-base">
            Connect customers with service providers while creating more
            opportunities for people to earn through their skills.
        </p>
    </div>

    {/* Our Vision */}
    <div className="border-t border-[#D9B99B]/70 pt-5">
        <div className="mb-2 h-1 w-9 rounded-full bg-[#172A46]" />

        <h3 className="text-xl font-semibold tracking-tight text-[#172A46]">
            Our vision
        </h3>

        <p className="mt-2 max-w-3xl text-sm leading-7 text-[#536070] sm:text-base">
            Contribute to reducing unemployment by making self-employment
            and additional income opportunities more accessible.
        </p>
    </div>
</div>


</div>

</Reveal>
</div>
</div>

            {/* Services */}
            <div className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
                <div className="mx-auto max-w-7xl">
                    <Reveal direction="up" className="mx-auto max-w-2xl text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C66A4A] sm:text-sm">
                            What we do
                        </p>

                        <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                            Everyday services, all in one place.
                        </h2>

                        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#536070] sm:text-base sm:leading-8">
                            From household repairs to other practical needs,
                            FixIt helps customers explore different services
                            and find providers suited to the work they need.
                        </p>
                    </Reveal>

                    <div className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                        {services.map((service, index) => (
                            <Reveal
                                key={service.number}
                                direction={index % 2 === 0 ? "left" : "right"}
                                className="h-full"
                            >
                                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#D9B99B]/70 bg-white/60 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl">
                                    <div className="relative aspect-[5/4] overflow-hidden bg-[#172A46]">
                                        <img
                                            src={service.image}
                                            alt={service.alt}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            onError={(event) => {
                                                event.currentTarget.style.visibility =
                                                    "hidden";
                                            }}
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-[#172A46]/45 to-transparent" />

                                        <span className="absolute bottom-4 left-5 text-xs font-semibold tracking-[0.18em] text-white">
                                            {service.number}
                                        </span>
                                    </div>

                                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                                        <h3 className="text-xl font-semibold">
                                            {service.title}
                                        </h3>

                                        <p className="mt-3 flex-1 text-sm leading-7 text-[#536070]">
                                            {service.description}
                                        </p>
                                    </div>
                                </article>
                            </Reveal>
                        ))}
                    </div>

                </div>
            </div>

            <div
                className="bg-[#172A46] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24"
            >
                <div className="mx-auto max-w-7xl">
                    <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
                        <Reveal direction="left">

                            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                                A simpler way to get connected.
                            </h2>

                            <p className="mt-5 max-w-lg text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
                                Finding a service should not feel like a task
                                of its own. FixIt brings provider discovery,
                                service requests, and communication together
                                in one place.
                            </p>

                            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
                                <img
                                    src="/images/connection.jpg"
                                    alt="Service professional preparing for a job"
                                    loading="lazy"
                                    className="aspect-[5/3] w-full object-cover transition-transform duration-500 hover:scale-105"
                                    onError={(event) => {
                                        event.currentTarget.style.visibility =
                                            "hidden";
                                    }}
                                />
                            </div>
                        </Reveal>

                        <div className="space-y-8 sm:space-y-10">
                            {steps.map((step, index) => (
                                <Reveal
                                    key={step.number}
                                    direction="right"
                                >
                                    <div className="flex gap-5 sm:gap-7">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D9B99B]/50 text-sm font-semibold text-[#D9B99B] sm:h-14 sm:w-14">
                                            {step.number}
                                        </div>

                                        <div className="flex-1 border-b border-white/15 pb-7 sm:pb-9">
                                            <h3 className="text-xl font-semibold sm:text-2xl">
                                                {step.title}
                                            </h3>

                                            <p className="mt-3 text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* For customers and providers */}
            <div className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
                <div className="mx-auto max-w-7xl">
                    <Reveal direction="up" className="mx-auto max-w-2xl text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C66A4A] sm:text-sm">
                            Built for both sides
                        </p>

                        <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                            Better connections begin with access.
                        </h2>

                        <p className="mt-5 text-sm leading-7 text-[#536070] sm:text-base sm:leading-8">
                            FixIt is designed to make the experience useful for
                            the people looking for help and the professionals
                            ready to provide it.
                        </p>
                    </Reveal>

                    <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-8">
                        <Reveal direction="left" className="h-full">
                            <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#D9B99B]/70 bg-white/50">
                                <img
                                    src="/images/customer.jpg"
                                    alt="Customer discussing a service with a professional"
                                    loading="lazy"
                                    className="aspect-[16/9] w-full object-cover transition-transform duration-500 hover:scale-105"
                                    onError={(event) => {
                                        event.currentTarget.style.visibility =
                                            "hidden";
                                    }}
                                />

                                <div className="flex flex-1 flex-col p-6 sm:p-8">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C66A4A]">
                                        For customers
                                    </p>

                                    <h3 className="mt-3 text-2xl font-semibold">
                                        Find the help you need.
                                    </h3>

                                    <p className="mt-3 flex-1 text-sm leading-7 text-[#536070] sm:text-base">
                                        Explore service categories, discover
                                        providers, submit requests, and use
                                        available messaging features to discuss
                                        the work you need.
                                    </p>

                                </div>
                            </article>
                        </Reveal>

                        <Reveal direction="right" className="h-full">
                            <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#D9B99B]/70 bg-white/50">
                                <img
                                    src="/images/provider.jpg"
                                    alt="Service professional preparing tools for work"
                                    loading="lazy"
                                    className="aspect-[16/9] w-full object-cover transition-transform duration-500 hover:scale-105"
                                    onError={(event) => {
                                        event.currentTarget.style.visibility =
                                            "hidden";
                                    }}
                                />

                                <div className="flex flex-1 flex-col p-6 sm:p-8">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C66A4A]">
                                        For service providers
                                    </p>

                                    <h3 className="mt-3 text-2xl font-semibold">
                                        Put your skills into view.
                                    </h3>

                                    <p className="mt-3 flex-1 text-sm leading-7 text-[#536070] sm:text-base">
                                        Create a professional profile, present
                                        your services, manage incoming requests,
                                        and connect with potential customers
                                        through the platform.
                                    </p>

                                </div>
                            </article>
                        </Reveal>
                    </div>
                </div>
            </div>

{/* Closing Section */}
<div className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
    <Reveal direction="up">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-xl bg-[#D9B99B]">
            <div className="grid items-center gap-5 p-5 sm:gap-7 sm:p-7 md:grid-cols-[1.2fr_0.8fr] md:p-8 lg:gap-9 lg:p-10">
                {/* Text Content */}
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7C422F] sm:text-xs">
                        Let's get connected
                    </p>

                    <h2 className="mt-2.5 max-w-lg text-2xl font-semibold leading-tight tracking-tight text-[#172A46] sm:text-3xl lg:text-4xl">
                        The right help starts with one simple connection.
                    </h2>

                    <p className="mt-3 max-w-md text-sm leading-6 text-[#39485A] sm:leading-7">
                        Find a trusted professional or share your skills with
                        customers. FixIt makes getting started simple.
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-5 flex flex-wrap gap-2.5">
                        <Link
                            to="/contact"
                            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#172A46] px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#243D60] sm:px-5 sm:text-sm"
                        >
                            Contact Us
                        </Link>

                        <Link
                            to="/registerProvider"
                            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#172A46]/30 px-4 py-2 text-xs font-semibold text-[#172A46] transition-colors duration-200 hover:bg-white/30 sm:px-5 sm:text-sm"
                        >
                            Become a Provider
                        </Link>
                    </div>
                </div>

                {/* Image */}
                <div className="relative hidden h-44 overflow-hidden rounded-lg md:block lg:h-52">
                    <img
                        src="/images/tools3.jpg"
                        alt="Professional tools for local services"
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(event) => {
                            event.currentTarget.style.visibility = "hidden";
                        }}
                    />
                </div>
            </div>
        </div>
    </Reveal>
</div>

        </section>
    );
}

export default About;