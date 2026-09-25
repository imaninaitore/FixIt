function Navbar() {
    const username = localStorage.getItem("username");
    return (
        <nav className="absolute top-0 left-0 z-20 w-full">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">

                {/* Logo */}
                <a href="/" className="text-2xl font-bold text-white">
                    Fix<span className="text-blue-400">It</span>
                </a>

                {/* Navigation links */}
                <div className="hidden items-center gap-8 md:flex">
                    <a
                        href="/"
                        className="text-sm font-medium text-white transition hover:text-blue-300"
                    >
                        Home
                    </a>

                    <a
                        href="#providers"
                        className="text-sm font-medium text-white transition hover:text-blue-300"
                    >
                        Find a Provider
                    </a>

                    <a
                        href="#about"
                        className="text-sm font-medium text-white transition hover:text-blue-300"
                    >
                        About
                    </a>

                    <a
                        href="#contact"
                        className="text-sm font-medium text-white transition hover:text-blue-300"
                    >
                        Contacts
                    </a>
                </div>

{username ? (
    <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            {username.charAt(0).toUpperCase()}
        </div>

        <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">
                {username}
            </p>
            <p className="text-xs text-slate-500">
                Logged in
            </p>
        </div>
    </div>
) : (
    <Link
        to="/login"
        className="rounded-lg bg-blue-600 px-5 py-2 text-white font-medium hover:bg-blue-700"
    >
        Login
    </Link>
)}

                {/* Authentication buttons */}
                <div className="flex items-center gap-3">
                    <a
                        href=""
                        className="text-sm font-medium text-white transition hover:underline"
                    >
                        Register as a provider
                    </a>

                    <a
                        href="/login"
                        className="rounded-lg bg-blue-400 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                        Log In
                    </a>

                    <a
                        href="/register"
                        className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                    >
                        Sign Up
                    </a>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;