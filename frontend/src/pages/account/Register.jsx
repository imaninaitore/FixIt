import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        accountType: "customer",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });

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
                formData.accountType
            );

            navigate("/login");
        } catch (error) {
            setError(
                error.message || "Registration failed."
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

                {/* Main Card */}
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
                            min-h-[210px]
                            w-full
                            flex-shrink-0
                            overflow-hidden
                            rounded-[19px]
                            bg-black
                            sm:min-h-[240px]
                            md:min-h-[500px]
                            md:w-[44%]
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
                                Get started with FixIt.
                            </h2>

                            <p
                                className="
                                    mt-1.5
                                    max-w-sm
                                    text-xs
                                    leading-5
                                    text-white/85
                                    sm:text-sm
                                "
                            >
                                Create your account and connect with
                                trusted professionals through FixIt.
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
                            sm:py-6
                            md:w-[56%]
                            md:px-9
                            md:py-7
                        "
                    >

                        {/* Heading */}
                        <div className="mb-4">
                            <h1
                                className="
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-gray-900
                                    sm:text-3xl
                                "
                            >
                                Create Your Account
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
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div
                                className="
                                    mb-3
                                    rounded-lg
                                    border
                                    border-red-100
                                    bg-red-50
                                    px-3
                                    py-2
                                    text-xs
                                    text-red-600
                                "
                            >
                                {error}
                            </div>
                        )}

                        {/* Registration Form */}
                        <form onSubmit={handleSubmit}>

                            {/* Username */}
                            <div className="mb-2.5">
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
                                    placeholder="Choose a username"
                                    required
                                    className="
                                        w-full
                                        rounded-full
                                        border
                                        border-gray-300
                                        bg-white
                                        px-4
                                        py-2
                                        text-sm
                                        text-gray-800
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
                            <div className="mb-2.5">
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
                                    placeholder="Enter your email"
                                    required
                                    className="
                                        w-full
                                        rounded-full
                                        border
                                        border-gray-300
                                        bg-white
                                        px-4
                                        py-2
                                        text-sm
                                        text-gray-800
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
                            <div className="mb-2.5">
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

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    required
                                    minLength={6}
                                    className="
                                        w-full
                                        rounded-full
                                        border
                                        border-gray-300
                                        bg-white
                                        px-4
                                        py-2
                                        text-sm
                                        text-gray-800
                                        outline-none
                                        transition
                                        placeholder-gray-400
                                        focus:border-black
                                        focus:ring-1
                                        focus:ring-black
                                    "
                                />

                                <p className="mt-1 text-[10px] text-gray-500">
                                    Password must be at least 6 characters.
                                </p>
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-2.5">
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

                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Enter your password again"
                                    required
                                    minLength={6}
                                    className={`
                                        w-full
                                        rounded-full
                                        border
                                        bg-white
                                        px-4
                                        py-2
                                        text-sm
                                        text-gray-800
                                        outline-none
                                        transition
                                        focus:ring-1
                                        ${
                                            formData.confirmPassword &&
                                            formData.password !==
                                                formData.confirmPassword
                                                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                                : formData.confirmPassword &&
                                                    formData.password ===
                                                        formData.confirmPassword
                                                  ? "border-green-400 focus:border-green-500 focus:ring-green-100"
                                                  : "border-gray-300 focus:border-black focus:ring-black"
                                        }
                                    `}
                                />

                                {formData.confirmPassword &&
                                    formData.password !==
                                        formData.confirmPassword && (
                                        <p className="mt-1 text-[10px] text-red-500">
                                            Passwords do not match.
                                        </p>
                                    )}

                                {formData.confirmPassword &&
                                    formData.password ===
                                        formData.confirmPassword && (
                                        <p className="mt-1 text-[10px] text-green-600">
                                            Passwords match.
                                        </p>
                                    )}
                            </div>

                            {/* Account Type */}
                            <div className="mb-3">
                                <label
                                    htmlFor="accountType"
                                    className="
                                        mb-1
                                        block
                                        text-xs
                                        font-semibold
                                        text-gray-800
                                    "
                                >
                                    Account Type
                                </label>

                                <select
                                    id="accountType"
                                    name="accountType"
                                    value={formData.accountType}
                                    onChange={handleChange}
                                    className="
                                        w-full
                                        rounded-full
                                        border
                                        border-gray-300
                                        bg-white
                                        px-4
                                        py-2
                                        text-sm
                                        text-gray-800
                                        outline-none
                                        transition
                                        focus:border-black
                                        focus:ring-1
                                        focus:ring-black
                                    "
                                >
                                    <option value="customer">
                                        Customer
                                    </option>

                                    <option value="provider">
                                        Provider
                                    </option>
                                </select>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
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
                                    ? "Creating account..."
                                    : "Create Account"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
