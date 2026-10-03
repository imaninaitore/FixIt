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

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === "password" || name === "confirmPassword") {
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
                "provider"
            );

            navigate("/login");
        } catch (error) {
            setError(error.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main
            className="
                min-h-screen
                bg-cover
                bg-center
                bg-no-repeat
                px-4
                py-6
                sm:px-6
                lg:px-10
            "
            style={{
                backgroundImage: "url('/images/tools.png')",
            }}
        >
            {/* Background overlay */}
            <div className="fixed inset-0 bg-black/10" />

            {/* Content */}
            <div
                className="
                    relative
                    z-10
                    flex
                    min-h-[calc(100vh-3rem)]
                    items-center
                    justify-start
                "
            >
                {/* Smaller container */}
                <div
                    className="
                        w-full
                        max-w-sm
                        lg:ml-[7%]
                    "
                >
                    {/* Registration Card */}
                    <div
                        className="
                            rounded-2xl
                            border
                            border-white/20
                            bg-white/95
                            p-4
                            shadow-2xl
                            backdrop-blur-md
                            sm:p-5
                        "
                    >
                        {/* Heading */}
                        <div className="mb-4">
                            <p
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.2em]
                                    text-blue-600
                                    sm:text-xs
                                "
                            >
                                FixIt Provider
                            </p>

                            <h1
                                className="
                                    mt-1
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-slate-800
                                    sm:text-[26px]
                                "
                            >
                                Create Your Provider Account
                            </h1>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Join FixIt and connect with customers looking
                                for local professionals.
                            </p>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div
                                className="
                                    mb-3
                                    rounded-lg
                                    border
                                    border-red-200
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

                        {/* Registration form */}
                        <form onSubmit={handleSubmit}>
                            {/* Username */}
                            <div className="mb-3">
                                <label
                                    htmlFor="username"
                                    className="
                                        mb-1
                                        block
                                        text-xs
                                        font-medium
                                        text-slate-700
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
                                        rounded-lg
                                        border
                                        border-slate-300
                                        bg-white
                                        px-3
                                        py-2
                                        text-sm
                                        text-slate-800
                                        outline-none
                                        transition
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                    "
                                />
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                                <label
                                    htmlFor="email"
                                    className="
                                        mb-1
                                        block
                                        text-xs
                                        font-medium
                                        text-slate-700
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
                                        rounded-lg
                                        border
                                        border-slate-300
                                        bg-white
                                        px-3
                                        py-2
                                        text-sm
                                        text-slate-800
                                        outline-none
                                        transition
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                    "
                                />
                            </div>

                            {/* Password */}
                            <div className="mb-3">
                                <label
                                    htmlFor="password"
                                    className="
                                        mb-1
                                        block
                                        text-xs
                                        font-medium
                                        text-slate-700
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
                                        rounded-lg
                                        border
                                        border-slate-300
                                        bg-white
                                        px-3
                                        py-2
                                        text-sm
                                        text-slate-800
                                        outline-none
                                        transition
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                    "
                                />

                                <p className="mt-1 text-[10px] text-slate-500">
                                    At least 6 characters.
                                </p>
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-3.5">
                                <label
                                    htmlFor="confirmPassword"
                                    className="
                                        mb-1
                                        block
                                        text-xs
                                        font-medium
                                        text-slate-700
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
                                        rounded-lg
                                        border
                                        bg-white
                                        px-3
                                        py-2
                                        text-sm
                                        text-slate-800
                                        outline-none
                                        transition
                                        focus:ring-2
                                        ${
                                            formData.confirmPassword &&
                                            formData.password !==
                                                formData.confirmPassword
                                                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                                : formData.confirmPassword &&
                                                    formData.password ===
                                                        formData.confirmPassword
                                                  ? "border-green-400 focus:border-green-500 focus:ring-green-100"
                                                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
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

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    w-full
                                    rounded-lg
                                    bg-blue-600
                                    py-2
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-blue-700
                                    disabled:cursor-not-allowed
                                    disabled:bg-blue-400
                                "
                            >
                                {loading
                                    ? "Creating provider account..."
                                    : "Create Provider Account"}
                            </button>
                        </form>

                        {/* Login link */}
                        <div className="mt-3 text-center">
                            <p className="text-xs text-slate-500">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="
                                        font-semibold
                                        text-blue-600
                                        hover:text-blue-700
                                    "
                                >
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default RegisterProvider;