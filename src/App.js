import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/trades";

const EXCHANGES = ["NYSE", "NASDAQ", "LSE", "CME"];
const SIDES = ["BUY", "SELL"];

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  app: {
    fontFamily: "'Segoe UI', Arial, sans-serif",
    background: "#0a0e1a",
    minHeight: "100vh",
    color: "#e2e8f0",
    padding: "0",
  },
  header: {
    background: "linear-gradient(135deg, #003087 0%, #001a4d 100%)",
    padding: "20px 40px",
    borderBottom: "2px solid #1a3a6b",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  headerTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#ffffff",
    margin: 0,
  },
  headerSubtitle: {
    fontSize: "13px",
    color: "#90afd4",
    margin: 0,
  },
  badge: {
    background: "#00c851",
    color: "#000",
    fontSize: "11px",
    fontWeight: "700",
    padding: "3px 10px",
    borderRadius: "20px",
    marginLeft: "auto",
  },
  main: {
    padding: "32px 40px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "380px 1fr",
    gap: "24px",
    alignItems: "start",
  },
  card: {
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: "12px",
    padding: "24px",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#60a5fa",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "20px",
    paddingBottom: "12px",
    borderBottom: "1px solid #1f2937",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "12px",
    color: "#9ca3af",
    marginBottom: "6px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "8px",
    color: "#e2e8f0",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "8px",
    color: "#e2e8f0",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    cursor: "pointer",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #003087, #1a5fb4)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "8px",
    letterSpacing: "0.05em",
  },
  searchBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  searchInput: {
    flex: "1",
    minWidth: "160px",
    padding: "10px 14px",
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "8px",
    color: "#e2e8f0",
    fontSize: "14px",
    outline: "none",
  },
  searchBtn: {
    padding: "10px 20px",
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "8px",
    color: "#60a5fa",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  clearBtn: {
    padding: "10px 20px",
    background: "transparent",
    border: "1px solid #374151",
    borderRadius: "8px",
    color: "#6b7280",
    fontSize: "13px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  },
  th: {
    textAlign: "left",
    padding: "10px 14px",
    background: "#1f2937",
    color: "#6b7280",
    fontWeight: "700",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    borderBottom: "1px solid #374151",
  },
  td: {
    padding: "12px 14px",
    borderBottom: "1px solid #1f2937",
    color: "#e2e8f0",
    verticalAlign: "middle",
  },
  empty: {
    textAlign: "center",
    padding: "48px",
    color: "#4b5563",
    fontSize: "14px",
  },
  toast: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    padding: "14px 20px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
    zIndex: 1000,
    maxWidth: "360px",
  },
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const config = {
    EXECUTED: { bg: "#052e16", color: "#00c851", label: "✓ EXECUTED" },
    FAILED:   { bg: "#3b0a0a", color: "#ff4444", label: "✗ FAILED" },
    PENDING:  { bg: "#1c1a05", color: "#f59e0b", label: "◌ PENDING" },
  }[status] || { bg: "#1f2937", color: "#9ca3af", label: status };

  return (
      <span style={{
        background: config.bg,
        color: config.color,
        padding: "3px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "700",
        border: `1px solid ${config.color}33`,
      }}>
      {config.label}
    </span>
  );
}

// ─── Side Badge ───────────────────────────────────────────────────────────────

function SideBadge({ side }) {
  const isBuy = side === "BUY";
  return (
      <span style={{
        color: isBuy ? "#00c851" : "#ff4444",
        fontWeight: "700",
        fontSize: "13px",
      }}>
      {isBuy ? "▲ BUY" : "▼ SELL"}
    </span>
  );
}

// ─── Trade Table ──────────────────────────────────────────────────────────────

