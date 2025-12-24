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

      {/* ====== BIỂU ĐỒ ====== */}
      <div style={styles.chartGrid}>
        {/* Doanh thu */}
        <div style={styles.chartCard}>
          <h3>Doanh thu theo tháng</h3>
          <div style={styles.barChart}>
            {[40, 60, 80, 50, 90, 70].map((v, i) => (
              <div key={i} style={styles.barWrapper}>
                <div style={{ ...styles.bar, height: `${v}%` }} />
                <span style={styles.barLabel}>T{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nhập kho */}
        <div style={styles.chartCard}>
          <h3>Tiền nhập kho theo tháng</h3>
          <div style={styles.barChart}>
            {[30, 55, 65, 45, 70, 60].map((v, i) => (
              <div key={i} style={styles.barWrapper}>
                <div
                  style={{
                    ...styles.bar,
                    height: `${v}%`,
                    background: "#ef4444",
                  }}
                />
                <span style={styles.barLabel}>T{i + 1}</span>
              </div>
            ))}
          </div>
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
                <th>Tên khách</th>
                <th>Số tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Nguyễn Văn A</td>
                <td>15.000.000 ₫</td>
              </tr>
              <tr>
                <td>Trần Thị B</td>
                <td>12.500.000 ₫</td>
              </tr>
              <tr>
                <td>Lê Văn C</td>
                <td>10.200.000 ₫</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Thuốc */}
        <div style={styles.tableCard}>
          <h3>Thuốc bán lãi</h3>
          <ul style={styles.list}>
            <li>Paracetamol (+3.2tr)</li>
            <li>Amoxicillin (+2.8tr)</li>
            <li>Vitamin C (+2.1tr)</li>
          </ul>

          <h3 style={{ marginTop: 16 }}>Thuốc bán ế</h3>
          <ul style={styles.list}>
            <li>Siro ho trẻ em</li>
            <li>Thuốc dị ứng</li>
            <li>Dung dịch sát khuẩn</li>
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

  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 16,
    marginBottom: 24,
  },
  chartCard: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
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
  },
  list: {
    paddingLeft: 16,
    color: "#334155",
  },
};
