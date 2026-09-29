import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
    const accessToken = localStorage.getItem("access_token");
    const accountType = localStorage.getItem("account_type");

    const isAdmin =
        localStorage.getItem("is_staff") === "true" ||
        localStorage.getItem("is_superuser") === "true";

    // User is not logged in
    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    // Admin users
    if (isAdmin && allowedRoles.includes("admin")) {
        return <Outlet />;
    }

    // Customer users
    if (accountType === "customer" && allowedRoles.includes("customer")) {
        return <Outlet />;
    }

    // Provider users
    if (accountType === "provider" && allowedRoles.includes("provider")) {
        return <Outlet />;
    }

    // Logged-in user tried to access a page
    // belonging to another type of account.
    if (accountType === "customer") {
        return <Navigate to="/customer-dashboard" replace />;
    }

    if (accountType === "provider") {
        return <Navigate to="/provider-dashboard" replace />;
    }

    if (isAdmin) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
}

export default ProtectedRoute;