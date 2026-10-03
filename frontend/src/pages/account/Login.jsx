import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agreedTerms, setAgreedTerms] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        // Require Terms & Conditions agreement
        if (!agreedTerms) {
            setError(
                "You must agree to the Terms & Conditions before logging in."
            );
            return;
        }

        setLoading(true);

        try {
            const loginData = await loginUser(username, password);
            const profile = loginData.profile;

            if (!profile) {
                throw new Error("Could not load your account information.");
            }

            localStorage.setItem(
                "account_type",
                profile.account_type || ""
            );

            // Admin users
            if (profile.is_staff || profile.is_superuser) {
                navigate("/admin/dashboard");
                return;
            }

            // Providers
            if (profile.account_type === "provider") {
                navigate("/provider-dashboard");
                return;
            }

            // Customers
            if (profile.account_type === "customer") {
                navigate("/customer-dashboard");
                return;
            }

            // Fallback
            navigate("/");
        } catch (error) {
            setError(
                error.message || "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden font-sans">

            {/* Blurred Background */}
            <div
                className="
                    absolute
                    inset-0
                    scale-110
                    bg-cover
                    bg-center
                    bg-no-repeat
                    blur-xl
                "
                style={{
                    backgroundImage: "url('/images/bg.png')",
                }}
            />

            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Main Content */}
            <div
                className="
                    relative
                    z-10
                    flex
                    min-h-screen
                    w-full
                    items-center
                    justify-center
                    px-4
                    py-5
                    sm:px-6
                    sm:py-6
                    lg:px-8
                "
            >
                {/* Main Login Card */}
                <div
                    className="
                        flex
                        w-full
                        max-w-[880px]
                        flex-col
                        overflow-hidden
                        rounded-[24px]
                        bg-white/95
                        p-2.5
                        shadow-2xl
                        backdrop-blur-sm
                        md:flex-row
                    "
                >

                    {/* Left Image Section */}
                    <div
                        className="
                            relative
                            min-h-[220px]
                            w-full
                            flex-shrink-0
                            overflow-hidden
                            rounded-[19px]
                            bg-black
                            sm:min-h-[250px]
                            md:min-h-[500px]
                            md:w-[46%]
                        "
                    >
                        <img
                            src="/images/tools.png"
                            alt="FixIt tools"
                            className="
                                absolute
                                inset-0
                                h-full
                                w-full
                                object-cover
                            "
                        />

                        {/* Image Overlay */}
                        <div className="absolute inset-0 bg-black/20" />

                        {/* Logo */}
                        <div
                            className="
                                absolute
                                left-5
                                top-5
                                flex
                                items-center
                                gap-2
                                sm:left-6
                                sm:top-6
                            "
                        >
                            <svg
                                className="h-7 w-7 text-white sm:h-8 sm:w-8"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>

                            <span className="text-lg font-bold text-white sm:text-xl">
                                FixIt
                            </span>
                        </div>

                        {/* Image Text */}
                        <div
                            className="
                                absolute
                                bottom-5
                                left-5
                                right-5
                                text-white
                                sm:bottom-6
                                sm:left-6
                                sm:right-6
                            "
                        >
                            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Welcome back.
                            </h2>

                            <p className="mt-1.5 max-w-sm text-xs leading-5 text-white/85 sm:text-sm">
                                Connect with trusted professionals and get your
                                service needs sorted with FixIt.
                            </p>
                        </div>
                    </div>

                    {/* Right Form Section */}
                    <div
                        className="
                            flex
                            w-full
                            flex-col
                            justify-center
                            px-5
                            py-5
                            sm:px-8
                            sm:py-7
                            md:w-[54%]
                            md:px-9
                            md:py-8
                        "
                    >

                        {/* Back Button */}
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="
                                mb-3
                                w-fit
                                text-gray-500
                                transition-colors
                                hover:text-gray-800
                            "
                            aria-label="Go back"
                        >
                            <svg
                                className="h-4 w-4 sm:h-5 sm:w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                        </button>

                        {/* Heading */}
                        <h1
                            className="
                                text-2xl
                                font-bold
                                tracking-tight
                                text-gray-900
                                sm:text-3xl
                            "
                        >
                            Log in
                        </h1>

                        <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="
                                    font-bold
                                    text-black
                                    underline
                                    underline-offset-2
                                    hover:text-gray-700
                                "
                            >
                                Create an Account
                            </Link>
                        </p>

                        {/* Error Message */}
                        {error && (
                            <div
                                className="
                                    mt-3
                                    rounded-lg
                                    border
                                    border-red-100
                                    bg-red-50
                                    p-2.5
                                    text-xs
                                    text-red-600
                                "
                            >
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="mt-5 space-y-3.5"
                        >

                            {/* Username */}
                            <div>
                                <label
                                    htmlFor="username"
                                    className="
                                        mb-1
                                        block
                                        text-xs
                                        font-semibold
                                        text-gray-800
                                    "
                                >
                                    Username
                                </label>

                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                    placeholder="Enter your username"
                                    className="
                                        w-full
                                        rounded-full
                                        border
                                        border-gray-300
                                        px-4
                                        py-2.5
                                        text-sm
                                        outline-none
                                        transition
                                        placeholder-gray-400
                                        focus:border-black
                                        focus:ring-1
                                        focus:ring-black
                                    "
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="
                                        mb-1
                                        block
                                        text-xs
                                        font-semibold
                                        text-gray-800
                                    "
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                        placeholder="Enter your password"
                                        className="
                                            w-full
                                            rounded-full
                                            border
                                            border-gray-300
                                            py-2.5
                                            pl-4
                                            pr-11
                                            text-sm
                                            outline-none
                                            transition
                                            placeholder-gray-400
                                            focus:border-black
                                            focus:ring-1
                                            focus:ring-black
                                        "
                                    />

                                    {/* Show / Hide Password */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="
                                            absolute
                                            right-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-400
                                            hover:text-gray-600
                                        "
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.02 10.02 0 013.682-.863c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-1.393 1.393L3 3l18 18"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* Forgot Password */}
                                <div className="mt-1 text-right">
                                    <a
                                        href="#forgot"
                                        className="
                                            text-[11px]
                                            font-bold
                                            text-black
                                            hover:underline
                                        "
                                    >
                                        Forgot Password?
                                    </a>
                                </div>
                            </div>

                            {/* Terms & Conditions */}
                            <div className="flex items-start gap-2 pt-0.5">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={agreedTerms}
                                    onChange={(e) =>
                                        setAgreedTerms(e.target.checked)
                                    }
                                    required
                                    className="
                                        mt-0.5
                                        h-3.5
                                        w-3.5
                                        flex-shrink-0
                                        rounded
                                        border-gray-300
                                        accent-black
                                        focus:ring-black
                                    "
                                />

                                <label
                                    htmlFor="terms"
                                    className="
                                        text-[11px]
                                        leading-4
                                        text-gray-600
                                    "
                                >
                                    I agree to the{" "}
                                    <a
                                        href="/terms"
                                        className="
                                            font-bold
                                            text-black
                                            underline
                                            underline-offset-2
                                        "
                                    >
                                        Terms & Conditions
                                    </a>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || !agreedTerms}
                                className="
                                    w-full
                                    rounded-full
                                    bg-black
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-gray-800
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                {loading
                                    ? "Logging in..."
                                    : "Log in"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
