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
    <div className="flex bg-mesh min-h-screen">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <TopHeader />
        <div className="pt-20 flex-1 overflow-y-auto px-8 pb-10 animate-fade-in-up">
          <div className="mb-6">
            <p className="text-xs text-gray-400 font-medium mb-0.5">Main › Settings › Profile</p>
            <h1 className="text-xl font-black text-gray-800">Profile Settings</h1>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 space-y-5 max-w-2xl">
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
                onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
                onBlur={() => toggleEdit("contact")}
                className="w-full border border-gray-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
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
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                onBlur={() => toggleEdit("email")}
                className="w-full border border-gray-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
                autoFocus
              />
            </EditableField>

            {/* SUBSCRIPTION STATUS */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Subscription Status</label>
              {sub ? (
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Plan', value: sub.plan },
                    { label: 'Status', value: sub.status, bold: true, color: isActive ? 'text-emerald-600' : 'text-red-500' },
                    { label: 'Valid From', value: formatDate(sub.startDate) },
                    { label: 'Valid Till', value: formatDate(sub.endDate) },
                  ].map(({ label, value, bold, color }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-gray-500">{label}</span>
                      <span className={`${bold ? 'font-bold' : 'font-medium'} ${color || 'text-gray-800'}`}>{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-semibold text-red-500">No active subscription</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 max-w-2xl">
            <button
              onClick={() => { toast.warn("Profile deactivation requested"); setIsDeactivateOpen(true); }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
            >
              Delete Profile
            </button>
            <button
              onClick={saveProfile}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white btn-lift"
              style={{ background: saving ? '#9ca3af' : 'linear-gradient(135deg, #1f9e9a, #16a34a)' }}
            >
              {saving ? "Saving…" : "Save Changes"}
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
