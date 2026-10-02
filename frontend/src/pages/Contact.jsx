import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Contact() {
    return (
        <main className="min-h-screen bg-slate-900">

            {/* Contact Hero */}
            <section
                className="
                    relative
                    min-h-screen
                    overflow-hidden
                    bg-cover
                    bg-center
                    bg-no-repeat
                "
                style={{
                    backgroundImage: "url('/images/tools3.jpg')",
                }}
            >
                {/* Background overlay */}
                <div className="absolute inset-0 bg-slate-900/30" />

                {/* Navbar */}
                <div className="relative z-30">
                    <Navbar />
                </div>

                {/* Contact content */}
                <div
                    className="
                        relative
                        z-10
                        flex
                        min-h-screen
                        items-end
                        justify-center
                        px-6
                        pb-16
                        pt-32

                        sm:justify-end
                        sm:px-10
                        sm:pb-20

                        lg:px-16
                        lg:pb-24
                    "
                >
                    <div
                        className="
                            w-full
                            max-w-sm
                            text-center

                            sm:text-right
                        "
                    >
                        {/* Heading */}
                        <h1
                            className="
                                text-3xl
                                font-bold
                                tracking-tight
                                text-white
                                sm:text-4xl
                            "
                        >
                            Contact <span className="text-blue-400">Us</span>
                        </h1>

                        {/* Location */}
                        <div className="mt-6">
                            <p className="text-sm font-medium text-white/90">
                                Nairobi, Kenya
                            </p>

                            <div className="mt-4 h-px w-full bg-white" />
                        </div>

                        {/* Phone */}
                        <div className="mt-6">
                            <p className="text-sm font-medium text-white">
                                +254 716 869 670
                            </p>

                            <div className="mt-4 h-px w-full bg-white" />
                        </div>

                        {/* Email */}
                        <div className="mt-6">
                            <p className="break-words text-sm font-medium text-white">
                                fixitsupport@gmail.com
                            </p>

                            <div className="mt-5 h-px w-full bg-white" />
                        </div>

                        {/* Social Media */}
                        <div
                            className="
                                mt-7
                                flex
                                items-center
                                justify-center
                                gap-6
                                sm:justify-end
                            "
                        >
                            {/* Facebook */}
                            <a
                                href="#"
                                aria-label="Facebook"
                                className="
                                    text-white/80
                                    transition
                                    duration-200
                                    hover:scale-110
                                    hover:text-blue-400
                                "
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 320 512"
                                    className="h-5 w-5 fill-current"
                                >
                                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06H297V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                                </svg>
                            </a>

                            {/* LinkedIn */}
                            <a
                                href="#"
                                aria-label="LinkedIn"
                                className="
                                    text-white/80
                                    transition
                                    duration-200
                                    hover:scale-110
                                    hover:text-blue-400
                                "
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 448 512"
                                    className="h-5 w-5 fill-current"
                                >
                                    <path d="M100.28 448H7.4V148.9h92.88zm-46.49-340.7C24.09 107.3 0 83.2 0 53.6A53.6 53.6 0 0 1 53.79 0c29.59 0 53.68 24.09 53.68 53.6 0 29.6-24.09 53.7-53.68 53.7zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                                </svg>
                            </a>

                            {/* X */}
                            <a
                                href="#"
                                aria-label="X"
                                className="
                                    text-white/80
                                    transition
                                    duration-200
                                    hover:scale-110
                                    hover:text-blue-400
                                "
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    className="h-5 w-5 fill-current"
                                >
                                    <path d="M389.2 48h70.6L305.6 224.2 487 464H345.2L234.8 318.6 108.5 464H37.8l164.9-188.5L29.9 48H175.4l99.8 132.1L389.2 48zM364.4 421.8h39.1L155.1 88h-42z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default Contact;