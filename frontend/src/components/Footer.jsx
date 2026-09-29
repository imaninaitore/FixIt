import { Link } from "react-router-dom";
import {
    ArrowRight,
    BriefcaseBusiness,
    FileText,
    ShieldCheck,
} from "lucide-react";

function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-[#081426] text-slate-300">

            <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">

                {/* Main footer */}
                <div className="grid gap-10 md:grid-cols-3 md:gap-12">

                    {/* Brand */}
                    <div>
                        <Link
                            to="/"
                            className="inline-block text-2xl font-bold tracking-tight text-white"
                        >
                            Fix<span className="text-blue-400">It</span>
                        </Link>

                        <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
                            A local services marketplace that makes it
                            easier to find and connect with trusted
                            professionals for the work you need.
                        </p>

                        <Link
                            to="/providers"
                            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-400 transition hover:text-blue-300"
                        >
                            Find a Provider
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>


                    {/* Platform */}
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Platform
                        </h2>

                        <div className="mt-5 space-y-3">

                            <Link
                                to="/"
                                className="block text-sm text-slate-400 transition hover:text-white"
                            >
                                Home
                            </Link>

                            <Link
                                to="/providers"
                                className="block text-sm text-slate-400 transition hover:text-white"
                            >
                                Find a Provider
                            </Link>

                            <Link
                                to="/service-requests"
                                className="block text-sm text-slate-400 transition hover:text-white"
                            >
                                Service Requests
                            </Link>

                            <Link
                                to="/messages"
                                className="block text-sm text-slate-400 transition hover:text-white"
                            >
                                Messages
                            </Link>

                        </div>
                    </div>


                    {/* Legal & Information */}
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Legal & Information
                        </h2>

                        <div className="mt-5 space-y-3">

                            <Link
                                to="/terms"
                                className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                            >
                                <FileText className="h-4 w-4 text-blue-400" />
                                Terms & Conditions
                            </Link>

                            <Link
                                to="/privacy"
                                className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                            >
                                <ShieldCheck className="h-4 w-4 text-blue-400" />
                                Privacy Policy
                            </Link>

                        </div>

                        <div className="mt-7 border-t border-slate-800 pt-5">

                            <div className="flex items-start gap-3">

                                <BriefcaseBusiness className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />

                                <p className="text-xs leading-5 text-slate-500">
                                    FixIt connects customers with independent
                                    service professionals through one simple
                                    platform.
                                </p>

                            </div>

                        </div>
                    </div>

                </div>


                {/* Bottom bar */}
                <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} FixIt. All rights reserved.
                    </p>

                    <div className="flex items-center gap-5">

                        <Link
                            to="/terms"
                            className="text-xs text-slate-500 transition hover:text-slate-300"
                        >
                            Terms
                        </Link>

                        <Link
                            to="/privacy"
                            className="text-xs text-slate-500 transition hover:text-slate-300"
                        >
                            Privacy
                        </Link>

                    </div>

                </div>

            </div>

        </footer>
    );
}

export default Footer;