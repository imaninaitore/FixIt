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

        // Clear password mismatch message when the user edits
        // either password field.
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

        // Check that the passwords match before sending
        // the registration request to Django.
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

            // Registration succeeded.
            // Send the user to the login page.
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
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-md">

                <div className="rounded-2xl bg-white p-8 shadow-xl">

                    {/* Heading */}
                    <div className="mb-8 text-center">

                        <h1 className="text-3xl font-bold text-slate-800">
                            Create Your Account
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Join FixIt and get started
                        </p>

                    </div>


                    {/* Error message */}
                    {error && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}


                    {/* Registration form */}
                    <form onSubmit={handleSubmit}>

                        {/* Username */}
                        <div className="mb-5">

                            <label
                                htmlFor="username"
                                className="mb-2 block text-sm font-medium text-slate-700"
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
                                className="w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* Email */}
                        <div className="mb-5">

                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-700"
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
                                className="w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* Password */}
                        <div className="mb-5">

                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-700"
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
                                className="w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            <p className="mt-2 text-xs text-slate-500">
                                Password must be at least 6 characters.
                            </p>

                        </div>


                        {/* Confirm Password */}
                        <div className="mb-5">

                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-medium text-slate-700"
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
                                className={`w-full rounded-lg border-2 bg-white px-4 py-3 text-slate-800 outline-none transition focus:ring-2 ${
                                    formData.confirmPassword &&
                                    formData.password !== formData.confirmPassword
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                        : formData.confirmPassword &&
                                          formData.password === formData.confirmPassword
                                            ? "border-green-400 focus:border-green-500 focus:ring-green-100"
                                            : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                                }`}
                            />

                            {/* Live password match message */}
                            {formData.confirmPassword &&
                                formData.password !== formData.confirmPassword && (
                                    <p className="mt-2 text-xs text-red-500">
                                        Passwords do not match.
                                    </p>
                                )}

                            {formData.confirmPassword &&
                                formData.password === formData.confirmPassword && (
                                    <p className="mt-2 text-xs text-green-600">
                                        Passwords match.
                                    </p>
                                )}

                        </div>


                        {/* Account Type */}
                        <div className="mb-6">

                            <label
                                htmlFor="accountType"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Account Type
                            </label>

                            <select
                                id="accountType"
                                name="accountType"
                                value={formData.accountType}
                                onChange={handleChange}
                                className="w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                        >
                            {loading
                                ? "Creating account..."
                                : "Create Account"}
                        </button>

                    </form>


                    {/* Login link */}
                    <div className="mt-6 text-center">

                        <p className="text-sm text-slate-500">

                            Already have an account?{" "}

                            <Link
                                to="/login"
                                className="font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Log in
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;