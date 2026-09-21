function Footer() {
    return (
        <footer className="bg-slate-950 text-white">

            <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">

                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

                    {/* Brand */}
                    <div className="lg:col-span-2">

                        <a
                            href="/"
                            className="text-3xl font-bold"
                        >
                            Fix<span className="text-blue-400">It</span>
                        </a>

                        <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                            Making it as easy to find a trusted professional
                            as it is to order something online.
                        </p>

                    </div>

                    {/* Platform links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Platform
                        </h3>

                        <ul className="mt-5 space-y-3">

                            <li>
                                <a
                                    href="#providers"
                                    className="text-sm text-slate-400 transition hover:text-blue-400"
                                >
                                    Find a Provider
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#how-it-works"
                                    className="text-sm text-slate-400 transition hover:text-blue-400"
                                >
                                    How It Works
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/register"
                                    className="text-sm text-slate-400 transition hover:text-blue-400"
                                >
                                    Become a Provider
                                </a>
                            </li>

                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Company
                        </h3>

                        <ul className="mt-5 space-y-3">

                            <li>
                                <a
                                    href="#about"
                                    className="text-sm text-slate-400 transition hover:text-blue-400"
                                >
                                    About Us
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#contact"
                                    className="text-sm text-slate-400 transition hover:text-blue-400"
                                >
                                    Contact
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/login"
                                    className="text-sm text-slate-400 transition hover:text-blue-400"
                                >
                                    Log In
                                </a>
                            </li>

                        </ul>
                    </div>

                </div>

                {/* Bottom section */}
                <div className="mt-12 border-t border-slate-800 pt-6">

                    <div className="flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">

                        <p>
                            © 2026 FixIt. All rights reserved.
                        </p>

                        <div className="flex gap-6">
                            <a
                                href="#"
                                className="transition hover:text-blue-400"
                            >
                                Privacy
                            </a>

                            <a
                                href="#"
                                className="transition hover:text-blue-400"
                            >
                                Terms
                            </a>
                        </div>

                    </div>

                </div>

            </div>

        </footer>
    );
}

export default Footer;