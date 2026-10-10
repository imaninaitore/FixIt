import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

function RegisterProvider() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [agreedTerms, setAgreedTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));

        if (
            name === "password" ||
            name === "confirmPassword"
        ) {
            setError("");
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (loading) {
            return;
        }

        if (!agreedTerms) {
            setError(
                "Please accept the Terms & Conditions to create your account."
            );
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await registerUser(
                formData.username,
                formData.email,
                formData.password,
                "provider"
            );

            navigate("/login");
        } catch (error) {
            setError(error.message || "Registration failed. Please try again.");
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
                    py-3
                    sm:px-6
                    sm:py-4
                    lg:px-8
                "
            >
                {/* Main Registration Card */}
                <div
                    className="
                        flex
                        w-full
                        max-w-[820px]
                        flex-col
                        overflow-hidden
                        rounded-[24px]
                        bg-white/95
                        p-2
                        shadow-2xl
                        backdrop-blur-sm
                        md:flex-row
                    "
                >
                    {/* Left Image Section */}
                    <div
                        className="
                            relative
                            min-h-[170px]
                            w-full
                            flex-shrink-0
                            overflow-hidden
                            rounded-[19px]
                            bg-black
                            sm:min-h-[190px]
                            md:min-h-[470px]
                            md:w-[42%]
                        "
                    >
                        <img
                            src="/images/tools.jpg"
                            alt="Tools used by FixIt service professionals"
                            className="
                                absolute
                                inset-0
                                h-full
                                w-full
                                object-cover
                            "
                        />

                        {/* Image Overlay */}
                        <div className="absolute inset-0 bg-black/25" />

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
                                aria-hidden="true"
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
                                Turn your skills into opportunity.
                            </h2>

                            <p className="mt-1.5 max-w-sm text-xs leading-5 text-white/85 sm:text-sm">
                                Join FixIt, connect with customers, and grow
                                your service business.
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
                            px-4
                            py-3
                            sm:px-6
                            sm:py-4
                            md:w-[58%]
                            md:px-7
                            md:py-3
                        "
                    >
                        {/* Back Button */}
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="
                                mb-1.5
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
                                aria-hidden="true"
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
                            Create an Account
                        </h1>

                        <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="
                                    font-bold
                                    text-black
                                    underline
                                    underline-offset-2
                                    hover:text-gray-700
                                "
                            >
                                Log in
                            </Link>
                        </p>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                            Register as a service provider and start connecting
                            with customers.
                        </p>

                        {/* Error Message */}
                        {error && (
                            <div
                                role="alert"
                                aria-live="polite"
                                className="
                                    mt-2
                                    rounded-lg
                                    border
                                    border-red-100
                                    bg-red-50
                                    p-2
                                    text-xs
                                    leading-5
                                    text-red-600
                                "
                            >
                                {error}
                            </div>
                        )}

                        {/* Registration Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="mt-3 space-y-2"
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
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    autoComplete="username"
                                    placeholder="Choose a username"
                                    className="
                                        w-full
                                        rounded-full
                                        border
                                        border-gray-300
                                        px-4
                                        py-2
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

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="
                                        mb-1
                                        block
                                        text-xs
                                        font-semibold
                                        text-gray-800
                                    "
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                    placeholder="Enter your email"
                                    className="
                                        w-full
                                        rounded-full
                                        border
                                        border-gray-300
                                        px-4
                                        py-2
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
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                        placeholder="Create a password"
                                        className="
                                            w-full
                                            rounded-full
                                            border
                                            border-gray-300
                                            py-2
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

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((previous) => !previous)
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
                                                aria-hidden="true"
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
                                                aria-hidden="true"
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

                                <p className="mt-0.5 pl-4 text-[10px] text-gray-500">
                                    At least 6 characters.
                                </p>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="
                                        mb-1
                                        block
                                        text-xs
                                        font-semibold
                                        text-gray-800
                                    "
                                >
                                    Confirm Password
                                </label>

                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                        placeholder="Enter your password again"
                                        className={`
                                            w-full
                                            rounded-full
                                            border
                                            py-2
                                            pl-4
                                            pr-11
                                            text-sm
                                            outline-none
                                            transition
                                            placeholder-gray-400
                                            focus:ring-1
                                            ${
                                                formData.confirmPassword &&
                                                formData.password !==
                                                    formData.confirmPassword
                                                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                                                    : formData.confirmPassword &&
                                                        formData.password ===
                                                            formData.confirmPassword
                                                      ? "border-green-400 focus:border-green-500 focus:ring-green-200"
                                                      : "border-gray-300 focus:border-black focus:ring-black"
                                            }
                                        `}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (previous) => !previous
                                            )
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
                                            showConfirmPassword
                                                ? "Hide confirm password"
                                                : "Show confirm password"
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0 3 3 0 016 0z"
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
                                                aria-hidden="true"
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

                                {formData.confirmPassword &&
                                    formData.password !==
                                        formData.confirmPassword && (
                                        <p className="mt-0.5 pl-4 text-[10px] text-red-500">
                                            Passwords do not match.
                                        </p>
                                    )}

                                {formData.confirmPassword &&
                                    formData.password ===
                                        formData.confirmPassword && (
                                        <p className="mt-0.5 pl-4 text-[10px] text-green-600">
                                            Passwords match.
                                        </p>
                                    )}
                            </div>

                            {/* Terms & Conditions */}
                            <div className="flex items-start gap-2 pt-0.5">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    name="terms"
                                    checked={agreedTerms}
                                    onChange={(event) => {
                                        setAgreedTerms(event.target.checked);

                                        if (event.target.checked) {
                                            setError("");
                                        }
                                    }}
                                    required
                                    className="
                                        mt-0.5
                                        h-3.5
                                        w-3.5
                                        flex-shrink-0
                                        cursor-pointer
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
                                    I have read and agree to the{" "}
                                    <Link
                                        to="/terms"
                                        className="
                                            font-bold
                                            text-black
                                            underline
                                            underline-offset-2
                                            hover:text-gray-700
                                        "
                                    >
                                        Terms & Conditions
                                    </Link>
                                    .
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    w-full
                                    rounded-full
                                    bg-black
                                    py-2
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
                                    ? "Creating account..."
                                    : "Create Provider Account"}
                            </button>
                        </form>

                        {/* Customer Registration Link */}
                        <p className="mt-2 text-center text-[11px] leading-5 text-gray-500 sm:text-xs">
                            Looking for a service instead?{" "}
                            <Link
                                to="/register"
                                className="
                                    font-semibold
                                    text-black
                                    underline
                                    underline-offset-2
                                    hover:text-gray-700
                                "
                            >
                                Register as a customer
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterProvider;
