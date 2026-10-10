import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { Link } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const username = localStorage.getItem("username");
    const accountType = localStorage.getItem("account_type");

    const isAdmin =
        localStorage.getItem("is_staff") === "true" ||
        localStorage.getItem("is_superuser") === "true";

    const isCustomer = accountType === "customer";
    const isProvider = accountType === "provider";

    async function handleLogout() {
        try {
            await logoutUser();
            navigate("/");
        } catch (error) {
            console.error(error);

            navigate("/");
        }
    }

    return (
        <nav className="absolute top-0 left-0 z-20 w-full">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">

                {/* Logo */}
                <button
                    onClick={() => navigate("/")}
                    className="text-2xl font-bold text-white"
                >
                    Fix<span className="text-[#C66A4A]">It</span>
                </button>

                {/* Navigation links */}
                <div className="hidden items-center gap-8 md:flex">

                    {/* Home */}
                    <button
                        onClick={() => navigate("/")}
                        className="text-sm font-medium text-white transition hover:text-[#D9B99B]"
                    >
                        Home
                    </button>

                    {/* Find a Provider */}
                    <button
                        onClick={() => navigate("/providers")}
                        className="text-sm font-medium text-white transition hover:text-[#D9B99B]"
                    >
                        Find a Provider
                    </button>

                    {/* Public navigation */}
                    {!username && (
                        <>
                            <button>
                            <a
                               href="/#about"
                               className="text-sm font-medium text-white transition hover:text-[#D9B99B]">
                                About
                            </a>

                            </button>

                            <button
                                onClick={() => navigate("/contact")}
                                className="text-sm font-medium text-white transition hover:text-[#D9B99B]"
                            >
                                Contact Us
                            </button>
                        </>
                    )}

                    {/* Customer navigation */}
                    {username && isCustomer && (
                        <>
                            <button
                                onClick={() => navigate("/customer-dashboard")}
                                className="text-sm font-medium text-white transition hover:text-[#D9B99B]"
                            >
                                Dashboard
                            </button>

                            <button
                                onClick={() => navigate("/service-requests")}
                                className="text-sm font-medium text-white transition hover:text-[#D9B99B]"
                            >
                                Service Requests
                            </button>

                            <button
                                onClick={() => navigate("/messages")}
                                className="text-sm font-medium text-white transition hover:text-[#D9B99B]"
                            >
                                Messages
                            </button>
                        </>
                    )}

                    {/* Provider navigation */}
                    {username && isProvider && (
                        <>
                            <button
                                onClick={() => navigate("/provider-dashboard")}
                                className="text-sm font-medium text-white transition hover:text-[#D9B99B]"
                            >
                                Dashboard
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/provider/service-requests")
                                }
                                className="text-sm font-medium text-white transition hover:text-[#D9B99B]"
                            >
                                Service Requests
                            </button>

                            <button
                                onClick={() => navigate("/messages")}
                                className="text-sm font-medium text-white transition hover:text-[#D9B99B]"
                            >
                                Messages
                            </button>
                        </>
                    )}

                    {/* Admin navigation */}
                    {username && isAdmin && (
                        <button
                            onClick={() => navigate("/admin/dashboard")}
                            className="text-sm font-medium text-white transition hover:text-[#D9B99B]"
                        >
                            Administration
                        </button>
                    )}

                </div>

                {/* User section */}
                <div className="flex items-center gap-3">

                    {username ? (
                        <div className="flex items-center gap-3">

                            {/* User information */}
                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#172A46] text-sm font-bold text-white">
                                    {username.charAt(0).toUpperCase()}
                                </div>

                                <div className="hidden sm:block">
                                    <p className="text-sm font-semibold text-white">
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

                            {/* Dashboard button */}
                            {isCustomer && (
                                <button
                                    onClick={() =>
                                        navigate("/customer-dashboard")
                                    }
                                    className="rounded-lg bg-[#C66A4A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#172A46]"
                                >
                                    Dashboard
                                </button>
                            )}

                            {isProvider && (
                                <button
                                    onClick={() =>
                                        navigate("/provider-dashboard")
                                    }
                                    className="rounded-lg bg-[#C66A4A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#172A46]"
                                >
                                    Dashboard
                                </button>
                            )}

                            {isAdmin && (
                                <button
                                    onClick={() =>
                                        navigate("/admin/dashboard")
                                    }
                                    className="rounded-lg bg-[#C66A4A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#172A46]"
                                >
                                    Admin Dashboard
                                </button>
                            )}

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="rounded-lg border border-[#D9B99B]/60 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#172A46]/40"
                            >
                                Log Out
                            </button>

                        </div>
                    ) : (
                        /* Logged-out navigation */
                        <>

                            <button
                                onClick={() => navigate("/registerProvider")}
                                className="text-sm font-medium text-white transition hover:text-[#D9B99B] sm:text-xs lg:text-sm"
                            >
                                Register as a Provider
                            </button>

                            <button
                                onClick={() => navigate("/login")}
                                className="rounded-lg border border-[#D9B99B]/60 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#172A46]/40 sm:px-3 sm:py-1.5 sm:text-xs lg:px-4 lg:py-2 lg:text-sm"
                            >
                                Log In
                            </button>

                            <button
                                onClick={() => navigate("/register")}
                                className="rounded-lg bg-[#C66A4A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#172A46] sm:px-4 sm:py-2 sm:text-xs lg:px-5 lg:py-2.5 lg:text-sm"
                            >
                                Sign Up
                            </button>

                        </>
                    )}

                </div>

            </div>
        </nav>
    );
}

export default Navbar;