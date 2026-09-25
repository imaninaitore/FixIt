import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/account/Login";
import Register from "./pages/account/Register";
import ProviderEnrolment from "./pages/provider/ProviderEnrolment";

import Providers from "/pages/Providers";
import ProviderProfile from "/pages/ProviderProfile";
import ProviderDashboard from "/pages/ProviderDashboard";

import AdminDashboard from "./pages/administration/AdminDashboard";
import AdminUsers from "./pages/administration/AdminUsers";
import AdminUserDetails from "./pages/administration/AdminUserDetails";
import AdminEnrolments from "./pages/administration/AdminEnrolments";
import AdminEnrolmentDetails from "./pages/administration/AdminEnrolmentDetails";
import AdminServiceRequests from "./pages/administration/AdminServiceRequests";
import AdminPayments from "./pages/administration/AdminPayments";
import AdminReports from "./pages/administration/AdminReports";

import ServiceRequests from "./pages/ServiceRequests";
import CreateServiceRequest from "./pages/CreateServiceRequest";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/provider/enrolment" element={<ProviderEnrolment />}/>
                <Route path="/providers" element={<Providers />} />
                <Route  path="/provider-dashboard" element={<ProviderDashboard />}/>
                <Route  path="/providers/:providerId" element={<ProviderProfile />}/>

                <Route path="/admin/dashboard" element={<AdminDashboard />}/>
                <Route path="/admin/users" element={<AdminUsers />}/>
                <Route path="/admin/users/:userId" element={<AdminUserDetails />}/>
                <Route  path="/admin/enrolments"  element={<AdminEnrolments />}/>
                <Route path="/admin/enrolments/:enrolmentId" element={<AdminEnrolmentDetails />}/>
                <Route  path="/admin/requests" element={<AdminServiceRequests />}/>
                <Route path="/admin/payments" element={<AdminPayments />}/>
                <Route path="/admin/reports" element={<AdminReports />}/>

                <Route path="/service-requests" element={<ServiceRequests />} />
                <Route  path="/service-requests/create" element={<CreateServiceRequest />}/>

            </Routes>
        </BrowserRouter>
    );
}

export default App;