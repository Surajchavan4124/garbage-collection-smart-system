// src/pages/ManageSchedule.jsx
import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Loader2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/axios'
import { toast } from 'react-toastify'

const CONTENT_TYPE = 'schedule'
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const COLOR_OPTIONS = [
  { color: 'from-blue-500 to-cyan-400', bg: 'bg-blue-50 border-blue-200' },
  { color: 'from-green-500 to-emerald-400', bg: 'bg-green-50 border-green-200' },
  { color: 'from-purple-500 to-violet-400', bg: 'bg-purple-50 border-purple-200' },
  { color: 'from-amber-500 to-orange-400', bg: 'bg-amber-50 border-amber-200' },
  { color: 'from-rose-500 to-pink-400', bg: 'bg-rose-50 border-rose-200' },
]

const blankEntry = { ward: '', days: [], time: '', area: '', vehicle: '', color: COLOR_OPTIONS[0].color, bg: COLOR_OPTIONS[0].bg }

export default function ManageSchedule() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editIdx, setEditIdx] = useState(null)
  const [form, setForm] = useState(blankEntry)

  const fetchSchedule = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/content?type=${CONTENT_TYPE}`)
      setEntries(res.data?.scheduleEntries || [])
    } catch { toast.error('Failed to load schedule') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchSchedule() }, [])

  useEffect(() => {
    if (showForm) window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [showForm])

  const saveSchedule = async (updated) => {
    setSaving(true)
    try {
      await api.post('/content', { type: CONTENT_TYPE, title: 'Ward Collection Schedule', status: 'published', scheduleEntries: updated })
      toast.success('Schedule saved!')
    } catch { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  const handleAdd = () => { setForm(blankEntry); setEditIdx(null); setShowForm(true) }
  const handleEdit = (idx) => { setForm({ ...entries[idx], days: [...(entries[idx].days || [])] }); setEditIdx(idx); setShowForm(true) }

  const toggleDay = (day) => setForm(f => ({
    ...f, days: f.days.includes(day) ? f.days.filter(d => d !== day) : [...f.days, day]
  }))

  const handleSave = async () => {
    if (!form.ward || !form.time) { toast.error('Ward and Time are required'); return }
    const updated = editIdx !== null ? entries.map((e, i) => i === editIdx ? form : e) : [...entries, form]
    setEntries(updated)
    setShowForm(false)
    await saveSchedule(updated)
  }

  const handleDelete = async (idx) => {
    if (!confirm('Delete this ward entry?')) return
    const updated = entries.filter((_, i) => i !== idx)
    setEntries(updated)
    await saveSchedule(updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium mb-0.5">Public Website CMS › Ward Schedule</p>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Manage Ward Schedule</h1>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
          <Plus size={18} /> Add Ward
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <Loader2 className="animate-spin mr-3" size={28} />
            <span className="font-medium">Loading schedule...</span>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-medium">No schedule entries found. Start by adding your first ward.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((entry, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx}
                className={`group relative border rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-md ${entry.bg || 'bg-gray-50 border-gray-200'}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-gray-900 text-lg">{entry.ward}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(idx)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(idx)} className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-700 mb-1">{entry.area}</p>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    {(entry.days || []).join(', ')} • {entry.time}
                  </p>
                </div>
                {entry.vehicle && (
                  <div className="mt-4 pt-3 border-t border-black/5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span className="bg-white/50 px-2 py-0.5 rounded-full">🚛 {entry.vehicle}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[999] flex items-start justify-center p-4 pt-24 md:pt-28 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto relative z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">{editIdx !== null ? 'Edit Ward' : 'Add New Ward'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>

              <div className="space-y-5">
                {[
                  ['ward', 'Ward Name / Number *', 'e.g. Ward 04'],
                  ['time', 'Collection Time *', 'e.g. 7:00 AM - 10:00 AM'],
                  ['area', 'Localities Covered', 'e.g. Near Market Square, Residency Area'],
                  ['vehicle', 'Vehicle Assigned', 'e.g. GA-01-X-1234']
                ].map(([field, label, placeholder]) => (
                  <div key={field}>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
                    <input
                      value={form[field]}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-200 transition-all"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Collection Days</label>
                  <div className="flex flex-wrap gap-2">
                    {WEEK_DAYS.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all ${(form.days || []).includes(day)
                            ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200'
                            : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                          }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Card Theme</label>
                  <div className="flex flex-wrap gap-3">
                    {COLOR_OPTIONS.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, color: c.color, bg: c.bg }))}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.color} border-4 transition-all ${form.color === c.color
                            ? 'border-gray-900 scale-110 shadow-lg'
                            : 'border-white shadow-sm hover:scale-105 hover:shadow-md'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button onClick={() => setShowForm(false)} className="flex-1 px-6 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-colors uppercase tracking-widest">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-60">
                  {saving ? 'SAVING...' : (editIdx !== null ? 'UPDATE SCHEDULE' : 'ADD WARD ENTRY')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
