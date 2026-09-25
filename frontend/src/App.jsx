import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/account/Login";
import Register from "./pages/account/Register";
import ProviderEnrolment from "./pages/provider/ProviderEnrolment";
import Providers from "/pages/Providers";
import ProviderProfile from "/pages/ProviderProfile";
import ProviderDashboard from "/pages/ProviderDashboard";
import AdminDashboard from "./pages/administration/AdminDashboard";

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

            </Routes>
        </BrowserRouter>
    );
}

export default App;