import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import { Edit2 } from "lucide-react";
import DeactivateProfileModal from "../components/DeactivateProfileModal";
import { toast } from "react-toastify";

export default function ProfileSettings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState({});
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        setProfile(data);
      } catch (err) {
        toast.error("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  /* ================= HELPERS ================= */
  const toggleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateProfile = () => {
    if (!profile.contact?.trim()) {
      toast.error("Contact number is required");
      return false;
    }
    if (!profile.email?.trim()) {
      toast.error("Email is required");
      return false;
    }
    return true;
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "—";

  /* ================= SAVE PROFILE ================= */
  const saveProfile = async () => {
    if (saving) return;
    if (!validateProfile()) return;

    const payload = {
      contact: profile.contact,
      email: profile.email,
    };

    setSaving(true);
    toast.loading("Saving profile...", { toastId: "profile-save" });

    try {
      await api.put("/auth/profile", payload);

      toast.update("profile-save", {
        render: "Profile updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      toast.update("profile-save", {
        render: err.response?.data?.message || "Profile update failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI STATES ================= */
  if (loading) return <div className="p-6">Loading profile…</div>;
  if (!profile) return <div className="p-6">Failed to load profile</div>;

  const sub = profile.subscription;
  const isActive = sub?.status?.toLowerCase() === "active";

  /* ================= RENDER ================= */
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-64 flex-1 flex flex-col overflow-hidden">
        <TopHeader />

        <div className="mt-16 flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">
            Profile Settings
          </h1>

          <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-3xl">
            {/* PANCHAYAT NAME (READ ONLY) */}
            <ReadOnlyField label="Panchayat Name" value={profile.name} />

            {/* CONTACT */}
            <EditableField
              label="Contact"
              value={profile.contact}
              editing={isEditing.contact}
              onEdit={() => toggleEdit("contact")}
            >
              <input
                value={profile.contact}
                onChange={(e) =>
                  setProfile({ ...profile, contact: e.target.value })
                }
                onBlur={() => toggleEdit("contact")}
                className="w-full border px-3 py-1 rounded"
                autoFocus
              />
            </EditableField>

            {/* EMAIL */}
            <EditableField
              label="Email"
              value={profile.email}
              editing={isEditing.email}
              onEdit={() => toggleEdit("email")}
            >
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                onBlur={() => toggleEdit("email")}
                className="w-full border px-3 py-1 rounded"
                autoFocus
              />
            </EditableField>

            {/* SUBSCRIPTION STATUS */}
            <div className="border rounded px-4 py-3 bg-gray-50">
              <label className="block text-xs font-bold mb-2">
                Subscription Status
              </label>

              {sub ? (
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-semibold">{sub.plan}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span
                      className={`font-bold ${
                        isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Valid From</span>
                    <span>
                      {formatDate(sub.startDate)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Valid Till</span>
                    <span>
                      {formatDate(sub.endDate)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-sm font-semibold text-red-600">
                  No active subscription
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                toast.warn("Profile deactivation requested");
                setIsDeactivateOpen(true);
              }}
              className="px-6 py-2 bg-red-600 text-white rounded"
            >
              Delete Profile
            </button>

            <button
              onClick={saveProfile}
              disabled={saving}
              className={`px-6 py-2 rounded text-white ${
                saving ? "bg-gray-400" : "bg-teal-600"
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      <DeactivateProfileModal
        isOpen={isDeactivateOpen}
        onClose={() => setIsDeactivateOpen(false)}
        profile={profile}
      />
    </div>
  );
}

/* ================= FIELD COMPONENTS ================= */

function EditableField({ label, value, editing, onEdit, children }) {
  return (
    <div className="flex items-center justify-between border rounded px-4 py-3">
      <div className="flex-1">
        <label className="block text-xs font-bold mb-1">{label}</label>
        {editing ? children : <span className="text-sm">{value}</span>}
      </div>
      <button onClick={onEdit}>
        <Edit2 size={18} />
      </button>
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div className="border rounded px-4 py-3 bg-gray-50">
      <label className="block text-xs font-bold mb-1">{label}</label>
      <span className="text-sm text-gray-800">{value}</span>
    </div>
  );
}
