
import { useEffect, useState } from "react";
import {
    Briefcase,
    Camera,
    CheckCircle,
    MapPin,
    Phone,
    Save,
    ShieldCheck,
    X,
} from "lucide-react";

import {
    getMyProvider,
    updateMyProvider,
} from "../../services/providerService";

function ProviderOwnProfile() {
    const [provider, setProvider] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [showEditModal, setShowEditModal] =
        useState(false);

    const [editForm, setEditForm] = useState({
        business_name: "",
        service_category: "",
        description: "",
        location: "",
        years_of_experience: "",
        phone_number: "",
        is_available: true,
        profile_image: null,
    });

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        try {
            setLoading(true);
            setError("");

            const data = await getMyProvider();

            setProvider(data);

            setEditForm({
                business_name:
                    data.business_name || "",
                service_category:
                    data.service_category || "",
                description:
                    data.description || "",
                location:
                    data.location || "",
                years_of_experience:
                    data.years_of_experience ?? "",
                phone_number:
                    data.phone_number || "",
                is_available:
                    data.is_available ?? true,
                profile_image: null,
            });
        } catch (err) {
            setError(
                err.message ||
                    "Failed to load your provider profile."
            );
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        const {
            name,
            value,
            type,
            checked,
            files,
        } = event.target;

        setEditForm((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : type === "file"
                    ? files?.[0] || null
                    : value,
        }));
    }

    async function handleSave(event) {
        event.preventDefault();

        try {
            setSaving(true);

            const formData = new FormData();

            formData.append(
                "business_name",
                editForm.business_name
            );

            formData.append(
                "service_category",
                editForm.service_category
            );

            formData.append(
                "description",
                editForm.description
            );

            formData.append(
                "location",
                editForm.location
            );

            formData.append(
                "years_of_experience",
                editForm.years_of_experience
            );

            formData.append(
                "phone_number",
                editForm.phone_number
            );

            formData.append(
                "is_available",
                editForm.is_available
                    ? "true"
                    : "false"
            );

            if (editForm.profile_image) {
                formData.append(
                    "profile_image",
                    editForm.profile_image
                );
            }

            const updatedProvider =
                await updateMyProvider(formData);

            setProvider(updatedProvider);

            setShowEditModal(false);

            await loadProfile();
        } catch (err) {
            console.error(
                "Provider profile update failed:",
                err
            );

            alert(
                err.message ||
                    "Failed to save profile changes."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-sm text-slate-500">
                    Loading your profile...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 sm:p-6">
                <div className="border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                    {error}
                </div>
            </div>
        );
    }

    if (!provider) {
        return null;
    }

    const profileImage =
        provider.profile_image || null;

    return (
        <div className="min-h-full bg-slate-50">
            <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-slate-900">
                        My Profile
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage the information customers see
                        about your services.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <div className="overflow-hidden border border-slate-200 bg-white">
                        <div className="border-b border-slate-200 p-5 sm:p-6">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                <div className="shrink-0">
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt={
                                                provider.business_name ||
                                                "Provider"
                                            }
                                            className="h-24 w-24 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-3xl font-semibold text-white">
                                            {(
                                                provider.business_name ||
                                                "P"
                                            )
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="break-words text-xl font-semibold text-slate-900">
                                            {provider.business_name ||
                                                "Your Business"}
                                        </h2>

                                        {provider.is_verified && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                                <ShieldCheck
                                                    size={14}
                                                />
                                                Verified
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {provider.service_category ||
                                            "Service Provider"}
                                    </p>

                                    {provider.location && (
                                        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                                            <MapPin
                                                size={15}
                                            />
                                            {provider.location}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() =>
                                        setShowEditModal(
                                            true
                                        )
                                    }
                                    className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                                >
                                    <Save size={17} />
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        <div className="p-5 sm:p-6">
                            <h2 className="text-base font-semibold text-slate-900">
                                Profile Information
                            </h2>

                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <InfoCard
                                    label="Business Name"
                                    value={
                                        provider.business_name
                                    }
                                    icon={
                                        <Briefcase
                                            size={17}
                                        />
                                    }
                                />

                                <InfoCard
                                    label="Service Category"
                                    value={
                                        provider.service_category
                                    }
                                    icon={
                                        <Briefcase
                                            size={17}
                                        />
                                    }
                                />

                                <InfoCard
                                    label="Location"
                                    value={
                                        provider.location ||
                                        "Not provided"
                                    }
                                    icon={
                                        <MapPin
                                            size={17}
                                        />
                                    }
                                />

                                <InfoCard
                                    label="Years of Experience"
                                    value={`${provider.years_of_experience ?? 0} years`}
                                    icon={
                                        <CheckCircle
                                            size={17}
                                        />
                                    }
                                />

                                <InfoCard
                                    label="Phone Number"
                                    value={
                                        provider.phone_number ||
                                        "Not provided"
                                    }
                                    icon={
                                        <Phone
                                            size={17}
                                        />
                                    }
                                />

                                <InfoCard
                                    label="Availability"
                                    value={
                                        provider.is_available
                                            ? "Available"
                                            : "Currently unavailable"
                                    }
                                    icon={
                                        <CheckCircle
                                            size={17}
                                        />
                                    }
                                />
                            </div>

                            <div className="mt-4 border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Description
                                </p>

                                <p className="mt-2 text-sm leading-6 text-slate-700">
                                    {provider.description ||
                                        "No description has been added yet."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="h-fit border border-slate-200 bg-white p-5">
                        <h2 className="text-base font-semibold text-slate-900">
                            Profile Status
                        </h2>

                        <div className="mt-4 space-y-3">
                            <StatusRow
                                label="Availability"
                                value={
                                    provider.is_available
                                        ? "Available"
                                        : "Unavailable"
                                }
                                active={
                                    provider.is_available
                                }
                            />

                            <StatusRow
                                label="Verification"
                                value={
                                    provider.is_verified
                                        ? "Verified"
                                        : "Not verified"
                                }
                                active={
                                    provider.is_verified
                                }
                            />
                        </div>

                        <div className="mt-5 border-t border-slate-200 pt-5">
                            <p className="text-xs leading-5 text-slate-500">
                                Keep your profile information
                                accurate so customers can make
                                informed decisions when choosing
                                your services.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-5">
                    <div className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
                        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Edit Profile
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Update your provider information.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowEditModal(
                                        false
                                    )
                                }
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSave}
                            className="overflow-y-auto"
                        >
                            <div className="space-y-5 p-5 sm:p-6">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Profile Image
                                    </label>

                                    <label className="flex cursor-pointer items-center gap-3 border border-dashed border-slate-300 p-4 transition hover:border-blue-400 hover:bg-blue-50/30">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                            <Camera
                                                size={20}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-700">
                                                Change profile image
                                            </p>

                                            <p className="mt-1 truncate text-xs text-slate-500">
                                                {editForm.profile_image
                                                    ? editForm
                                                          .profile_image
                                                          .name
                                                    : "Choose an image"}
                                            </p>
                                        </div>

                                        <input
                                            type="file"
                                            name="profile_image"
                                            accept="image/*"
                                            onChange={
                                                handleChange
                                            }
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <FormField
                                        label="Business Name"
                                        name="business_name"
                                        value={
                                            editForm.business_name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                    <FormField
                                        label="Service Category"
                                        name="service_category"
                                        value={
                                            editForm.service_category
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            editForm.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows={4}
                                        className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <FormField
                                        label="Location"
                                        name="location"
                                        value={
                                            editForm.location
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                    <FormField
                                        label="Years of Experience"
                                        name="years_of_experience"
                                        type="number"
                                        min="0"
                                        value={
                                            editForm.years_of_experience
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />
                                </div>

                                <FormField
                                    label="Phone Number"
                                    name="phone_number"
                                    type="tel"
                                    value={
                                        editForm.phone_number
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                <label className="flex cursor-pointer items-start gap-3 border border-slate-200 bg-slate-50 p-4">
                                    <input
                                        type="checkbox"
                                        name="is_available"
                                        checked={
                                            editForm.is_available
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />

                                    <div>
                                        <p className="text-sm font-medium text-slate-800">
                                            Available for new service
                                            requests
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Turn this off when you are
                                            not accepting new requests.
                                        </p>
                                    </div>
                                </label>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white p-5 sm:flex-row sm:justify-end sm:px-6">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowEditModal(
                                            false
                                        )
                                    }
                                    disabled={saving}
                                    className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Save size={17} />

                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoCard({ label, value, icon }) {
    return (
        <div className="border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                <span className="text-blue-600">
                    {icon}
                </span>

                {label}
            </div>

            <p className="mt-2 break-words text-sm font-medium text-slate-800">
                {value || "Not provided"}
            </p>
        </div>
    );
}

function StatusRow({ label, value, active }) {
    return (
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
            <span className="text-sm text-slate-600">
                {label}
            </span>

            <span
                className={`text-xs font-medium ${
                    active
                        ? "text-green-600"
                        : "text-slate-500"
                }`}
            >
                {value}
            </span>
        </div>
    );
}

function FormField({
    label,
    name,
    value,
    onChange,
    type = "text",
    required = false,
    min,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                min={min}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
        </div>
    );
}

export default ProviderOwnProfile;
