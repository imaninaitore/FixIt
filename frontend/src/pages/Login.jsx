import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";
import { API_URL } from "../services/api";
import { getMyProviderEnrolment } from "../services/providerEnrolmentService";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            // Login the user
            const loginData = await loginUser(username, password);

            // Get the logged-in user's profile
            const profileResponse = await fetch(
                `${API_URL}/auth/me/`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${loginData.access}`,
                    },
                }
            );

            const profileData = await profileResponse.json();

            if (!profileResponse.ok) {
                throw new Error(
                    profileData.detail ||
                    "Could not load your profile."
                );
            }

// Save the account type so the homepage knows
// whether to show provider-specific navigation.
localStorage.setItem("account_type", profileData.account_type);

// All users go to the homepage after login.
navigate("/");

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                <div className="rounded-2xl bg-white p-8 shadow-xl">

                    {/* Heading */}
                    <div className="mb-8 text-center">

                        <h1 className="text-3xl font-bold text-slate-800">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Log in to your FixIt account
                        </p>

                    </div>


                    {/* Error message */}
                    {error && (
                        <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}


                    {/* Login form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Username */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Username
                            </label>

                            <input
                                type="text"
                                value={username}
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="Enter your username"
                            />
                        </div>


                        {/* Password */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="Enter your password"
                            />
                        </div>


                        {/* Login button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Logging in..." : "Log In"}
                        </button>

                    </form>


                    {/* Register */}
                    <p className="mt-6 text-center text-sm text-slate-500">

                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Sign up
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;