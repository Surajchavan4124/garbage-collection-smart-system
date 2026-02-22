import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import PaymentOverviewCard from '../components/PaymentOverviewCard';
import PaymentTable from '../components/PaymentTable';

const overviewStats = [
  { id: 1, title: 'Successful Payments', count: '100', icon: 'check'   },
  { id: 2, title: 'Pending Payments',    count: '18',  icon: 'pending' },
  { id: 3, title: 'Failed Payments',     count: '5',   icon: 'failed'  },
];

const paymentData = [
  { id: 1, panchayatName: 'Mapusa Panchayat',  planName: 'Basic',    amount: '₹1,499', paymentDate: 'Oct 25, 2025, 10:42 AM', transactionId: 'pay_0120', status: 'Successful' },
  { id: 2, panchayatName: 'Verma Panchayat',   planName: 'Standard', amount: '₹2,699', paymentDate: 'Oct 25, 2025, 10:42 AM', transactionId: 'pay_0220', status: 'Successful' },
  { id: 3, panchayatName: 'Navelim Panchayat', planName: 'Standard', amount: '₹2,699', paymentDate: 'Oct 25, 2025, 10:42 AM', transactionId: 'pay_0320', status: 'Successful' },
  { id: 4, panchayatName: 'Varca Panchayat',   planName: 'Premium',  amount: '₹5,999', paymentDate: 'Oct 25, 2025, 10:42 AM', transactionId: 'pay_0420', status: 'Failed'     },
];

export default function PaymentMonitoring() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#f8fafc", fontFamily: "Inter, sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopHeader />
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px 40px" }}>

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
            {overviewStats.map(s => <PaymentOverviewCard key={s.id} stat={s} />)}
          </div>

          {/* Table card */}
          <div style={{ background: "white", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Payment Records</div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>Track all panchayat transactions</div>
            </div>
            <div style={{ padding: "0 24px 24px" }}>
              <PaymentTable paymentData={paymentData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
