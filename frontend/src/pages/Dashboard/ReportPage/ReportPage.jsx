export default function ReportPage() {
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Thống kê</h1>

      {/* ====== THẺ TỔNG QUAN ====== */}
      <div style={styles.cardGrid}>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Doanh thu tháng này</p>
          <h2 style={styles.cardValue}>120.000.000 ₫</h2>
        </div>

        <div style={styles.card}>
          <p style={styles.cardLabel}>Số hóa đơn tháng này</p>
          <h2 style={styles.cardValue}>842</h2>
        </div>
      </div>

      {/* ====== BIỂU ĐỒ DOANH THU 12 THÁNG ====== */}
      <div style={styles.chartCard}>
        <h3>Doanh thu theo tháng</h3>

        <div style={styles.barChart}>
          {[45, 50, 60, 55, 70, 80, 90, 85, 75, 65, 60, 95].map((v, i) => (
            <div key={i} style={styles.barWrapper}>
              <div style={{ ...styles.bar, height: `${v}%` }} />
              <span style={styles.barLabel}>T{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ====== KHÁCH & THUỐC ====== */}
      <div style={styles.bottomGrid}>
        {/* Khách mua nhiều */}
        <div style={styles.tableCard}>
          <h3>Khách mua nhiều nhất</h3>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Tên khách</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Số tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}>Nguyễn Văn A</td>
                <td
                  style={{
                    ...styles.td,
                    textAlign: "right",
                    fontWeight: 600,
                    color: "#16a34a",
                  }}
                >
                  15.000.000 ₫
                </td>
              </tr>
              <tr>
                <td style={styles.td}>Trần Thị B</td>
                <td
                  style={{
                    ...styles.td,
                    textAlign: "right",
                    fontWeight: 600,
                    color: "#16a34a",
                  }}
                >
                  12.500.000 ₫
                </td>
              </tr>
              <tr>
                <td style={styles.td}>Lê Văn C</td>
                <td
                  style={{
                    ...styles.td,
                    textAlign: "right",
                    fontWeight: 600,
                    color: "#16a34a",
                  }}
                >
                  10.200.000 ₫
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Thuốc */}
        <div style={styles.tableCard}>
          <h3>Thuốc bán lãi</h3>
          <ul style={styles.list}>
            <li style={styles.goodItem}>Paracetamol (+3.2tr)</li>
            <li style={styles.goodItem}>Amoxicillin (+2.8tr)</li>
            <li style={styles.goodItem}>Vitamin C (+2.1tr)</li>
          </ul>

          <h3 style={{ marginTop: 16 }}>Thuốc bán ế</h3>
          <ul style={styles.list}>
            <li style={styles.badItem}>Siro ho trẻ em</li>
            <li style={styles.badItem}>Thuốc dị ứng</li>
            <li style={styles.badItem}>Dung dịch sát khuẩn</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: 24,
    background: "#f8fafc",
    minHeight: "100vh",
  },
  title: {
    marginBottom: 20,
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 16,
    marginBottom: 24,
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  cardLabel: {
    color: "#64748b",
    marginBottom: 8,
  },
  cardValue: {
    margin: 0,
    color: "#0f172a",
  },

  chartCard: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  barChart: {
    display: "flex",
    alignItems: "flex-end",
    height: 180,
    gap: 12,
    marginTop: 16,
  },
  barWrapper: {
    flex: 1,
    textAlign: "center",
  },
  bar: {
    width: "100%",
    background: "#22c55e",
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 12,
    color: "#64748b",
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 16,
  },
  tableCard: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 12,
    fontSize: 14,
  },
  th: {
    textAlign: "left",
    padding: "10px 12px",
    background: "#f1f5f9",
    color: "#334155",
    fontWeight: 600,
    fontSize: 13,
  },
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid #e5e7eb",
  },

  list: {
    listStyle: "none",
    padding: 0,
    marginTop: 12,
  },
  goodItem: {
    background: "#ecfdf5",
    color: "#166534",
    padding: "8px 12px",
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 14,
  },
  badItem: {
    background: "#fef2f2",
    color: "#991b1b",
    padding: "8px 12px",
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 14,
  },
};
