import { useEffect, useState } from "react";
import { getProviders } from "./services/api";

function App() {
    const [providers, setProviders] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        getProviders()
            .then((data) => {
                setProviders(data);
            })
            .catch((error) => {
                setError(error.message);
            });
    }, []);

    return (
        <div>
            <h1>FixIt Providers</h1>

            {error && <p>{error}</p>}

            {providers.map((provider) => (
                <div key={provider.id}>
                    <h2>{provider.business_name}</h2>
                    <p>{provider.service_category}</p>
                    <p>{provider.location}</p>
                </div>
            ))}
        </div>
    );
}

export default App;