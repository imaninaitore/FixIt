import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAdminUsers } from "../../services/adminService";


function AdminUsers() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [count, setCount] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        loadUsers();
    }, []);


    async function loadUsers() {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminUsers();

            setUsers(data.users || []);
            setCount(data.count || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }


    function formatDate(date) {
        if (!date) {
            return "Not available";
        }

        return new Date(date).toLocaleDateString();
    }


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

                    <p className="mt-4 text-gray-600">
                        Loading users...
                    </p>

                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-md text-center">

                    <h1 className="text-xl font-semibold text-gray-900">
                        Unable to load users
                    </h1>

                    <p className="mt-3 text-gray-600">
                        {error}
                    </p>

                    <button
                        onClick={loadUsers}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <div className="bg-blue-700">
                <div className="max-w-7xl mx-auto px-6 py-10">

                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="text-blue-100 hover:text-white text-sm"
                    >
                        Back to Dashboard
                    </button>

                    <p className="text-blue-200 text-sm font-medium uppercase tracking-wide mt-8">
                        Administration
                    </p>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">
                                Users
                            </h1>

                            <p className="text-blue-100 mt-2">
                                View and manage FixIt user accounts.
                            </p>
                        </div>

                        <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-4">

                            <p className="text-blue-200 text-xs uppercase tracking-wide">
                                Total Users
                            </p>

                            <p className="text-2xl font-bold text-white mt-1">
                                {count}
                            </p>

                        </div>

                    </div>

                </div>
            </div>


            {/* Users */}
            <main className="max-w-7xl mx-auto px-6 py-10">

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                    <div className="px-6 py-5 border-b border-gray-200">

                        <h2 className="text-lg font-semibold text-gray-900">
                            All Users
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Select a user to view their account details.
                        </p>

                    </div>


                    {users.length === 0 ? (
                        <div className="px-6 py-12 text-center">

                            <h3 className="text-lg font-medium text-gray-900">
                                No users found
                            </h3>

                            <p className="text-gray-500 mt-2">
                                There are currently no users to display.
                            </p>

                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-gray-50 border-b border-gray-200">

                                    <tr>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            User
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Email
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Account
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Status
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Joined
                                        </th>

                                        <th className="px-6 py-4"></th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-gray-100">

                                    {users.map((user) => (

                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-50 transition"
                                        >

                                            <td className="px-6 py-5">

                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {user.username}
                                                    </p>

                                                    <p className="text-sm text-gray-500">
                                                        {user.first_name || user.last_name
                                                            ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
                                                            : "No name provided"}
                                                    </p>
                                                </div>

                                            </td>


                                            <td className="px-6 py-5 text-sm text-gray-600">
                                                {user.email || "No email"}
                                            </td>


                                            <td className="px-6 py-5">

                                                {user.is_staff ? (
                                                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                        Admin / Staff
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                        User
                                                    </span>
                                                )}

                                            </td>


                                            <td className="px-6 py-5">

                                                {user.is_active ? (
                                                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                        Inactive
                                                    </span>
                                                )}

                                            </td>


                                            <td className="px-6 py-5 text-sm text-gray-600">
                                                {formatDate(user.date_joined)}
                                            </td>


                                            <td className="px-6 py-5 text-right">

                                                <button
                                                    onClick={() =>
                                                        navigate(`/admin/users/${user.id}`)
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

            </main>

        </div>
    );
}


export default AdminUsers;