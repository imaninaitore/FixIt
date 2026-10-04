import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import About from "../components/About";

import {
    Truck,
    Wrench,
    Refrigerator,
    Droplets,
    PaintRoller,
    Zap,
    Hammer,
    Bug,
    Search,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

const services = [
    {
        name: "Packers & Movers",
        icon: Truck,
        category: "Packers & Movers",
    },
    {
        name: "Plumber",
        icon: Wrench,
        category: "Plumber",
    },
    {
        name: "Appliances Repair",
        icon: Refrigerator,
        category: "Appliances Repair",
    },
    {
        name: "Water Tank Refill",
        icon: Droplets,
        category: "Water Tank Refill",
    },
    {
        name: "Painters",
        icon: PaintRoller,
        category: "Painters",
    },
    {
        name: "Electrical",
        icon: Zap,
        category: "Electrical.",
    },
    {
        name: "Carpenters",
        icon: Hammer,
        category: "Carpentry",
    },
    {
        name: "Pest Control",
        icon: Bug,
        category: "Pest Control",
    },
];

function Home() {
    const navigate = useNavigate();

    return (
        <main className="min-h-screen bg-white">
            {/* Hero */}
            <section
                className="
                    relative
                    min-h-[400px]
                    overflow-visible
                    bg-cover
                    bg-center
                    bg-no-repeat
                    sm:min-h-[100px]
                    lg:min-h-[200px]
                "
                style={{
                    backgroundImage: "url('/images/bg.png')",
                }}
            >
                {/* Background overlay */}
                <div className="absolute inset-0" />

                {/* Navbar */}
                <div className="relative z-30">
                    <Navbar />
                </div>

                {/* Hero content */}
                <div
                    className="
                        relative
                        z-10
                        flex
                        min-h-[200px]
                        items-start
                        justify-center
                        px-6
                        pt-30
                        text-center
                        sm:min-h-[400px]
                        sm:px-8
                        lg:min-h-[480px]
                        lg:pt-30
                    "
                >
                    <div className="w-full max-w-3xl text-white">
                        {/* Small heading */}
                        <p
                            className="
                                mb-3
                                text-xs
                                font-medium
                                uppercase
                                tracking-[0.2em]
                                text-white/80
                                sm:mt-10
                                sm:text-sm
                            "
                        >
                            Trusted Local Professionals
                        </p>

                        {/* Main heading */}
                        <h1
                            className="
                                text-2xl
                                font-bold
                                leading-tight
                                tracking-tight
                                text-white
                                sm:text-xl
                                lg:text-6xl
                            "
                        >
                            Home Service, On Demand
                        </h1>

                        {/* Divider */}
                        <div
                            className="
                                mx-auto
                                mt-3
                                h-px
                                w-14
                                bg-white/60
                            "
                        />

                        {/* Find a Provider button */}
                        <button
                            onClick={() => navigate("/providers")}
                            type="button"
                            className="
                                group
                                mx-auto
                                mt-7
                                flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-white/30
                                bg-[#53627c]/70
                                px-7
                                py-3
                                text-sm
                                font-medium
                                text-white
                                shadow-[0_8px_25px_rgba(31,41,55,0.25)]
                                backdrop-blur-md
                                transition-all
                                duration-300
                                hover:border-white/50
                                hover:bg-[#53627c]/90
                                hover:shadow-[0_10px_30px_rgba(31,41,55,0.35)]
                                active:scale-[0.98]
                            "
                        >
                            <Search
                                size={18}
                                strokeWidth={1.8}
                                className="
                                    transition-transform
                                    duration-300
                                    group-hover:scale-110
                                "
                            />

                            <span>Find a Provider</span>
                        </button>
                    </div>
                </div>

                {/* Floating services panel */}
                <div
                    className="
                        absolute
                        bottom-0
                        left-1/2
                        z-40
                        w-[calc(100%-2rem)]
                        max-w-4xl
                        -translate-x-1/2
                        translate-y-1/2
                    "
                >
                    <div
                        className="
                            rounded-2xl
                            bg-white
                            px-4
                            py-5
                            shadow-[0_12px_40px_rgba(0,0,0,0.16)]
                            sm:px-6
                            sm:py-3
                            lg:px-10
                            lg:py-5
                        "
                    >
                        {/* Scrollable only on smaller screens */}
                        <div
                            className="
                                overflow-x-auto
                                overflow-y-hidden
                                scrollbar-thin
                                scrollbar-thumb-slate-300
                                scrollbar-track-transparent
                                sm:overflow-x-visible
                            "
                        >
                            <div
                                className="
                                    flex
                                    w-max
                                    min-w-full
                                    items-center
                                    gap-3
                                    sm:grid
                                    sm:w-full
                                    sm:grid-cols-2
                                    sm:gap-x-2
                                    sm:gap-y-4
                                    md:grid-cols-4
                                    lg:grid-cols-8
                                "
                            >
                                {services.map((service) => {
                                    const Icon = service.icon;

                                    return (
                                        <Link
                                            key={service.name}
                                            to={`/providers?category=${encodeURIComponent(
                                                service.category
                                            )}`}
                                            className="
                                                group
                                                flex
                                                w-[90px]
                                                shrink-0
                                                flex-col
                                                items-center
                                                justify-center
                                                rounded-xl
                                                px-1
                                                py-1
                                                text-center
                                                transition-all
                                                duration-200
                                                hover:bg-[#eef3f8]
                                                sm:w-auto
                                                sm:min-w-0
                                            "
                                        >
                                            <div
                                                className="
                                                    flex
                                                    h-10
                                                    w-10
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    text-[#53627c]
                                                    transition-all
                                                    duration-200
                                                    group-hover:bg-blue-50
                                                    group-hover:text-blue-600
                                                    sm:h-11
                                                    sm:w-11
                                                    lg:h-12
                                                    lg:w-12
                                                "
                                            >
                                                <Icon
                                                    size={24}
                                                    strokeWidth={1.5}
                                                    className="
                                                        transition-all
                                                        duration-200
                                                        group-hover:scale-110
                                                    "
                                                />
                                            </div>

                                            <span
                                                className="
                                                    mt-2
                                                    max-w-[105px]
                                                    text-[9px]
                                                    font-medium
                                                    leading-4
                                                    text-[#53627c]
                                                    transition-colors
                                                    duration-200
                                                    group-hover:text-blue-600
                                                    sm:text-[10px]
                                                    lg:text-xs
                                                "
                                            >
                                                {service.name}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About section */}
            <section
                className="
                    relative
                    bg-gradient-to-b
                    from-slate-100
                    via-white
                    to-white
                    pt-24
                    sm:pt-28
                    lg:pt-32
                "
            >
                <About />
            </section>

            {/* Footer */}
            <Footer />
        </main>
    );
}

export default Home;