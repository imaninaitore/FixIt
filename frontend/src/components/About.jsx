function About() {
    return (
        <section
            id="about"
            className="bg-white py-20 sm:py-24"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-10">

                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

                    {/* Text content */}
                    <div>

                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-500">
                            About FixIt
                        </p>

                        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                            Finding the right professional should be simple.
                        </h2>

                        <p className="mt-6 text-base leading-7 text-slate-600 sm:text-lg">
                            FixIt connects customers with skilled local service
                            providers, making it easier to find the right person
                            for the job.
                        </p>

                        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                            Whether you need a plumber, electrician, technician,
                            or another professional, FixIt gives you a simple
                            way to discover providers, compare your options,
                            and get in touch.
                        </p>

                    </div>

                    {/* Visual card */}
                    <div className="relative">

                        <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-xl">
                            <img
                                src="/images/bg.png"
                                alt="FixIt local service professionals"
                                className="h-[420px] w-full object-cover opacity-80"
                            />

                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <p className="text-sm font-medium uppercase tracking-wider text-blue-300">
                                    FixIt
                                </p>

                                <h3 className="mt-2 text-2xl font-semibold text-white">
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