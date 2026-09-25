import { useEffect, useState } from "react";
import { getServiceRequests } from "../../services/serviceRequestService";

function ServiceRequests() {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadServiceRequests();
  }, []);

  const loadServiceRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getServiceRequests();

      setServiceRequests(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load your service requests.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl px-6">

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Service Requests
          </h1>

          <p className="mt-2 text-gray-600">
            View and manage the service requests you have submitted.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-gray-600">
              Loading service requests...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-lg bg-red-50 p-6 text-red-700">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && serviceRequests.length === 0 && (
          <div className="rounded-lg bg-white p-10 text-center shadow">
            <h2 className="text-xl font-semibold text-gray-800">
              No service requests yet
            </h2>

            <p className="mt-2 text-gray-600">
              You have not submitted any service requests.
            </p>
          </div>
        )}

        {/* Service requests */}
        {!loading && !error && serviceRequests.length > 0 && (
          <div className="space-y-5">
            {serviceRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-xl bg-white p-6 shadow"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row">

                  {/* Request information */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {request.service_title}
                    </h2>

                    <p className="mt-2 text-gray-600">
                      {request.description}
                    </p>

                    <div className="mt-4 space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Location:</span>{" "}
                        {request.location}
                      </p>

                      <p>
                        <span className="font-medium">
                          Preferred date:
                        </span>{" "}
                        {request.preferred_date}
                      </p>

                      <p>
                        <span className="font-medium">Created:</span>{" "}
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-block rounded-full px-4 py-2 text-sm font-medium ${
                        request.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : request.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default ServiceRequests;