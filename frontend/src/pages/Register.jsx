import { Link } from "react-router-dom";

function Register() {
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
                            Everything you need, one trusted connection away.
                        </h1>

                        <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">
                            Join FixIt and connect with reliable professionals
                            for the services you need.
                        </p>

                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center justify-center bg-white px-6 py-10 sm:px-10">
                    <div className="w-full max-w-md">

                        {/* Mobile logo */}
                        <div className="mb-8 lg:hidden">
                            <Link
                                to="/"
                                className="text-3xl font-bold text-slate-900"
                            >
                                Fix<span className="text-blue-500">It</span>
                            </Link>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                Create your account
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Join FixIt and get started today.
                            </p>
                        </div>

                        <form className="mt-7 space-y-4">

                            {/* Username */}
                            <div>
                                <label
                                    htmlFor="username"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Username
                                </label>

                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Choose a username"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* Account type */}
                            <div>
                                <label
                                    htmlFor="account_type"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Account type
                                </label>

                                <select
                                    id="account_type"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="customer">
                                        Customer
                                    </option>

                                    <option value="provider">
                                        Service Provider
                                    </option>
                                </select>
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Create a password"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* Confirm password */}
                            <div>
                                <label
                                    htmlFor="confirm_password"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Confirm password
                                </label>

                                <input
                                    id="confirm_password"
                                    type="password"
                                    placeholder="Confirm your password"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* Register button */}
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-blue-500 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                            >
                                Create Account
                            </button>

                        </form>

                        <p className="mt-7 text-center text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-blue-500 hover:text-blue-600"
                            >
                                Log in
                            </Link>
                        </p>

                    </div>
                </div>

            </div>
        </main>
    );
}

export default Register;