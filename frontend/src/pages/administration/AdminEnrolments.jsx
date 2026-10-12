
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getAdminEnrolments } from "../../services/adminService";

const ENROLMENTS_PER_PAGE = 8;

function AdminEnrolments() {
    const navigate = useNavigate();

    const [enrolments, setEnrolments] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadEnrolments();
    }, []);

    async function loadEnrolments() {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminEnrolments();
            const results = data.enrolments || [];

            setEnrolments(results);
            setCount(data.count || results.length);
            setCurrentPage(1);
        } catch (err) {
            setError(
                err.message || "Failed to load provider enrolments."
            );
        } finally {
            setLoading(false);
        }
    }

    const totalPages = Math.ceil(
        enrolments.length / ENROLMENTS_PER_PAGE
    );

    const currentEnrolments = enrolments.slice(
        (currentPage - 1) * ENROLMENTS_PER_PAGE,
        currentPage * ENROLMENTS_PER_PAGE
    );

    const pageNumbers = Array.from(
        { length: totalPages },
        (_, index) => index + 1
    );

    function getStatusStyle(status) {
        if (status === "approved") {
            return "bg-green-100 text-green-700";
        }

        if (status === "rejected") {
            return "bg-red-100 text-red-700";
        }

        if (status === "submitted") {
            return "bg-[#F2D8CC] text-[#9A4B32]";
        }

        if (status === "draft") {
            return "bg-gray-100 text-gray-700";
        }

        return "bg-gray-100 text-gray-700";
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#172A46] via-[#D9C2AD] to-[#F2D8CC]">
            {/* Header */}
            <header className="bg-gradient-to-r from-[#172A46] to-[#35435B] text-white shadow-md">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h1 className="text-xl font-bold sm:text-2xl">
                            Provider Enrolments
                        </h1>

                        <p className="mt-1 text-xs text-white/75 sm:text-sm">
                            Review and manage service provider applications.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="w-fit rounded-lg border border-white/30 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
               
{/* Summary */}
<div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/60 bg-[#FFFDF9]/95 px-4 py-3 shadow-sm backdrop-blur-sm">
        <p className="text-xs font-medium text-gray-500 sm:text-sm">
            Total Enrolments
        </p>
        <p className="text-xl font-bold text-[#172A46]">
            {count}
        </p>
    </div>

    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/60 bg-[#FFFDF9]/95 px-4 py-3 shadow-sm backdrop-blur-sm">
        <p className="text-xs font-medium text-gray-500 sm:text-sm">
            Pending Review
        </p>
        <p className="text-xl font-bold text-[#C66A4A]">
            {
                enrolments.filter(
                    (enrolment) => enrolment.status === "submitted"
                ).length
            }
        </p>
    </div>

    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/60 bg-[#FFFDF9]/95 px-4 py-3 shadow-sm backdrop-blur-sm">
        <p className="text-xs font-medium text-gray-500 sm:text-sm">
            Approved
        </p>
        <p className="text-xl font-bold text-green-700">
            {
                enrolments.filter(
                    (enrolment) => enrolment.status === "approved"
                ).length
            }
        </p>
    </div>
</div>


                {/* Error */}
                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Loading and empty states */}
                {loading ? (
                    <div className="rounded-xl border border-white/60 bg-[#FFFDF9]/95 p-8 text-center shadow-sm">
                        <p className="text-sm text-gray-500">
                            Loading provider enrolments...
                        </p>
                    </div>
                ) : enrolments.length === 0 ? (
                    <div className="rounded-xl border border-white/60 bg-[#FFFDF9]/95 p-8 text-center shadow-sm">
                        <h2 className="text-base font-semibold text-[#172A46]">
                            No enrolments found
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            There are currently no provider enrolments to review.
                        </p>
                    </div>
                ) : (
                    <section className="overflow-hidden rounded-xl border border-white/60 bg-[#FFFDF9]/95 shadow-md backdrop-blur-sm">
                        {/* Table header */}
                        <div className="border-b border-gray-200 px-4 py-3 sm:px-5">
                            <h2 className="text-base font-semibold text-[#172A46]">
                                Provider Applications
                            </h2>

                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                Select an enrolment to view the submitted information.
                            </p>
                        </div>

                        {/* Responsive table */}
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[540px]">
                                <thead className="bg-[#F4EDE5]">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#172A46] sm:px-5">
                                            Enrolment ID
                                        </th>

                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#172A46] sm:px-5">
                                            Provider
                                        </th>

                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#172A46] sm:px-5">
                                            Status
                                        </th>

                                        <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-[#172A46] sm:px-5">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {currentEnrolments.map((enrolment) => (
                                        <tr
                                            key={enrolment.id}
                                            className="transition hover:bg-[#F4EDE5]/70"
                                        >
                                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                                <span className="text-sm font-semibold text-[#172A46]">
                                                    #{enrolment.id}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 sm:px-5">
                                                <span className="block max-w-[220px] truncate text-sm font-medium text-gray-800">
                                                    {enrolment.provider ||
                                                        "Unknown provider"}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${getStatusStyle(
                                                        enrolment.status
                                                    )}`}
                                                >
                                                    {enrolment.status ||
                                                        "Unknown"}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-3 text-right sm:px-5">
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/enrolments/${enrolment.id}`
                                                        )
                                                    }
                                                    className="rounded-md bg-[#C66A4A] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#AC5639] focus:outline-none focus:ring-2 focus:ring-[#C66A4A]/40 sm:text-sm"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                <p className="text-xs text-gray-500 sm:text-sm">
                                    Showing{" "}
                                    <span className="font-semibold text-[#172A46]">
                                        {(currentPage - 1) *
                                            ENROLMENTS_PER_PAGE +
                                            1}
                                    </span>
                                    {"–"}
                                    <span className="font-semibold text-[#172A46]">
                                        {Math.min(
                                            currentPage *
                                                ENROLMENTS_PER_PAGE,
                                            enrolments.length
                                        )}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-[#172A46]">
                                        {enrolments.length}
                                    </span>
                                </p>

                                <nav
                                    aria-label="Enrolment pagination"
                                    className="flex flex-wrap items-center gap-1"
                                >
                                    <button
                                        onClick={() =>
                                            setCurrentPage((page) =>
                                                Math.max(1, page - 1)
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        aria-label="Previous page"
                                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1.5 text-xs font-medium text-[#172A46] transition hover:bg-[#F4EDE5] disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:text-sm"
                                    >
                                        <ChevronLeft size={15} />
                                        <span>Previous</span>
                                    </button>

                                    {pageNumbers.map((page) => (
                                        <button
                                            key={page}
                                            onClick={() =>
                                                setCurrentPage(page)
                                            }
                                            aria-current={
                                                currentPage === page
                                                    ? "page"
                                                    : undefined
                                            }
                                            aria-label={`Page ${page}`}
                                            className={`min-h-8 min-w-8 rounded-md px-2 text-xs font-semibold transition sm:text-sm ${
                                                currentPage === page
                                                    ? "bg-[#172A46] text-white"
                                                    : "border border-gray-200 text-[#172A46] hover:bg-[#F4EDE5]"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() =>
                                            setCurrentPage((page) =>
                                                Math.min(
                                                    totalPages,
                                                    page + 1
                                                )
                                            )
                                        }
                                        disabled={
                                            currentPage === totalPages
                                        }
                                        aria-label="Next page"
                                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1.5 text-xs font-medium text-[#172A46] transition hover:bg-[#F4EDE5] disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:text-sm"
                                    >
                                        <span>Next</span>
                                        <ChevronRight size={15} />
                                    </button>
                                </nav>
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}

export default AdminEnrolments;
