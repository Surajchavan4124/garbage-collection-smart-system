import { useEffect, useState } from "react";
import api from "../api/axios";
import { X } from "lucide-react";

export default function ProfileSettingsModal({ open, onClose }) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    const fetchCompany = async () => {
      try {
        const res = await api.get("/company/profile");
        setCompany(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[500px] rounded-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4">Company Profile</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-3 text-sm">
            <ProfileRow label="Company Name" value={company?.name} />
            <ProfileRow label="Email" value={company?.email} />
            <ProfileRow label="Phone" value={company?.phone} />
            <ProfileRow label="Address" value={company?.address} />
            <ProfileRow label="Registered On" value={new Date(company?.createdAt).toLocaleDateString()} />
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-1">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
}
