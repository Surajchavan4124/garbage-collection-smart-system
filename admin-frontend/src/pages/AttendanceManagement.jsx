import { useEffect, useState } from "react";
import { Search, BarChart3, Download, ShieldAlert, RefreshCw, Users, UserCheck, UserX, Percent } from "lucide-react";
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

  const [showManualModal, setShowManualModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    const interval = setInterval(() => fetchTodayAttendance(true), 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredAttendance = attendance.filter(
    (a) =>
      a.labour.name.toLowerCase().includes(searchEmployee.toLowerCase()) ||
      a.labour.employeeCode.toLowerCase().includes(searchEmployee.toLowerCase())
  );

  const total = attendance.length;
  const presentCount = attendance.filter((a) => a.present).length;
  const absentCount = total - presentCount;
  const attendancePercentage = total ? Math.round((presentCount / total) * 100) : 0;

  const openManualModal = (row) => {
    setSelectedEmployee(row);
    setReason("");
    setShowManualModal(true);
  };

  const handleManualMark = async () => {
    if (!reason.trim()) { toast.warn("Reason is required"); return; }
    try {
      setSubmitting(true);
      await api.post("/attendance/manual", {
        labourId: selectedEmployee.labour._id,
        date: new Date().toISOString().split("T")[0],
        present: true,
        reason,
      });
      toast.success(`Attendance marked for ${selectedEmployee.labour.name}`);
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

  const downloadExcel = () => {
    if (!filteredAttendance.length) { toast.warn("No data to export"); return; }
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
    XLSX.writeFile(book, `Attendance_${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("Excel report downloaded");
  };

  const downloadPDF = () => {
    if (!filteredAttendance.length) { toast.warn("No data to export"); return; }
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Daily Attendance Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toISOString().split("T")[0]}`, 14, 22);
    autoTable(doc, {
      startY: 28,
      head: [["Code", "Name", "Role", "Ward", "Status", "Source"]],
      body: filteredAttendance.map((a) => [
        a.labour.employeeCode, a.labour.name, a.labour.role, a.labour.ward,
        a.present ? "Present" : "Absent", a.source || "-",
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [31, 158, 154] },
    });
    doc.save(`Attendance_${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("PDF report downloaded");
  };

  return (
    <div className="flex bg-mesh min-h-screen">
      <Sidebar />
      <div className="ml-64 flex-1">
        <TopHeader />
        <div className="pt-20 px-8 pb-10 animate-fade-in-up">

          {/* Page header */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 font-medium mb-0.5">Main › Operational Management › Attendance</p>
            <h1 className="text-xl font-black text-gray-800">Attendance Management</h1>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-4 gap-5 mb-6">
            {[
              { label: 'Total Labour', value: total, icon: Users, color: 'from-[#1f9e9a] to-[#16847f]' },
              { label: 'Present Today', value: presentCount, icon: UserCheck, color: 'from-emerald-500 to-emerald-700' },
              { label: 'Absent Today', value: absentCount, icon: UserX, color: 'from-rose-500 to-rose-700' },
              { label: 'Attendance %', value: `${attendancePercentage}%`, icon: Percent, color: 'from-blue-500 to-blue-700' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm flex-shrink-0`}>
                  <Icon size={19} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                  <p className="text-2xl font-black text-gray-800">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Table card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Daily Attendance</h2>
                {isRefreshing && <RefreshCw size={14} className="text-teal-500 animate-spin" />}
              </div>

              <div className="ml-auto flex items-center gap-2">
                {/* Search */}
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-transparent focus-within:border-teal-300/50 w-52">
                  <Search size={14} className="text-gray-400" />
                  <input
                    value={searchEmployee}
                    onChange={(e) => setSearchEmployee(e.target.value)}
                    placeholder="Search employee…"
                    className="flex-1 outline-none text-xs bg-transparent text-gray-700 placeholder-gray-400"
                  />
                </div>

                {/* Refresh */}
                <button
                  onClick={() => fetchTodayAttendance("manual")}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all btn-lift"
                  style={{ background: 'linear-gradient(135deg, #1f9e9a, #16847f)' }}
                >
                  <RefreshCw size={13} />
                  Refresh
                </button>

                {/* Download */}
                <div className="relative">
                  <button
                    onClick={() => setShowDownloadMenu((v) => !v)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <Download size={13} />
                    Export
                  </button>
                  {showDownloadMenu && (
                    <div className="absolute right-0 top-10 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                      <button onClick={() => { downloadExcel(); setShowDownloadMenu(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                        Excel (.xlsx)
                      </button>
                      <button onClick={() => { downloadPDF(); setShowDownloadMenu(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                        PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #1f9e9a, #16847f)' }}>
                    {['Code', 'Name', 'Role', 'Ward', 'Status', 'Source', 'Action'].map(h => (
                      <th key={h} className="px-6 py-3.5 text-left text-white text-[10px] font-bold uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-400 text-sm">Loading attendance…</td></tr>
                  ) : filteredAttendance.length === 0 ? (
                    <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-400 text-sm">No records found</td></tr>
                  ) : (
                    filteredAttendance.map((a, idx) => (
                      <tr key={a.labour._id} className={`transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-teal-50/30`}>
                        <td className="px-6 py-3.5">
                          <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{a.labour.employeeCode}</span>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{ background: 'linear-gradient(135deg, #1f9e9a, #22c55e)' }}>
                              {a.labour.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-800">{a.labour.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-gray-500 text-xs">{a.labour.role}</td>
                        <td className="px-6 py-3.5 text-gray-500 text-xs">{a.labour.ward}</td>
                        <td className="px-6 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            a.present
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : 'bg-red-50 text-red-500 border-red-100'
                          }`}>
                            {a.present ? '● Present' : '● Absent'}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          {a.source === "ADMIN" ? (
                            <span className="flex items-center gap-1 text-orange-500 text-xs font-semibold">
                              <ShieldAlert size={12} /> Admin
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">{a.source || "—"}</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5">
                          {!a.present && (
                            <button
                              onClick={() => openManualModal(a)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
                            >
                              <UserCheck size={12} /> Mark Present
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b" style={{ background: 'linear-gradient(135deg, #1f9e9a, #16a34a)' }}>
              <h3 className="text-white font-bold text-base">Manual Attendance Override</h3>
              <p className="text-white/70 text-xs mt-0.5">Marking present for: {selectedEmployee?.labour?.name}</p>
            </div>
            <div className="p-6">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Reason *</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 resize-none outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
                rows={3}
                placeholder="Enter reason for manual override…"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowManualModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleManualMark}
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
                >
                  {submitting ? "Saving…" : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
