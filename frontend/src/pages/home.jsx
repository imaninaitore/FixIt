import Navbar from "/components/Navbar";

function Home() {
    return (
        <main>
             <Navbar />
            {/* Hero section */}
            <section
                className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/images/bg.png')",
                }}
            >
                {/* Background overlay */}
                <div className="absolute inset-0 bg-slate-950/20"></div>

                {/* Hero content */}
                <div className="relative z-10 flex min-h-screen items-center">
                    <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
                        <div className="max-w-3xl pt-20">

                            {/* Small heading */}
                            <p className="mb-5 text-sm font-medium uppercase tracking-[0.25em] text-blue-300">
                                Trusted Local Services
                            </p>

                            {/* Main heading */}
                            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
                                Find Trusted

                                <span className="block text-blue-400">
                                    Local Service
                                </span>

                                <span className="block">
                                    Providers
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="mt-7 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
                                Compare. Choose. Hire. Get the job done with
                                skilled professionals in your area.
                            </p>

                            {/* Buttons */}
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                                <a
                                    href="#providers"
                                    className="rounded-lg bg-blue-500 px-7 py-3.5 text-center text-sm font-semibold text-white transition duration-300 hover:bg-blue-600"
                                >
                                    Find a Provider
                                </a>

                                <a
                                    href="#how-it-works"
                                    className="rounded-lg border border-white/40 bg-white/5 px-7 py-3.5 text-center text-sm font-medium text-white backdrop-blur-sm transition duration-300 hover:bg-white/10"
                                >
                                    How It Works
                                </a>

                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Home;