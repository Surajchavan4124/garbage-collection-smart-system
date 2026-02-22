import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import TicketOverviewCard from '../components/TicketOverviewCard';
import TicketsTable from '../components/TicketsTable';

const overviewStats = [
  { id: 1, title: 'Open Tickets',  count: '2',  description: 'Needs immediate attention', icon: 'open'     },
  { id: 2, title: 'In Progress',   count: '5',  description: 'Currently being handled',   icon: 'progress' },
  { id: 3, title: 'Solved',        count: '10', description: 'Successfully closed',        icon: 'solved'   },
];

const ticketData = [
  { id: 1, ticketId: 'T-01', panchayatName: 'Mapusa Panchayat',  issueType: 'Payment Issue',         createdDate: 'Oct 25, 2025, 10:42 AM', status: 'Open'        },
  { id: 2, ticketId: 'T-02', panchayatName: 'Verma Panchayat',   issueType: 'Technical Bug',         createdDate: 'Oct 25, 2025, 10:42 AM', status: 'In Progress' },
  { id: 3, ticketId: 'T-03', panchayatName: 'Navelim Panchayat', issueType: 'Subscription Inquiry',  createdDate: 'Oct 25, 2025, 10:42 AM', status: 'Resolved'    },
  { id: 4, ticketId: 'T-04', panchayatName: 'Varca Panchayat',   issueType: 'Login Issue',           createdDate: 'Oct 25, 2025, 10:42 AM', status: 'Resolved'    },
];

export default function SupportQueries() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f8fafc", fontFamily: "Inter, sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopHeader />
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px 40px" }}>

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
            {overviewStats.map(s => <TicketOverviewCard key={s.id} stat={s} />)}
          </div>

          {/* Table card */}
          <div style={{ background: "white", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Support Tickets</div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>Manage queries raised by panchayats</div>
            </div>
            <div style={{ padding: "0 24px 24px" }}>
              <TicketsTable ticketData={ticketData} selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
