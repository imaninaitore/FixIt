function About() {
    return (
        <section
            id="about"
            className="
                bg-[#F4EDE5]
                py-12

                sm:py-20

                lg:py-24
            "
        >
            <div
                className="
                    mx-auto
                    max-w-5xl
                    px-5

                    sm:px-6

                    lg:px-10
                "
            >

                <div
                    className="
                        grid
                        items-center
                        gap-8

                        sm:gap-10

                        lg:grid-cols-2
                        lg:gap-20
                    "
                >

                    {/* Text content */}
                    <div>

                        <p
                            className="
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-[0.2em]
                                text-[#C66A4A]

                                sm:text-sm
                                sm:tracking-[0.25em]
                            "
                        >
                            About FixIt
                        </p>

                        <h2
                            className="
                                mt-3
                                text-3xl
                                font-semibold
                                leading-tight
                                tracking-tight
                                text-[#172A46]

                                sm:mt-4
                                sm:text-4xl

                                lg:text-5xl
                            "
                        >
                            Finding the right professional should be simple.
                        </h2>

                        <p
                            className="
                                mt-4
                                text-sm
                                leading-6
                                text-[#536070]

                                sm:mt-6
                                sm:text-base
                                sm:leading-7

                                lg:text-lg
                            "
                        >
                            FixIt connects customers with skilled local service
                            providers, making it easier to find the right person
                            for the job.
                        </p>

                        <p
                            className="
                                mt-3
                                text-sm
                                leading-6
                                text-[#536070]

                                sm:mt-4
                                sm:text-base
                                sm:leading-7

                                lg:text-lg
                            "
                        >
                            Whether you need a plumber, electrician, technician,
                            or another professional, FixIt gives you a simple
                            way to discover providers, compare your options,
                            and get in touch.
                        </p>

                    </div>

                    {/* Visual card */}
                    <div className="relative">

                        <div
                            className="
                                relative
                                overflow-hidden
                                rounded-2xl
                                border
                                border-[#D9B99B]
                                bg-[#172A46]
                                shadow-xl

                                sm:rounded-2xl
                            "
                        >

                            <img
                                src="/images/about.jpg"
                                alt="FixIt local service professionals"
                                className="
                                    h-[260px]
                                    w-full
                                    object-cover
                                    object-center

                                    sm:h-[340px]

                                    lg:h-[420px]
                                "
                            />

                            {/* Image overlay */}
                            <div
                                className="
                                    absolute
                                    inset-0
                                    rounded-2xl
                                    bg-[#172A46]/45
                                "
                            />

                            {/* Image text */}
                            <div
                                className="
                                    absolute
                                    bottom-0
                                    left-0
                                    right-0
                                    border-t
                                    border-[#D9B99B]/40
                                    bg-[#172A46]/90
                                    p-5

                                    sm:p-6

                                    lg:p-8
                                "
                            >
                                <p
                                    className="
                                        text-[10px]
                                        font-medium
                                        uppercase
                                        tracking-wider
                                        text-[#D9B99B]

                                        sm:text-xs

                                        lg:text-sm
                                    "
                                >
                                    FixIt
                                </p>

                                <h3
                                    className="
                                        mt-1
                                        text-lg
                                        font-semibold
                                        leading-tight
                                        text-white

                                        sm:mt-2
                                        sm:text-xl

                                        lg:text-2xl
                                    "
                                >
                                    Local skills. Trusted connections.
                                </h3>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default About;
