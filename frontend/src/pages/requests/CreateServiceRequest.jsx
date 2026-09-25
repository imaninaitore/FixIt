import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createServiceRequest } from "../services/serviceRequestService";

function CreateServiceRequest() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    service_title: "",
    description: "",
    location: "",
    preferred_date: "",
    provider_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const requestData = {
        service_title: formData.service_title,
        description: formData.description,
        location: formData.location,
        preferred_date: formData.preferred_date,
      };

      // Only send provider_id if the customer entered one.
      if (formData.provider_id.trim() !== "") {
        requestData.provider_id = Number(formData.provider_id);
      }

      await createServiceRequest(requestData);

      setSuccess("Service request submitted successfully.");

      setFormData({
        service_title: "",
        description: "",
        location: "",
        preferred_date: "",
        provider_id: "",
      });
    } catch (err) {
      console.error(err);

      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Failed to submit service request.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-3xl px-6">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Request a Service
          </h1>

          <p className="mt-2 text-gray-600">
            Tell us what service you need and where you need it.
          </p>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl bg-white p-8 shadow"
        >

          {/* Service title */}
          <div>
            <label
              htmlFor="service_title"
              className="mb-2 block font-medium text-gray-700"
            >
              Service needed
            </label>

            <input
              id="service_title"
              name="service_title"
              type="text"
              value={formData.service_title}
              onChange={handleChange}
              placeholder="For example: Electrical repair"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the service you need..."
              rows="5"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="mb-2 block font-medium text-gray-700"
            >
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="Where is the service needed?"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Preferred date */}
          <div>
            <label
              htmlFor="preferred_date"
              className="mb-2 block font-medium text-gray-700"
            >
              Preferred date
            </label>

            <input
              id="preferred_date"
              name="preferred_date"
              type="date"
              value={formData.preferred_date}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Provider ID */}
          <div>
            <label
              htmlFor="provider_id"
              className="mb-2 block font-medium text-gray-700"
            >
              Provider ID
              <span className="ml-2 text-sm font-normal text-gray-500">
                Optional
              </span>
            </label>

            <input
              id="provider_id"
              name="provider_id"
              type="number"
              value={formData.provider_id}
              onChange={handleChange}
              placeholder="Enter provider ID if you already selected one"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            <p className="mt-2 text-sm text-gray-500">
              You can leave this empty if you do not have a specific provider
              yet.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/service-requests")}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateServiceRequest;