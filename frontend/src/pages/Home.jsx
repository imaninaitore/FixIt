import { useEffect, useState } from "react";
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
    { name: "Packers & Movers", icon: Truck, category: "Packers & Movers" },
    { name: "Plumber", icon: Wrench, category: "Plumber" },
    { name: "Appliances Repair", icon: Refrigerator, category: "Appliances Repair" },
    { name: "Water Tank Refill", icon: Droplets, category: "Water Tank Refill" },
    { name: "Painters", icon: PaintRoller, category: "Painters" },
    { name: "Electrical", icon: Zap, category: "Electrical." },
    { name: "Carpenters", icon: Hammer, category: "Carpentry" },
    { name: "Pest Control", icon: Bug, category: "Pest Control" },
];

function Home() {
    const navigate = useNavigate();
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setRevealed(true);
        });

        return () => cancelAnimationFrame(frame);
    }, []);

    const reveal = (delay = 0) => ({
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 700ms ease ${delay}ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
    });

    return (
        <main className="min-h-screen overflow-x-clip bg-[#F8F5F0] text-[#172A46]">
            <section
                className="relative min-h-[400px] overflow-visible bg-cover bg-center bg-no-repeat sm:min-h-[440px] lg:min-h-[500px]"
                style={{ backgroundImage: "url('/images/bg.png')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[#172A46]/45 via-[#172A46]/30 to-[#172A46]/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#172A46]/30 via-transparent to-[#172A46]/20" />

                <div className="relative z-30">
                    <Navbar />
                </div>

                <div className="relative z-10 mx-auto flex min-h-[440px] w-full max-w-7xl items-center px-5 pb-10 pt-10 sm:min-h-[440px] sm:px-8 sm:pb-28 sm:pt-4 lg:min-h-[460px] lg:px-12 lg:pb-10 lg:pt-20">
                    <div className="mx-auto w-full max-w-6xl text-left">
                        <p
                            style={reveal(100)}
                            className="mb-3 mt-1 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F2D8CC] sm:mb-4 sm:text-xs sm:tracking-[0.22em] lg:mb-5"
                        >
                            <span className="h-[2px] w-8 rounded-full bg-[#E8794F] sm:w-10" />
                            Trusted local professionals
                        </p>

                        <h1
                            style={reveal(220)}
                            className="font-serif text-[2.65rem] leading-[1.04] tracking-tight text-white sm:text-6xl sm:leading-[1.02] lg:text-7xl xl:text-[5.25rem]"
                        >
                            Home services,
                            <span className="block italic text-[#F28A5C]">
                                on demand.
                            </span>
                        </h1>

                        <div className="mt-5 flex flex-col items-start gap-4 sm:mt-6 sm:flex-row sm:items-center sm:gap-5 lg:mt-7 lg:gap-6">
                            <p
                                style={reveal(360)}
                                className="max-w-xl font-['DM_Serif_Display'] text-base italic leading-7 tracking-[0.01em] text-white sm:text-lg sm:leading-8 lg:text-xl lg:leading-9"
                            >
                                Discover skilled local professionals,
                                <span className="text-[#F2B49A]">
                                    {" "}connect with confidence,
                                </span>{" "}
                                and make home maintenance easier.
                            </p>

                            <button
                                style={reveal(480)}
                                onClick={() => navigate("/providers")}
                                type="button"
                                className="
                                    group inline-flex min-h-11 shrink-0 items-center
                                    justify-center gap-2.5 rounded-xl
                                    border border-[#FFFDF9]/40
                                    bg-white/[0.12] px-4 py-2.5
                                    text-sm font-bold text-white
                                    shadow-[0_8px_32px_rgba(23,42,70,0.18)]
                                    backdrop-blur-xl
                                    transition-all duration-300 ease-out
                                    hover:-translate-y-0.5
                                    hover:border-[#F28A5C]/80
                                    hover:bg-[#C66A4A]/25
                                    hover:shadow-[0_8px_30px_rgba(198,106,74,0.25)]
                                    focus:outline-none focus:ring-2
                                    focus:ring-[#F2D8CC]
                                    focus:ring-offset-2 focus:ring-offset-[#172A46]
                                    active:translate-y-0
                                    sm:mr-2 sm:gap-3 sm:px-5
                                    lg:mr-6 lg:px-6
                                "
                            >
                                <Search
                                    size={18}
                                    strokeWidth={2}
                                    className="text-[#F28A5C] transition-transform duration-300 group-hover:scale-110"
                                />

                                <span>Find a Provider</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Floating services bar */}
                <div
                    style={reveal(600)}
                    className="absolute bottom-0 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 translate-y-1/2 sm:w-[calc(100%-3rem)]"
                >
                    <div className="rounded-2xl border border-[#DCC5B1] bg-[#FFF9F2]/95 p-2.5 shadow-[0_18px_50px_rgba(23,42,70,0.22)] backdrop-blur-md sm:p-4 lg:px-5 lg:py-3.5">
                        <div className="mb-1.5 flex items-center px-1 sm:mb-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C66A4A] sm:text-xs sm:tracking-[0.18em]">
                                Explore services
                            </p>
                        </div>

                        <div className="overflow-x-auto overflow-y-hidden pb-1 scrollbar-thin scrollbar-thumb-[#C66A4A]/50 scrollbar-track-transparent sm:overflow-visible sm:pb-0">
                            <div className="flex w-max min-w-full items-stretch gap-1.5 sm:grid sm:w-full sm:grid-cols-4 sm:gap-2 lg:grid-cols-8 lg:gap-1">
                                {services.map((service) => {
                                    const Icon = service.icon;

                                    return (
                                        <Link
                                            key={service.name}
                                            to={`/providers?category=${encodeURIComponent(service.category)}`}
                                            className="group flex w-[88px] shrink-0 flex-col items-center justify-center rounded-xl border border-transparent px-1.5 py-2 text-center transition duration-200 hover:border-[#E7D8C5] hover:bg-[#F2D8CC]/60 focus:outline-none focus:ring-2 focus:ring-[#C66A4A] sm:w-auto sm:min-w-0 sm:py-2.5"
                                        >
                                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#172A46]/[0.07] text-[#172A46] transition duration-200 group-hover:bg-[#C66A4A] group-hover:text-white sm:h-10 sm:w-10 lg:h-10 lg:w-10">
                                                <Icon
                                                    size={20}
                                                    strokeWidth={1.7}
                                                />
                                            </span>

                                            <span className="mt-1.5 text-[10px] font-semibold leading-4 text-[#172A46] transition-colors group-hover:text-[#B85B3D] sm:mt-2 sm:text-xs">
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

            <section className="relative bg-gradient-to-b from-[#E9D5C5] via-[#F8F5F0] to-[#F8F5F0] px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-8 lg:pt-28">
                <About />
            </section>

            <Footer />
        </main>
    );
}

export default Home;
