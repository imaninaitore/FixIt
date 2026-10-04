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

import { API_URL } from "../../services/api";

function ProviderOwnProfile() {
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);

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
                business_name: data.business_name || "",
                service_category: data.service_category || "",
                description: data.description || "",
                location: data.location || "",
                years_of_experience:
                    data.years_of_experience ?? "",
                phone_number: data.phone_number || "",
                is_available: data.is_available ?? true,
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

    function getProfileImageUrl(image) {
        if (!image) {
            return null;
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        const backendUrl = API_URL.replace(/\/api\/?$/, "");

        if (image.startsWith("/")) {
            return `${backendUrl}${image}`;
        }

        return `${backendUrl}/${image}`;
    }

    function handleChange(event) {
        const {
            name,
            value,
            type,
            checked,
            files,
        } = event.target;

        setError("");
        setSuccess("");

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
            setError("");
            setSuccess("");

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
                editForm.is_available ? "true" : "false"
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

            setSuccess(
                "Your profile has been updated successfully."
            );

            await loadProfile();

            setTimeout(() => {
                setSuccess("");
            }, 4000);
        } catch (err) {
            console.error(
                "Provider profile update failed:",
                err
            );

            setError(
                err.message ||
                    "Failed to save profile changes."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div
                className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('/images/bg.png')",
                }}
            >
                <div className="rounded-2xl border border-white/20 bg-white/15 px-8 py-6 text-white shadow-xl backdrop-blur-lg">
                    <p className="text-sm">
                        Loading your profile...
                    </p>
                </div>
            </div>
        );
    }

    if (error && !provider) {
        return (
            <div
                className="min-h-[calc(100vh-4rem)] bg-cover bg-center p-4 sm:p-6"
                style={{
                    backgroundImage:
                        "url('/images/bg.png')",
                }}
            >
                <div className="mx-auto max-w-6xl rounded-2xl border border-red-300/30 bg-red-950/60 p-5 text-sm text-red-100 shadow-xl backdrop-blur-md">
                    {error}
                </div>
            </div>
        );
    }

    if (!provider) {
        return null;
    }

    const profileImage = getProfileImageUrl(
        provider.profile_image
    );

    return (
        <div
            className="relative min-h-[calc(100vh-4rem)] bg-cover bg-center bg-fixed"
            style={{
                backgroundImage:
                    "url('/images/bg.png')",
            }}
        >
            {/* Light overlay - keeps the background image clearly visible */}
            <div className="absolute inset-0 bg-slate-950/20" />

            <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
                {/* Page heading */}

                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-white drop-shadow-md">
                        My Profile
                    </h1>

                    <p className="mt-1 text-sm text-white/80">
                        Manage the information customers see
                        about your services.
                    </p>
                </div>

                {/* Success message */}

                {success && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-300/30 bg-green-500/20 px-4 py-3 text-sm text-white shadow-lg backdrop-blur-md">
                        <CheckCircle
                            size={18}
                            className="shrink-0 text-green-300"
                        />

                        <span>{success}</span>
                    </div>
                )}

                {/* Error message */}

                {error && provider && (
                    <div className="mb-5 rounded-xl border border-red-300/30 bg-red-500/20 px-4 py-3 text-sm text-white shadow-lg backdrop-blur-md">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                    {/* Main profile card */}

                    <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/15 shadow-2xl backdrop-blur-xl">
                        {/* Profile header */}

                        <div className="border-b border-white/15 p-5 sm:p-6">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                {/* Profile image */}

                                <div className="shrink-0">
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt={
                                                provider.business_name ||
                                                "Provider"
                                            }
                                            className="h-24 w-24 rounded-full border-2 border-white/40 object-cover shadow-lg"
                                            onError={(event) => {
                                                console.error(
                                                    "Failed to load profile image:",
                                                    profileImage
                                                );

                                                event.currentTarget.style.display =
                                                    "none";

                                                const fallback =
                                                    event.currentTarget
                                                        .nextElementSibling;

                                                if (fallback) {
                                                    fallback.classList.remove(
                                                        "hidden"
                                                    );
                                                }
                                            }}
                                        />
                                    ) : null}

                                    {/* Fallback avatar */}

                                    <div
                                        className={`flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-3xl font-semibold text-white shadow-lg ${
                                            profileImage
                                                ? "hidden"
                                                : ""
                                        }`}
                                    >
                                        {(
                                            provider.business_name ||
                                            "P"
                                        )
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                </div>

                                {/* Provider information */}

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="break-words text-xl font-semibold text-white">
                                            {provider.business_name ||
                                                "Your Business"}
                                        </h2>

                                        {provider.is_verified && (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-blue-300/30 bg-blue-500/20 px-2.5 py-1 text-xs font-medium text-blue-100">
                                                <ShieldCheck
                                                    size={14}
                                                />
                                                Verified
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-sm text-white/70">
                                        {provider.service_category ||
                                            "Service Provider"}
                                    </p>

                                    {provider.location && (
                                        <p className="mt-2 flex items-center gap-1.5 text-sm text-white/70">
                                            <MapPin size={15} />

                                            {provider.location}
                                        </p>
                                    )}
                                </div>

                                {/* Edit button */}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setError("");
                                        setSuccess("");
                                        setShowEditModal(true);
                                    }}
                                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition hover:bg-blue-700"
                                >
                                    <Save size={17} />
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        {/* Profile information */}

                        <div className="p-5 sm:p-6">
                            <h2 className="text-base font-semibold text-white">
                                Profile Information
                            </h2>

                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <InfoCard
                                    label="Business Name"
                                    value={
                                        provider.business_name
                                    }
                                    icon={
                                        <Briefcase size={17} />
                                    }
                                />

                                <InfoCard
                                    label="Service Category"
                                    value={
                                        provider.service_category
                                    }
                                    icon={
                                        <Briefcase size={17} />
                                    }
                                />

                                <InfoCard
                                    label="Location"
                                    value={
                                        provider.location ||
                                        "Not provided"
                                    }
                                    icon={
                                        <MapPin size={17} />
                                    }
                                />

                                <InfoCard
                                    label="Years of Experience"
                                    value={`${provider.years_of_experience ?? 0} years`}
                                    icon={
                                        <CheckCircle size={17} />
                                    }
                                />

                                <InfoCard
                                    label="Phone Number"
                                    value={
                                        provider.phone_number ||
                                        "Not provided"
                                    }
                                    icon={
                                        <Phone size={17} />
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
                                        <CheckCircle size={17} />
                                    }
                                />
                            </div>

                            {/* Description */}

                            <div className="mt-4 rounded-xl border border-white/15 bg-white/10 p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-white/60">
                                    Description
                                </p>

                                <p className="mt-2 text-sm leading-6 text-white/90">
                                    {provider.description ||
                                        "No description has been added yet."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Profile status */}

                    <div className="h-fit rounded-2xl border border-white/20 bg-white/15 p-5 shadow-2xl backdrop-blur-xl">
                        <h2 className="text-base font-semibold text-white">
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

                        <div className="mt-5 border-t border-white/15 pt-5">
                            <p className="text-xs leading-5 text-white/65">
                                Keep your profile information
                                accurate so customers can make
                                informed decisions when choosing
                                your services.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit modal */}

            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-5">
                    <div className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                        {/* Modal header */}

                        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Edit Profile
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Update your provider
                                    information.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowEditModal(false)
                                }
                                disabled={saving}
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSave}
                            className="overflow-y-auto"
                        >
                            <div className="space-y-5 p-5 sm:p-6">
                                {/* Profile image upload */}

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Profile Image
                                    </label>

                                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 p-4 transition hover:border-blue-400 hover:bg-blue-50/30">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                            <Camera size={20} />
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

                                {/* Business and category */}

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

                                {/* Description */}

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

                                {/* Location and experience */}

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

                                {/* Phone */}

                                <FormField
                                    label="Phone Number"
                                    name="phone_number"
                                    type="tel"
                                    value={
                                        editForm.phone_number
                                    }
                                    onChange={handleChange}
                                />

                                {/* Availability */}

                                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
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
                                            Available for new
                                            service requests
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Turn this off when
                                            you are not accepting
                                            new requests.
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Modal buttons */}

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white p-5 sm:flex-row sm:justify-end sm:px-6">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowEditModal(false)
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
        <div className="rounded-xl border border-white/15 bg-white/10 p-4 shadow-sm backdrop-blur-md transition hover:bg-white/15">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/60">
                <span className="text-blue-300">
                    {icon}
                </span>

                {label}
            </div>

            <p className="mt-2 break-words text-sm font-medium text-white">
                {value || "Not provided"}
            </p>
        </div>
    );
}

function StatusRow({ label, value, active }) {
    return (
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
            <span className="text-sm text-white/70">
                {label}
            </span>

            <span
                className={`text-xs font-medium ${
                    active
                        ? "text-green-300"
                        : "text-white/50"
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