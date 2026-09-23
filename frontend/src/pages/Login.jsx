import { Link } from "react-router-dom";
import { useState } from "react";

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");

const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/auth/login/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            }
        );

        const data = await response.json();

        console.log("Login response:", data);

        if (response.ok) {
            // Save the JWT tokens
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);

            // Save the username
            localStorage.setItem("username", data.username);

            alert(data.message);

        } else {
            // Show the error returned by Django
            console.log("Login failed:", data);
            alert("Login failed. Please check your username and password.");
        }

    } catch (error) {
        console.error("Connection error:", error);
        alert("Could not connect to the Django server.");
    }
};

function Login() {
    return (
        <main className="min-h-screen bg-slate-950">

            <div className="grid min-h-screen lg:grid-cols-2">

                {/* Left side */}
                <div className="relative hidden overflow-hidden lg:flex lg:items-center">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: "url('/images/bg.png')",
                        }}
                    ></div>

                    <div className="absolute inset-0 bg-slate-950/70"></div>

                    <div className="relative z-10 px-12 xl:px-20">
                        <Link
                            to="/"
                            className="text-3xl font-bold text-white"
                        >
                            Fix<span className="text-blue-400">It</span>
                        </Link>

                        <h1 className="mt-12 max-w-lg text-5xl font-semibold leading-tight text-white xl:text-6xl">
                            Find trusted professionals for your next job.
                        </h1>

                        <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">
                            Connect with skilled local service providers and
                            get the job done with confidence.
                        </p>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-10">
                    <div className="w-full max-w-md">

                        {/* Mobile logo */}
                        <div className="mb-10 lg:hidden">
                            <Link
                                to="/"
                                className="text-3xl font-bold text-slate-900"
                            >
                                Fix<span className="text-blue-500">It</span>
                            </Link>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                Welcome back
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Sign in to your FixIt account.
                            </p>
                        </div>

                        <form className="mt-8 space-y-5"
                        onSubmit={handleLogin}
                        >

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Email
                                </label>

                                <input
                                    id="username"
                                    type="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="username"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-slate-700"
                                    >
                                        Password
                                    </label>

                                    <a
                                        href="#"
                                        className="text-sm font-medium text-blue-500 hover:text-blue-600"
                                    >
                                        Forgot password?
                                    </a>
                                </div>

                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* Login button */}
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-blue-500 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                            >
                                Log In
                            </button>

                        </form>

                        <p className="mt-8 text-center text-sm text-slate-500">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="font-semibold text-blue-500 hover:text-blue-600"
                            >
                                Create one
                            </Link>
                        </p>

                    </div>
                </div>

            </div>
        </main>
    );
}

export default Login;