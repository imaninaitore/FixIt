import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProviderEnrolment from "./pages/ProviderEnrolment";
import Providers from "./pages/Providers";
import ProviderProfile from "./pages/ProviderProfile";
function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/provider/enrolment" element={<ProviderEnrolment />}/>
                <Route path="/providers" element={<Providers />} />
                <Route  path="/providers/:providerId" element={<ProviderProfile />}/>

            </Routes>
        </BrowserRouter>
    );
}

export default App;