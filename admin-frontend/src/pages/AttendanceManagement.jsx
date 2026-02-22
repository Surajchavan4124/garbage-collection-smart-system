import { useEffect, useState } from "react";
import { Search, BarChart3, Download, ShieldAlert } from "lucide-react";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import api from "../api/axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AttendanceManagement() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchEmployee, setSearchEmployee] = useState("");

  // Manual override
  const [showManualModal, setShowManualModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Download menu
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  // ================= FETCH =================
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ================= FETCH =================
  const fetchTodayAttendance = async (silent = false) => {
    if (!silent) setLoading(true);
    setIsRefreshing(true);
    try {
      const res = await api.get(`/attendance/today?t=${Date.now()}`);
      setAttendance(res.data);
      setError(null);
      if (silent === "manual") toast.success("Attendance refreshed");
    } catch {
      setError("Failed to load attendance");
      if (silent === "manual") toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTodayAttendance();

    // Auto-refresh every 5 seconds for real-time updates
    const interval = setInterval(() => {
      fetchTodayAttendance(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ================= FILTER =================
  const filteredAttendance = attendance.filter(
    (a) =>
      a.labour.name.toLowerCase().includes(searchEmployee.toLowerCase()) ||
      a.labour.employeeCode
        .toLowerCase()
        .includes(searchEmployee.toLowerCase())
  );

  // ================= KPIs =================
  const total = attendance.length;
  const presentCount = attendance.filter((a) => a.present).length;
  const absentCount = total - presentCount;
  const attendancePercentage = total
    ? Math.round((presentCount / total) * 100)
    : 0;

  // ================= MANUAL =================
  const openManualModal = (row) => {
    setSelectedEmployee(row);
    setReason("");
    setShowManualModal(true);
  };

  const handleManualMark = async () => {
    if (!reason.trim()) {
      toast.warn("Reason is required");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/attendance/manual", {
        labourId: selectedEmployee.labour._id,
        date: new Date().toISOString().split("T")[0],
        present: true,
        reason,
      });

      toast.success(
        `Attendance marked for ${selectedEmployee.labour.name}`
      );
      await fetchTodayAttendance();
      setShowManualModal(false);
      setReason("");
      setSelectedEmployee(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to mark attendance");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= EXPORT =================
  const downloadExcel = () => {
    if (!filteredAttendance.length) {
      toast.warn("No data to export");
      return;
    }

    const rows = filteredAttendance.map((a) => ({
      "Employee Code": a.labour.employeeCode,
      Name: a.labour.name,
      Role: a.labour.role,
      Ward: a.labour.ward,
      Status: a.present ? "Present" : "Absent",
      Source: a.source || "-",
    }));

    const sheet = XLSX.utils.json_to_sheet(rows);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Attendance");

    XLSX.writeFile(
      book,
      `Attendance_${new Date().toISOString().split("T")[0]}.xlsx`
    );

    toast.success("Excel report downloaded");
  };

  const downloadPDF = () => {
    if (!filteredAttendance.length) {
      toast.warn("No data to export");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Daily Attendance Report", 14, 15);
    doc.setFontSize(10);
    doc.text(
      `Date: ${new Date().toISOString().split("T")[0]}`,
      14,
      22
    );

    autoTable(doc, {
      startY: 28,
      head: [["Code", "Name", "Role", "Ward", "Status", "Source"]],
      body: filteredAttendance.map((a) => [
        a.labour.employeeCode,
        a.labour.name,
        a.labour.role,
        a.labour.ward,
        a.present ? "Present" : "Absent",
        a.source || "-",
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [31, 158, 154] },
    });

    doc.save(
      `Attendance_${new Date().toISOString().split("T")[0]}.pdf`
    );
    toast.success("PDF report downloaded");
  };

  return (
    <div className="flex bg-[#e5e9f0] min-h-screen">
      <Sidebar />

      <div className="ml-64 w-full">
        <TopHeader />

        <div className="pt-20 px-8 pb-8">
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Kpi title="Total Labour" value={total} />
            <Kpi title="Present Today" value={presentCount} />
            <Kpi title="Absent Today" value={absentCount} />
            <Kpi title="Attendance %" value={`${attendancePercentage}%`} />
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="px-8 py-6 border-b flex items-center gap-4">
              <div className="flex items-center gap-2">
                <h2 className="font-bold uppercase">Daily Attendance</h2>
                {isRefreshing && (
                  <div className="w-4 h-4 border-2 border-[#1f9e9a] border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>

              <div className="ml-auto flex gap-3 relative">
                <input
                  value={searchEmployee}
                  onChange={(e) => setSearchEmployee(e.target.value)}
                  placeholder="Search employee"
                  className="px-4 py-2 border rounded"
                />

                <button
                  onClick={() => fetchTodayAttendance("manual")}
                  disabled={loading}
                  className="px-4 py-2 bg-[#1f9e9a] text-white rounded"
                >
                  Refresh
                </button>

                <button
                  onClick={() => setShowDownloadMenu((v) => !v)}
                  className="px-4 py-2 bg-[#1f9e9a] text-white rounded flex items-center gap-2"
                >
                  <Download size={16} /> Download
                </button>

                {showDownloadMenu && (
                  <div className="absolute right-0 top-12 w-40 bg-white border rounded shadow">
                    <button
                      onClick={() => {
                        downloadExcel();
                        setShowDownloadMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Excel
                    </button>
                    <button
                      onClick={() => {
                        downloadPDF();
                        setShowDownloadMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      PDF
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* TABLE BODY */}
            <table className="w-full">
              <thead className="bg-[#1f9e9a] text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Code</th>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Ward</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Source</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendance.map((a) => (
                  <tr key={a.labour._id} className="border-b">
                    <td className="px-6 py-4">{a.labour.employeeCode}</td>
                    <td className="px-6 py-4">{a.labour.name}</td>
                    <td className="px-6 py-4">{a.labour.role}</td>
                    <td className="px-6 py-4">{a.labour.ward}</td>
                    <td className="px-6 py-4">
                      {a.present ? "Present" : "Absent"}
                    </td>
                    <td className="px-6 py-4">
                      {a.source === "ADMIN" ? (
                        <ShieldAlert size={14} />
                      ) : (
                        a.source || "-"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {!a.present && (
                        <button
                          onClick={() => openManualModal(a)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                        >
                          Mark Present
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MANUAL MODAL */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[400px]">
            <h3 className="font-bold mb-2">Manual Attendance</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border p-2 mb-4"
              placeholder="Reason"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowManualModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleManualMark}
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                {submitting ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Kpi({ title, value }) {
  return (
    <div className="bg-white p-6 rounded border shadow-sm">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
