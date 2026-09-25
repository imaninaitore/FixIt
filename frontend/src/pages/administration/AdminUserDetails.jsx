import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getAdminUser,
    updateUserStatus,
} from "../../services/adminService";


function AdminUserDetails() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


    useEffect(() => {
        loadUser();
    }, [userId]);


    async function loadUser() {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            const data = await getAdminUser(userId);

            setUser(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }


    async function handleStatusChange() {
        if (!user) {
            return;
        }

        try {
            setUpdating(true);
            setError("");
            setMessage("");

            const newStatus = !user.is_active;

            const data = await updateUserStatus(
                user.id,
                newStatus
            );

            setUser({
                ...user,
                is_active: data.is_active,
            });

            setMessage(data.message);
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    }


    function formatDate(date) {
        if (!date) {
            return "Not available";
        }

        return new Date(date).toLocaleString();
    }


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

                    <p className="mt-4 text-gray-600">
                        Loading user details...
                    </p>

                </div>
            </div>
        );
    }


    if (error && !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-md text-center">

                    <h1 className="text-xl font-semibold text-gray-900">
                        Unable to load user
                    </h1>

                    <p className="mt-3 text-gray-600">
                        {error}
                    </p>

                    <button
                        onClick={() => navigate("/admin/users")}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                        Back to Users
                    </button>

                </div>

            </div>
        );
    }


    if (!user) {
        return null;
    }


    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <div className="bg-blue-700">
                <div className="max-w-5xl mx-auto px-6 py-10">

                    <button
                        onClick={() => navigate("/admin/users")}
                        className="text-blue-100 hover:text-white text-sm"
                    >
                        Back to Users
                    </button>

                    <div className="mt-8">

                        <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">
                            User Details
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">
                            {user.username}
                        </h1>

                        <p className="text-blue-100 mt-2">
                            {user.email || "No email provided"}
                        </p>

                    </div>

                </div>
            </div>


            <main className="max-w-5xl mx-auto px-6 py-10">

                {message && (
                    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">
                        {message}
                    </div>
                )}


                {error && user && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                        {error}
                    </div>
                )}


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Account summary */}
                    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-7">

                        <h2 className="text-lg font-semibold text-gray-900">
                            Account Status
                        </h2>

                        <div className="mt-6">

                            <p className="text-sm text-gray-500">
                                Current status
                            </p>

                            {user.is_active ? (
                                <span className="inline-flex mt-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                    Active
                                </span>
                            ) : (
                                <span className="inline-flex mt-2 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                                    Inactive
                                </span>
                            )}

                        </div>


                        <button
                            onClick={handleStatusChange}
                            disabled={updating}
                            className={`w-full mt-7 py-3 rounded-lg font-medium text-white transition ${
                                user.is_active
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-blue-600 hover:bg-blue-700"
                            } disabled:opacity-50`}
                        >
                            {updating
                                ? "Updating..."
                                : user.is_active
                                    ? "Deactivate User"
                                    : "Activate User"}
                        </button>

                    </section>


                    {/* Personal information */}
                    <section className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-7">

                        <h2 className="text-lg font-semibold text-gray-900">
                            User Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Username
                                </p>

                                <p className="mt-1 text-gray-800">
                                    {user.username}
                                </p>
                            </div>


                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Account Type
                                </p>

                                <p className="mt-1 text-gray-800 capitalize">
                                    {user.account_type || "Not specified"}
                                </p>
                            </div>


                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    First Name
                                </p>

                                <p className="mt-1 text-gray-800">
                                    {user.first_name || "Not provided"}
                                </p>
                            </div>


                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Last Name
                                </p>

                                <p className="mt-1 text-gray-800">
                                    {user.last_name || "Not provided"}
                                </p>
                            </div>


                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Email
                                </p>

                                <p className="mt-1 text-gray-800 break-words">
                                    {user.email || "Not provided"}
                                </p>
                            </div>


                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Staff Account
                                </p>

                                <p className="mt-1 text-gray-800">
                                    {user.is_staff ? "Yes" : "No"}
                                </p>
                            </div>


                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Superuser
                                </p>

                                <p className="mt-1 text-gray-800">
                                    {user.is_superuser ? "Yes" : "No"}
                                </p>
                            </div>


                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Date Joined
                                </p>

                                <p className="mt-1 text-gray-800">
                                    {formatDate(user.date_joined)}
                                </p>
                            </div>


                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Last Login
                                </p>

                                <p className="mt-1 text-gray-800">
                                    {formatDate(user.last_login)}
                                </p>
                            </div>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}


export default AdminUserDetails;