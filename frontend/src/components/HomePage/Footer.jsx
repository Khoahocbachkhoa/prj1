export default function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.footerText}>
        © 2024 MyPharma Software Solutions. All rights reserved.
      </p>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#f9f9f9",
    borderTop: "1px solid #e0e0e0",
    padding: "20px 30px",
    textAlign: "center",
  },
  footerText: {
    fontSize: "14px",
    color: "#888",
    margin: 0,
    fontFamily: "Arial, sans-serif",
  },
};
