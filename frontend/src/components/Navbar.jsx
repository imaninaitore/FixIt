import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { logoutUser } from "../services/authService";

function Navbar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const username = localStorage.getItem("username");
    const accountType = localStorage.getItem("account_type");

    const isAdmin =
        localStorage.getItem("is_staff") === "true" ||
        localStorage.getItem("is_superuser") === "true";

    const isCustomer = accountType === "customer";
    const isProvider = accountType === "provider";

    function navigateTo(path) {
        navigate(path);
        setMenuOpen(false);
    }

    async function handleLogout() {
        try {
            await logoutUser();
            setMenuOpen(false);
            navigate("/");
        } catch (error) {
            console.error(error);
            setMenuOpen(false);
            navigate("/");
        }
    }

    const linkClass =
        "text-sm font-medium text-white transition hover:text-[#D9B99B]";

    const mobileLinkClass =
        "block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-white transition hover:bg-white/10 hover:text-[#D9B99B]";

    const actionButtonClass =
        "whitespace-nowrap rounded-lg bg-[#C66A4A] px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-[#172A46] sm:px-4 sm:py-2 sm:text-sm";

    const logoutButtonClass =
        "whitespace-nowrap rounded-lg border border-[#D9B99B]/60 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-[#172A46]/40 sm:px-4 sm:py-2 sm:text-sm";

    function renderNavigationLinks(mobile = false) {
        const linkClassName = mobile ? mobileLinkClass : linkClass;

        return (
            <>
                <button
                    onClick={() => navigateTo("/")}
                    className={linkClassName}
                >
                    Home
                </button>

                <button
                    onClick={() => navigateTo("/providers")}
                    className={linkClassName}
                >
                    Find a Provider
                </button>

                {!username && (
                    <>
                        {mobile ? (
                            <a
                                href="/#about"
                                onClick={() => setMenuOpen(false)}
                                className={mobileLinkClass}
                            >
                                About
                            </a>
                        ) : (
                            <a
                                href="/#about"
                                className={linkClass}
                            >
                                About
                            </a>
                        )}

                        <button
                            onClick={() => navigateTo("/contact")}
                            className={linkClassName}
                        >
                            Contact Us
                        </button>
                    </>
                )}

                {username && isCustomer && (
                    <>
                        <button
                            onClick={() =>
                                navigateTo("/customer-dashboard")
                            }
                            className={linkClassName}
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={() =>
                                navigateTo("/service-requests")
                            }
                            className={linkClassName}
                        >
                            Service Requests
                        </button>

                        <button
                            onClick={() => navigateTo("/messages")}
                            className={linkClassName}
                        >
                            Messages
                        </button>
                    </>
                )}

                {username && isProvider && (
                    <>
                        <button
                            onClick={() =>
                                navigateTo("/provider-dashboard")
                            }
                            className={linkClassName}
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={() =>
                                navigateTo("/provider/service-requests")
                            }
                            className={linkClassName}
                        >
                            Service Requests
                        </button>

                        <button
                            onClick={() => navigateTo("/messages")}
                            className={linkClassName}
                        >
                            Messages
                        </button>
                    </>
                )}

                {username && isAdmin && (
                    <button
                        onClick={() => navigateTo("/admin/dashboard")}
                        className={linkClassName}
                    >
                        Administration
                    </button>
                )}
            </>
        );
    }

    function renderDashboardButton() {
        if (isCustomer) {
            return (
                <button
                    onClick={() => navigateTo("/customer-dashboard")}
                    className={actionButtonClass}
                >
                    Dashboard
                </button>
            );
        }

        if (isProvider) {
            return (
                <button
                    onClick={() => navigateTo("/provider-dashboard")}
                    className={actionButtonClass}
                >
                    Dashboard
                </button>
            );
        }

        if (isAdmin) {
            return (
                <button
                    onClick={() => navigateTo("/admin/dashboard")}
                    className={actionButtonClass}
                >
                    <span className="sm:hidden">Admin</span>
                    <span className="hidden sm:inline">
                        Admin Dashboard
                    </span>
                </button>
            );
        }

        return null;
    }

    return (
        <nav className="absolute left-0 top-0 z-50 w-full">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 lg:px-10">
                {/* Logo */}
                <button
                    onClick={() => navigateTo("/")}
                    className="shrink-0 text-xl font-bold text-white sm:text-2xl"
                >
                    Fix<span className="text-[#C66A4A]">It</span>
                </button>

                {/* Desktop navigation */}
                <div className="hidden items-center gap-5 lg:flex xl:gap-7">
                    {renderNavigationLinks()}
                </div>

                {/* Desktop user actions */}
                <div className="hidden items-center gap-3 lg:flex">
                    {username ? (
                        <>
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#172A46] text-sm font-bold text-white">
                                    {username.charAt(0).toUpperCase()}
                                </div>

                                <div className="max-w-32">
                                    <p className="truncate text-sm font-semibold text-white">
                                        {username}
                                    </p>

                                    <p className="text-xs text-[#D9B99B]">
                                        {isAdmin
                                            ? "Administrator"
                                            : isProvider
                                              ? "Service Provider"
                                              : "Customer"}
                                    </p>
                                </div>
                            </div>

                            {renderDashboardButton()}

                            <button
                                onClick={handleLogout}
                                className={logoutButtonClass}
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() =>
                                    navigateTo("/registerProvider")
                                }
                                className={linkClass}
                            >
                                Register as a Provider
                            </button>

                            <button
                                onClick={() => navigateTo("/login")}
                                className={logoutButtonClass}
                            >
                                Log In
                            </button>

                            <button
                                onClick={() => navigateTo("/register")}
                                className={actionButtonClass}
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>

                {/* Compact mobile actions */}
                <div className="flex min-w-0 items-center gap-2 lg:hidden">
                    {username ? (
                        <>
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#172A46] text-xs font-bold text-white sm:h-9 sm:w-9 sm:text-sm">
                                {username.charAt(0).toUpperCase()}
                            </div>

                            <button
                                onClick={handleLogout}
                                className="rounded-md border border-[#D9B99B]/60 px-2 py-1.5 text-xs font-medium text-white transition hover:bg-[#172A46]/40 sm:px-3 sm:text-sm"
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigateTo("/login")}
                                className="rounded-md border border-[#D9B99B]/60 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-[#172A46]/40 sm:px-3 sm:text-sm"
                            >
                                Log In
                            </button>

                            <button
                                onClick={() => navigateTo("/register")}
                                className="rounded-md bg-[#C66A4A] px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#172A46] sm:px-3 sm:text-sm"
                            >
                                Sign Up
                            </button>
                        </>
                    )}

                    {/* Three-line menu */}
                    <button
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-label={
                            menuOpen
                                ? "Close navigation menu"
                                : "Open navigation menu"
                        }
                        aria-expanded={menuOpen}
                        aria-controls="mobile-navigation"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/30 text-white transition hover:bg-white/10 sm:h-10 sm:w-10"
                    >
                        {menuOpen ? (
                            <X size={21} />
                        ) : (
                            <Menu size={21} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown menu */}
            {menuOpen && (
                <div
                    id="mobile-navigation"
                    className="mx-4 max-h-[75vh] overflow-y-auto rounded-xl border border-white/15 bg-[#172A46]/95 p-3 shadow-xl backdrop-blur-md sm:mx-6 lg:hidden"
                >
                    {username && (
                        <div className="mb-2 border-b border-white/15 px-3 py-3">
                            <p className="truncate text-sm font-semibold text-white">
                                {username}
                            </p>

                            <p className="mt-0.5 text-xs text-[#D9B99B]">
                                {isAdmin
                                    ? "Administrator"
                                    : isProvider
                                      ? "Service Provider"
                                      : "Customer"}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        {renderNavigationLinks(true)}
                    </div>

                    {username && (
                        <div className="mt-3 border-t border-white/15 pt-3">
                            {renderDashboardButton() && (
                                <div className="mb-2">
                                    {renderDashboardButton()}
                                </div>
                            )}

                            <button
                                onClick={handleLogout}
                                className="w-full rounded-lg border border-[#D9B99B]/50 px-4 py-2.5 text-left text-sm font-medium text-white transition hover:bg-white/10"
                            >
                                Log Out
                            </button>
                        </div>
                    )}

                    {!username && (
                        <div className="mt-3 border-t border-white/15 pt-3">
                            <button
                                onClick={() =>
                                    navigateTo("/registerProvider")
                                }
                                className="w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-white transition hover:bg-white/10"
                            >
                                Register as a Provider
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;