function TradeTable({ trades }) {
  if (trades.length === 0) {
    return <div style={styles.empty}>No trades found. Submit one or search above.</div>;
  }

  return (
      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
          <tr>
            {["Trade ID", "Symbol", "Side", "Qty", "Price", "Value", "Exchange", "Status", "Time"].map(h => (
                <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
          </thead>
          <tbody>
          {trades.map((t, i) => (
              <tr key={t.tradeId}
                  style={{ background: i % 2 === 0 ? "transparent" : "#0d1117" }}>
                <td style={{ ...styles.td, fontFamily: "monospace", color: "#60a5fa", fontSize: "11px" }}>
                  {t.tradeId.substring(0, 8)}...
                </td>
                <td style={{ ...styles.td, fontWeight: "700", color: "#f3f4f6" }}>
                  {t.symbol}
                </td>
                <td style={styles.td}><SideBadge side={t.side} /></td>
                <td style={styles.td}>{t.quantity?.toLocaleString()}</td>
                <td style={styles.td}>${t.price?.toFixed(2)}</td>
                <td style={{ ...styles.td, color: "#fbbf24", fontWeight: "600" }}>
                  ${t.tradeValue?.toLocaleString()}
                </td>
                <td style={{ ...styles.td, color: "#9ca3af" }}>{t.exchange}</td>
                <td style={styles.td}><StatusBadge status={t.status} /></td>
                <td style={{ ...styles.td, color: "#6b7280", fontSize: "11px" }}>
                  {new Date(t.timestamp).toLocaleTimeString()}
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  // Form state
  const [form, setForm] = useState({
    traderId: "trader-001",
    symbol: "AAPL",
    side: "BUY",
    quantity: "",
    price: "",
    exchange: "NASDAQ",
  });

  // Data state
  const [trades, setTrades]         = useState([]);
  const [searchSymbol, setSearchSymbol] = useState("");
  const [searchTrader, setSearchTrader] = useState("");
  const [toast, setToast]           = useState(null);
  const [loading, setLoading]       = useState(false);
  const [queryLabel, setQueryLabel] = useState("Recent AAPL Trades");

  // Show toast notification
  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3500);
  };

  // Load AAPL trades on startup
  const loadDefault = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/symbol/AAPL`);
      setTrades(res.data);
      setQueryLabel("Recent AAPL Trades");
    } catch {
      setTrades([]);
    }
  }, []);

  useEffect(() => { loadDefault(); }, [loadDefault]);

  // Handle form field changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit a new trade
  const handleSubmit = async () => {
    if (!form.quantity || !form.price) {
      showToast("Quantity and price are required", false);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        quantity: parseInt(form.quantity),
        price: parseFloat(form.price),
      };
      const res = await axios.post(API, payload);
      showToast(`Trade submitted — ${res.data.symbol} ${res.data.side} ${res.data.quantity} @ $${res.data.price}`);
      setForm({ ...form, quantity: "", price: "" });
      // Refresh after 2s to give consumer time to process
      setTimeout(() => searchBySymbol(form.symbol), 2000);
    } catch (err) {
      showToast(err.response?.data?.message || "Submission failed", false);
    } finally {
      setLoading(false);
    }
  };

  // Search by symbol
  const searchBySymbol = async (sym) => {
    const target = (sym || searchSymbol).toUpperCase();
    if (!target) return;
    try {
      const res = await axios.get(`${API}/symbol/${target}`);
      setTrades(res.data);
      setQueryLabel(`Trades for ${target}`);
    } catch {
      showToast("Symbol not found", false);
    }
  };

  // Search by trader
  const searchByTrader = async () => {
    if (!searchTrader) return;
    try {
      const res = await axios.get(`${API}/trader/${searchTrader}`);
      setTrades(res.data);
      setQueryLabel(`Trades by ${searchTrader}`);
    } catch {
      showToast("Trader not found", false);
    }
  };

  // Clear search
  const handleClear = () => {
    setSearchSymbol("");
    setSearchTrader("");
    loadDefault();
  };

  return (
      <div style={styles.app}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <p style={styles.headerTitle}>⚡ TradeFlow</p>
            <p style={styles.headerSubtitle}>
              Trade Processing Platform — Kafka + Cassandra + Spring Boot
            </p>
          </div>
          <span style={styles.badge}>● LIVE</span>
        </div>

        <div style={styles.main}>
          <div style={styles.grid}>

            {/* Left — Submit Trade Form */}
            <div style={styles.card}>
              <div style={styles.cardTitle}>Submit Trade</div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Trader ID</label>
                <input style={styles.input} name="traderId"
                       value={form.traderId} onChange={handleChange} />
              </div>

              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Symbol</label>
                  <input style={styles.input} name="symbol"
                         value={form.symbol} onChange={handleChange}
                         placeholder="AAPL" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Side</label>
                  <select style={styles.select} name="side"
                          value={form.side} onChange={handleChange}>
                    {SIDES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Quantity</label>
                  <input style={styles.input} name="quantity" type="number"
                         value={form.quantity} onChange={handleChange}
                         placeholder="1000" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Price ($)</label>
                  <input style={styles.input} name="price" type="number"
                         value={form.price} onChange={handleChange}
                         placeholder="189.50" />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Exchange</label>
                <select style={styles.select} name="exchange"
                        value={form.exchange} onChange={handleChange}>
                  {EXCHANGES.map(e => <option key={e}>{e}</option>)}
                </select>
              </div>

              <button style={{
                ...styles.submitBtn,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer"
              }}
                      onClick={handleSubmit}
                      disabled={loading}>
                {loading ? "Submitting..." : "⚡ Submit Trade"}
              </button>

              {/* Stats */}
              <div style={{
                marginTop: "24px",
                paddingTop: "20px",
                borderTop: "1px solid #1f2937",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px"
              }}>
                {[
                  { label: "Total Trades", value: trades.length },
                  { label: "Executed", value: trades.filter(t => t.status === "EXECUTED").length },
                  { label: "Failed", value: trades.filter(t => t.status === "FAILED").length },
                  { label: "Total Value", value: "$" + trades.reduce((s, t) => s + (t.tradeValue || 0), 0).toLocaleString() },
                ].map(stat => (
                    <div key={stat.label} style={{
                      background: "#0d1117",
                      borderRadius: "8px",
                      padding: "12px",
                      textAlign: "center"
                    }}>
                      <div style={{ fontSize: "18px", fontWeight: "700", color: "#60a5fa" }}>
                        {stat.value}
                      </div>
                      <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                        {stat.label}
                      </div>
                    </div>
                ))}
              </div>
            </div>

            {/* Right — Trade Table */}
            <div style={styles.card}>
              <div style={styles.cardTitle}>{queryLabel}</div>

              {/* Search Bar */}
              <div style={styles.searchBar}>
                <input style={styles.searchInput}
                       placeholder="Search by symbol (e.g. JPM)"
                       value={searchSymbol}
                       onChange={e => setSearchSymbol(e.target.value)}
                       onKeyDown={e => e.key === "Enter" && searchBySymbol()} />
                <button style={styles.searchBtn}
                        onClick={() => searchBySymbol()}>
                  By Symbol
                </button>
                <input style={styles.searchInput}
                       placeholder="Search by trader (e.g. trader-001)"
                       value={searchTrader}
                       onChange={e => setSearchTrader(e.target.value)}
                       onKeyDown={e => e.key === "Enter" && searchByTrader()} />
                <button style={styles.searchBtn}
                        onClick={searchByTrader}>
                  By Trader
                </button>
                <button style={styles.clearBtn} onClick={handleClear}>
                  Clear
                </button>
              </div>

              <TradeTable trades={trades} />
            </div>

          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
            <div style={{
              ...styles.toast,
              background: toast.success ? "#052e16" : "#3b0a0a",
              border: `1px solid ${toast.success ? "#00c851" : "#ff4444"}`,
              color: toast.success ? "#00c851" : "#ff4444",
            }}>
              {toast.success ? "✓ " : "✗ "}{toast.message}
            </div>
        )}
      </div>
  );
}