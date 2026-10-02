import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/account/Login";
import Register from "./pages/account/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import Contact from "./pages/Contact";

import ProviderEnrolment from "./pages/provider/ProviderEnrolment";
import Providers from "./pages/provider/Providers";
import ProviderProfile from "./pages/provider/ProviderProfile";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderServiceRequests from "./pages/provider/ProviderServiceRequests";

import ProviderLayout from "./components/ProviderLayout";

import AdminDashboard from "./pages/administration/AdminDashboard";
import AdminUsers from "./pages/administration/AdminUsers";
import AdminUserDetails from "./pages/administration/AdminUserDetails";
import AdminEnrolments from "./pages/administration/AdminEnrolments";
import AdminEnrolmentDetails from "./pages/administration/AdminEnrolmentDetails";
import AdminServiceRequests from "./pages/administration/AdminServiceRequests";
import AdminPayments from "./pages/administration/AdminPayments";
import AdminReports from "./pages/administration/AdminReports";

import CreateServiceRequest from "./pages/requests/CreateServiceRequest";
import ServiceRequests from "./pages/requests/ServiceRequests";

import Conversations from "./pages/messaging/Conversations";
import Conversation from "./pages/messaging/Conversation";

import CreateReview from "./pages/reviews/CreateReview";
import ProviderReviews from "./pages/provider/ProviderReviews";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public pages */}

                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />
                
                <Route path="/contact" element={<Contact/>}/>

                <Route
                    path="/providers"
                    element={<Providers />}
                />


                {/* Customer pages */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["customer"]}
                        />
                    }
                >
                    <Route
                        path="/customer-dashboard"
                        element={<CustomerDashboard />}
                    />

                    <Route
                        path="/service-requests"
                        element={<ServiceRequests />}
                    />

                    <Route
                        path="/service-requests/create"
                        element={<CreateServiceRequest />}
                    />

                    <Route
                        path="/providers/:providerId/reviews/create"
                        element={<CreateReview />}
                    />
                </Route>


{/* Provider pages */}

<Route
    path="/provider-dashboard"
    element={
        <ProviderLayout>
            <ProviderDashboard />
        </ProviderLayout>
    }
/>

<Route
    path="/provider/service-requests"
    element={
        <ProviderLayout>
            <ProviderServiceRequests />
        </ProviderLayout>
    }
/>

<Route
    path="/messages"
    element={
        <ProviderLayout>
            <Conversations />
        </ProviderLayout>
    }
/>

<Route
    path="/messages/:conversationId"
    element={
        <ProviderLayout>
            <Conversation />
        </ProviderLayout>
    }
/>

<Route
    path="/providers/:providerId"
    element={
        <ProviderLayout>
            <ProviderProfile />
        </ProviderLayout>
    }
/>

<Route
    path="/providers/:providerId/reviews"
    element={
        <ProviderLayout>
            <ProviderReviews />
        </ProviderLayout>
    }
/>

<Route
    path="/provider/enrolment"
    element={
        <ProviderLayout>
            <ProviderEnrolment />
        </ProviderLayout>
    }
/>



                {/* Admin pages */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["admin"]}
                        />
                    }
                >
                    <Route
                        path="/admin/dashboard"
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="/admin/users"
                        element={<AdminUsers />}
                    />

                    <Route
                        path="/admin/users/:userId"
                        element={<AdminUserDetails />}
                    />

                    <Route
                        path="/admin/enrolments"
                        element={<AdminEnrolments />}
                    />

                    <Route
                        path="/admin/enrolments/:enrolmentId"
                        element={<AdminEnrolmentDetails />}
                    />

                    <Route
                        path="/admin/requests"
                        element={<AdminServiceRequests />}
                    />

                    <Route
                        path="/admin/payments"
                        element={<AdminPayments />}
                    />

                    <Route
                        path="/admin/reports"
                        element={<AdminReports />}
                    />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;