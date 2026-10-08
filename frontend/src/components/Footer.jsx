import { Link } from "react-router-dom";
import {
    ArrowRight,
    BriefcaseBusiness,
    FileText,
    ShieldCheck,
} from "lucide-react";

function Footer() {
    return (
        <footer className="border-t border-[#243754] bg-[#172A46] text-[#E8DED2]">

            <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">

                {/* Main footer */}
                <div className="grid gap-10 md:grid-cols-3 md:gap-12">

                    {/* Brand */}
                    <div>
                        <Link
                            to="/"
                            className="inline-block text-2xl font-bold tracking-tight text-white"
                        >
                            Fix<span className="text-[#C66A4A]">It</span>
                        </Link>

                        <p className="mt-5 max-w-sm text-sm leading-6 text-[#C8B9AA]">
                            A local services marketplace that makes it
                            easier to find and connect with trusted
                            professionals for the work you need.
                        </p>

                        <Link
                            to="/providers"
                            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#C66A4A] transition hover:text-[#D98A6D]"
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
                                className="block text-sm text-[#C8B9AA] transition hover:text-white"
                            >
                                Home
                            </Link>

                            <Link
                                to="/providers"
                                className="block text-sm text-[#C8B9AA] transition hover:text-white"
                            >
                                Find a Provider
                            </Link>

                            <Link
                                to="/about"
                                className="block text-sm text-[#C8B9AA] transition hover:text-white"
                            >
                                About
                            </Link>

                            <Link
                                to="/contact"
                                className="block text-sm text-[#C8B9AA] transition hover:text-white"
                            >
                                Contact Us
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
                                className="flex items-center gap-2 text-sm text-[#C8B9AA] transition hover:text-white"
                            >
                                <FileText className="h-4 w-4 text-[#C66A4A]" />
                                Terms & Conditions
                            </Link>

                            <Link
                                to="/privacy"
                                className="flex items-center gap-2 text-sm text-[#C8B9AA] transition hover:text-white"
                            >
                                <ShieldCheck className="h-4 w-4 text-[#C66A4A]" />
                                Privacy Policy
                            </Link>

                        </div>

                        <div className="mt-7 border-t border-[#243754] pt-5">

                            <div className="flex items-start gap-3">

                                <BriefcaseBusiness className="mt-0.5 h-4 w-4 shrink-0 text-[#C66A4A]" />

                                <p className="text-xs leading-5 text-[#AFA095]">
                                    FixIt connects customers with independent
                                    service professionals through one simple
                                    platform.
                                </p>

                            </div>

                        </div>
                    </div>

                </div>

                {/* Bottom bar */}
                <div className="mt-12 flex flex-col gap-4 border-t border-[#243754] pt-6 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-xs text-[#AFA095]">
                        © {new Date().getFullYear()} FixIt. All rights reserved.
                    </p>

                    <div className="flex items-center gap-5">

                        <Link
                            to="/terms"
                            className="text-xs text-[#AFA095] transition hover:text-[#E8DED2]"
                        >
                            Terms
                        </Link>

                        <Link
                            to="/privacy"
                            className="text-xs text-[#AFA095] transition hover:text-[#E8DED2]"
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
