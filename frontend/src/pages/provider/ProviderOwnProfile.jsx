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

const inputClasses =
    "w-full rounded-xl border border-[#D9B99B]/60 bg-[#FFFDF9]/90 px-3 py-2.5 text-sm text-[#172A46] outline-none transition placeholder:text-[#536070]/60 focus:border-[#C66A4A] focus:ring-2 focus:ring-[#C66A4A]/20";

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
                className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center bg-cover bg-center bg-fixed px-4"
                style={{
                    backgroundImage:
                        "url('/images/bg.png')",
                }}
            >
                <div className="absolute inset-0 bg-[#172A46]/35" />

                <div className="relative rounded-2xl border border-white/30 bg-[#FFFDF9]/20 px-8 py-6 text-white shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        <p className="text-sm font-medium">
                            Loading your profile...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !provider) {
        return (
            <div
                className="relative min-h-[calc(100vh-4rem)] bg-cover bg-center bg-fixed p-4 sm:p-6"
                style={{
                    backgroundImage:
                        "url('/images/bg.png')",
                }}
            >
                <div className="absolute inset-0 bg-[#172A46]/45" />

                <div className="relative mx-auto max-w-6xl rounded-2xl border border-red-200/40 bg-[#FFFDF9]/90 p-5 text-sm text-[#172A46] shadow-2xl backdrop-blur-xl">
                    <p className="font-semibold text-red-700">
                        Unable to load profile
                    </p>
                    <p className="mt-1">{error}</p>
                    <button
                        type="button"
                        onClick={loadProfile}
                        className="mt-4 rounded-xl bg-[#172A46] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#243B5B]"
                    >
                        Try Again
                    </button>
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
            <div className="absolute inset-0 bg-[#172A46]/35" />

            <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {/* Page heading */}

                <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F0C7AA]">
                        Provider workspace
                    </p>

                    <h1 className="mt-1 text-2xl font-semibold text-white drop-shadow-md sm:text-3xl">
                        My Profile
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-white/85">
                        Manage your business information and
                        keep your service profile up to date
                        for customers.
                    </p>
                </div>

                {/* Success message */}

                {success && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200/40 bg-emerald-900/45 px-4 py-3 text-sm text-white shadow-lg backdrop-blur-xl">
                        <CheckCircle
                            size={19}
                            className="shrink-0 text-emerald-200"
                        />
                        <span>{success}</span>
                    </div>
                )}

                {/* Error message */}

                {error && provider && (
                    <div className="mb-5 rounded-xl border border-red-200/40 bg-red-950/45 px-4 py-3 text-sm text-white shadow-lg backdrop-blur-xl">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                    {/* Main profile glass panel */}

                    <section className="overflow-hidden rounded-2xl border border-white/30 bg-[#FFFDF9]/20 shadow-2xl backdrop-blur-xl">
                        {/* Profile header */}

                        <div className="border-b border-white/20 bg-[#172A46]/25 p-5 sm:p-6">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                {/* Profile image */}

                                <div className="shrink-0">
                                    {profileImage && (
                                        <img
                                            src={profileImage}
                                            alt={
                                                provider.business_name ||
                                                "Provider"
                                            }
                                            className="h-24 w-24 rounded-full border-2 border-[#F4EDE5]/80 object-cover shadow-xl"
                                            onError={(event) => {
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
                                    )}

                                    <div
                                        className={`flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/40 bg-[#C66A4A] text-3xl font-semibold text-white shadow-xl ${
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
                                        <h2 className="break-words text-xl font-semibold text-white sm:text-2xl">
                                            {provider.business_name ||
                                                "Your Business"}
                                        </h2>

                                        {provider.is_verified && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D9B99B]/50 bg-[#172A46]/45 px-2.5 py-1 text-xs font-medium text-[#F4EDE5]">
                                                <ShieldCheck
                                                    size={14}
                                                />
                                                Verified
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1.5 text-sm font-medium text-[#F0C7AA]">
                                        {provider.service_category ||
                                            "Service Provider"}
                                    </p>

                                    {provider.location && (
                                        <p className="mt-2 flex items-center gap-1.5 text-sm text-white/85">
                                            <MapPin
                                                size={15}
                                                className="shrink-0 text-[#F0C7AA]"
                                            />
                                            <span className="break-words">
                                                {provider.location}
                                            </span>
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
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#C66A4A] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#AD583C] focus:outline-none focus:ring-2 focus:ring-[#F0C7AA] focus:ring-offset-2 focus:ring-offset-[#172A46]"
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

                            <p className="mt-1 text-sm text-white/70">
                                Your business details and service
                                availability.
                            </p>

                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                            <div className="mt-4 rounded-xl border border-white/25 bg-[#172A46]/35 p-4 shadow-sm backdrop-blur-md">
                                <p className="text-xs font-semibold uppercase tracking-wider text-[#F0C7AA]">
                                    About the business
                                </p>

                                <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-white/90">
                                    {provider.description ||
                                        "No description has been added yet."}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Profile status glass panel */}

                    <aside className="h-fit rounded-2xl border border-white/30 bg-[#FFFDF9]/20 p-5 shadow-2xl backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-[#172A46]/40 text-[#F0C7AA]">
                                <ShieldCheck size={21} />
                            </div>

                            <div>
                                <h2 className="text-base font-semibold text-white">
                                    Profile Status
                                </h2>
                                <p className="text-xs text-white/65">
                                    Your current status
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 space-y-4">
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

                        <div className="mt-5 border-t border-white/20 pt-5">
                            <p className="text-xs leading-5 text-white/75">
                                Keep your profile accurate so
                                customers can make informed
                                decisions when choosing your
                                services.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setError("");
                                setSuccess("");
                                setShowEditModal(true);
                            }}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-[#172A46]/40 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#172A46]/65"
                        >
                            <Save size={16} />
                            Update Information
                        </button>
                    </aside>
                </div>
            </div>

            {/* Edit modal */}

            {showEditModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#101C30]/75 p-3 backdrop-blur-md sm:p-5"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !saving
                        ) {
                            setShowEditModal(false);
                        }
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-profile-title"
                        className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/60 bg-[#F4EDE5]/95 shadow-2xl backdrop-blur-2xl"
                    >
                        {/* Modal header */}

                        <div className="flex shrink-0 items-center justify-between border-b border-[#D9B99B]/50 bg-[#172A46] px-5 py-4 sm:px-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#F0C7AA]">
                                    Business settings
                                </p>

                                <h2
                                    id="edit-profile-title"
                                    className="mt-1 text-lg font-semibold text-white"
                                >
                                    Edit Profile
                                </h2>

                                <p className="mt-1 text-xs text-white/70">
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
                                aria-label="Close edit profile"
                                className="rounded-xl border border-white/15 p-2 text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
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
                                    <label className="mb-2 block text-sm font-semibold text-[#172A46]">
                                        Profile Image
                                    </label>

                                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#C66A4A]/50 bg-white/60 p-4 transition hover:border-[#C66A4A] hover:bg-white/90">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C66A4A]/10 text-[#AD583C]">
                                            <Camera size={20} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-[#172A46]">
                                                Change profile image
                                            </p>

                                            <p className="mt-1 truncate text-xs text-[#536070]">
                                                {editForm.profile_image
                                                    ? editForm
                                                          .profile_image
                                                          .name
                                                    : "Choose an image from your device"}
                                            </p>
                                        </div>

                                        <span className="rounded-lg bg-[#172A46] px-3 py-2 text-xs font-medium text-white">
                                            Browse
                                        </span>

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
                                    <label
                                        htmlFor="description"
                                        className="mb-2 block text-sm font-semibold text-[#172A46]"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="description"
                                        name="description"
                                        value={
                                            editForm.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows={4}
                                        className={`${inputClasses} resize-y`}
                                        placeholder="Describe your services and experience..."
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

                                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#D9B99B]/60 bg-white/60 p-4 transition hover:bg-white/85">
                                    <input
                                        type="checkbox"
                                        name="is_available"
                                        checked={
                                            editForm.is_available
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#C66A4A] focus:ring-[#C66A4A]"
                                    />

                                    <div>
                                        <p className="text-sm font-semibold text-[#172A46]">
                                            Available for new
                                            service requests
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-[#536070]">
                                            Turn this off when
                                            you are not accepting
                                            new requests.
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Modal buttons */}

                            <div className="flex flex-col-reverse gap-3 border-t border-[#D9B99B]/50 bg-[#F4EDE5]/90 p-5 sm:flex-row sm:justify-end sm:px-6">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowEditModal(false)
                                    }
                                    disabled={saving}
                                    className="rounded-xl border border-[#D9B99B] bg-white/70 px-5 py-2.5 text-sm font-semibold text-[#172A46] transition hover:bg-white disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-[#C66A4A] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#AD583C] focus:outline-none focus:ring-2 focus:ring-[#C66A4A]/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Save size={17} />

                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}

function InfoCard({ label, value, icon }) {
    return (
        <div className="rounded-xl border border-white/25 bg-[#172A46]/35 p-4 shadow-sm backdrop-blur-md transition duration-200 hover:border-[#F0C7AA]/50 hover:bg-[#172A46]/45">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/70">
                <span className="text-[#F0C7AA]">
                    {icon}
                </span>

                {label}
            </div>

            <p className="mt-2 break-words text-sm font-medium leading-5 text-white">
                {value || "Not provided"}
            </p>
        </div>
    );
}

function StatusRow({ label, value, active }) {
    return (
        <div className="flex items-center justify-between gap-3 border-b border-white/20 pb-3 last:border-0 last:pb-0">
            <span className="text-sm text-white/75">
                {label}
            </span>

            <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                    active
                        ? "text-emerald-200"
                        : "text-[#F0C7AA]"
                }`}
            >
                <span
                    className={`h-1.5 w-1.5 rounded-full ${
                        active
                            ? "bg-emerald-300"
                            : "bg-[#D9B99B]"
                    }`}
                />

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
    const id = `provider-profile-${name}`;

    return (
        <div>
            <label
                htmlFor={id}
                className="mb-2 block text-sm font-semibold text-[#172A46]"
            >
                {label}
            </label>

            <input
                id={id}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                min={min}
                className={inputClasses}
            />
        </div>
    );
}

export default ProviderOwnProfile;
