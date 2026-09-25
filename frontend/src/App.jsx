import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProviderEnrolment from "./pages/ProviderEnrolment";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/provider/enrolment" element={<ProviderEnrolment />}/>
                <Route path="/provider/dashboard" element={<ProviderDashboard />}/>

            </Routes>
        </BrowserRouter>
    );
}

export default App;