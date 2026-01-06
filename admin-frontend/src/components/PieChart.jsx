import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts'

export default function AttendanceChart() {
  const data = [
    { name: 'Present', value: 92 },
    { name: 'Absent', value: 8 },
  ]

  const COLORS = ['#FBBF24', '#EF4444']

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-6">Attendance Chart</h3>
      
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend 
            layout="vertical" 
            align="right" 
            verticalAlign="middle"
            formatter={(value, entry) => (
              <span className="text-sm font-medium text-gray-700">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
