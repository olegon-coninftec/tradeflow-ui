import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
    GET_TRADES_BY_SYMBOL,
    GET_TRADES_BY_TRADER,
    GET_TRADE_BY_ID,
} from './queries';

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
    app: {
        fontFamily: "'Segoe UI', Arial, sans-serif",
        background: "#0a0e1a",
        minHeight: "100vh",
        color: "#e2e8f0",
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
    navBtn: {
        marginLeft: "auto",
        padding: "8px 18px",
        background: "transparent",
        border: "1px solid #1a3a6b",
        borderRadius: "8px",
        color: "#90afd4",
        fontSize: "13px",
        cursor: "pointer",
        fontWeight: "600",
    },
    main: {
        padding: "32px 40px",
        maxWidth: "1200px",
        margin: "0 auto",
    },
    topBar: {
        display: "flex",
        gap: "12px",
        marginBottom: "28px",
        flexWrap: "wrap",
    },
    tabBtn: (active) => ({
        padding: "10px 22px",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: active ? "#3b82f6" : "#1f2937",
        background: active ? "#1e3a5f" : "#111827",
        color: active ? "#60a5fa" : "#6b7280",
        fontSize: "13px",
        fontWeight: "700",
        cursor: "pointer",
        letterSpacing: "0.04em",
    }),
    grid: {
        display: "grid",
        gridTemplateColumns: "320px 1fr",
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
        fontSize: "13px",
        fontWeight: "700",
        color: "#60a5fa",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        marginBottom: "20px",
        paddingBottom: "12px",
        borderBottom: "1px solid #1f2937",
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
        marginBottom: "16px",
    },
    queryBtn: {
        width: "100%",
        padding: "11px",
        background: "linear-gradient(135deg, #1a3a6b, #1e4d8c)",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: "700",
        cursor: "pointer",
        letterSpacing: "0.05em",
    },
    schemaBox: {
        marginTop: "20px",
        paddingTop: "16px",
        borderTop: "1px solid #1f2937",
    },
    schemaTitle: {
        fontSize: "11px",
        color: "#6b7280",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: "10px",
    },
    schemaPre: {
        background: "#0d1117",
        border: "1px solid #1f2937",
        borderRadius: "8px",
        padding: "14px",
        fontSize: "11px",
        color: "#7dd3fc",
        fontFamily: "monospace",
        lineHeight: "1.7",
        overflowX: "auto",
        margin: 0,
    },
    resultCard: {
        background: "#111827",
        border: "1px solid #1f2937",
        borderRadius: "12px",
        padding: "24px",
        minHeight: "400px",
    },
    resultHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        paddingBottom: "12px",
        borderBottom: "1px solid #1f2937",
    },
    resultTitle: {
        fontSize: "13px",
        fontWeight: "700",
        color: "#60a5fa",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
    },
    countBadge: {
        background: "#1e3a5f",
        color: "#60a5fa",
        padding: "3px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700",
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
        padding: "60px",
        color: "#4b5563",
        fontSize: "14px",
    },
    loadingSpinner: {
        textAlign: "center",
        padding: "60px",
        color: "#3b82f6",
        fontSize: "14px",
    },
    errorBox: {
        background: "#3b0a0a",
        border: "1px solid #ff4444",
        borderRadius: "8px",
        padding: "16px",
        color: "#ff4444",
        fontSize: "13px",
        marginTop: "16px",
    },
    fieldPill: (selected) => ({
        display: "inline-block",
        padding: "4px 10px",
        margin: "3px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "600",
        cursor: "pointer",
        background: selected ? "#1e3a5f" : "#1f2937",
        color: selected ? "#60a5fa" : "#6b7280",
        border: `1px solid ${selected ? "#3b82f6" : "#374151"}`,
        userSelect: "none",
    }),
    rawJson: {
        background: "#0d1117",
        border: "1px solid #1f2937",
        borderRadius: "8px",
        padding: "16px",
        fontSize: "11px",
        color: "#a3e635",
        fontFamily: "monospace",
        overflowX: "auto",
        maxHeight: "500px",
        overflowY: "auto",
        lineHeight: "1.6",
    },
};

// ─── All trade fields available ───────────────────────────────────────────────
const ALL_FIELDS = [
    'tradeId', 'traderId', 'symbol', 'side',
    'quantity', 'price', 'tradeValue', 'status',
    'exchange', 'timestamp'
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function SideBadge({ side }) {
    return (
        <span style={{
            color: side === "BUY" ? "#00c851" : "#ff4444",
            fontWeight: "700",
        }}>
      {side === "BUY" ? "▲ BUY" : "▼ SELL"}
    </span>
    );
}

// ─── Results Table ────────────────────────────────────────────────────────────

function ResultsTable({ trades, selectedFields, viewMode }) {
    if (!trades || trades.length === 0) {
        return <div style={styles.empty}>No results yet — run a query on the left.</div>;
    }

    if (viewMode === 'json') {
        return (
            <pre style={styles.rawJson}>
        {JSON.stringify(trades, null, 2)}
      </pre>
        );
    }

    const visibleFields = ALL_FIELDS.filter(f => selectedFields.includes(f));

    return (
        <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
                <thead>
                <tr>
                    {visibleFields.map(f => (
                        <th key={f} style={styles.th}>{f}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {trades.map((t, i) => (
                    <tr key={t.tradeId || i}
                        style={{ background: i % 2 === 0 ? "transparent" : "#0d1117" }}>
                        {visibleFields.map(f => (
                            <td key={f} style={styles.td}>
                                {f === 'status'    ? <StatusBadge status={t[f]} /> :
                                    f === 'side'      ? <SideBadge side={t[f]} /> :
                                        f === 'tradeId'   ? <span style={{ fontFamily: "monospace", color: "#60a5fa", fontSize: "11px" }}>{t[f]?.substring(0, 8)}...</span> :
                                            f === 'tradeValue'? <span style={{ color: "#fbbf24", fontWeight: "600" }}>${Number(t[f])?.toLocaleString()}</span> :
                                                f === 'price'     ? <span>${Number(t[f])?.toFixed(2)}</span> :
                                                    f === 'timestamp' ? <span style={{ color: "#6b7280", fontSize: "11px" }}>{new Date(t[f]).toLocaleString()}</span> :
                                                        <span>{t[f]}</span>}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── Single Trade Card ────────────────────────────────────────────────────────

function SingleTradeCard({ trade }) {
    if (!trade) return <div style={styles.empty}>No trade found with that ID.</div>;

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
        }}>
            {ALL_FIELDS.map(f => (
                <div key={f} style={{
                    background: "#0d1117",
                    borderRadius: "8px",
                    padding: "14px 16px",
                    border: "1px solid #1f2937",
                }}>
                    <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: "700",
                        textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                        {f}
                    </div>
                    <div style={{ fontSize: "14px", color: "#e2e8f0", fontWeight: "500" }}>
                        {f === 'status'     ? <StatusBadge status={trade[f]} /> :
                            f === 'side'       ? <SideBadge side={trade[f]} /> :
                                f === 'tradeValue' ? `$${Number(trade[f]).toLocaleString()}` :
                                    f === 'price'      ? `$${Number(trade[f]).toFixed(2)}` :
                                        f === 'timestamp'  ? new Date(trade[f]).toLocaleString() :
                                            trade[f] || '—'}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GraphQLPage() {
    const navigate = useNavigate();

    // Active query tab
    const [activeTab, setActiveTab] = useState('symbol');

    // Input values
    const [symbolInput, setSymbolInput]   = useState('AAPL');
    const [traderInput, setTraderInput]   = useState('trader-001');
    const [tradeIdInput, setTradeIdInput] = useState('');

    // Field selector
    const [selectedFields, setSelectedFields] = useState([...ALL_FIELDS]);

    // View mode toggle
    const [viewMode, setViewMode] = useState('table');

    // Apollo lazy queries — fire only when user clicks
    const [fetchBySymbol, { data: symbolData, loading: symbolLoading, error: symbolError }] =
        useLazyQuery(GET_TRADES_BY_SYMBOL, { fetchPolicy: 'network-only' });

    const [fetchByTrader, { data: traderData, loading: traderLoading, error: traderError }] =
        useLazyQuery(GET_TRADES_BY_TRADER, { fetchPolicy: 'network-only' });

    const [fetchById, { data: idData, loading: idLoading, error: idError }] =
        useLazyQuery(GET_TRADE_BY_ID, { fetchPolicy: 'network-only' });

    // Derive results based on active tab
    const isLoading = symbolLoading || traderLoading || idLoading;
    const error     = symbolError   || traderError   || idError;
    const isSingle  = activeTab === 'id';

    const results =
        activeTab === 'symbol' ? symbolData?.tradesBySymbol :
            activeTab === 'trader' ? traderData?.tradesByTrader :
                null;

    const singleTrade = idData?.tradeById;

    const resultCount = isSingle
        ? (singleTrade ? 1 : 0)
        : (results?.length ?? 0);

    // Toggle a field in the selector
    const toggleField = (field) => {
        setSelectedFields(prev =>
            prev.includes(field)
                ? prev.length > 1 ? prev.filter(f => f !== field) : prev
                : [...prev, field]
        );
    };

    // Schema preview per tab
    const schemaSnippets = {
        symbol: `query {\n  tradesBySymbol(symbol: "AAPL") {\n    tradeId\n    symbol\n    side\n    status\n    tradeValue\n  }\n}`,
        trader: `query {\n  tradesByTrader(traderId: "trader-001") {\n    tradeId\n    symbol\n    side\n    status\n  }\n}`,
        id:     `query {\n  tradeById(tradeId: "...") {\n    tradeId\n    symbol\n    status\n    price\n  }\n}`,
    };

    const handleQuery = () => {
        if (activeTab === 'symbol' && symbolInput)
            fetchBySymbol({ variables: { symbol: symbolInput.toUpperCase() } });
        else if (activeTab === 'trader' && traderInput)
            fetchByTrader({ variables: { traderId: traderInput } });
        else if (activeTab === 'id' && tradeIdInput)
            fetchById({ variables: { tradeId: tradeIdInput } });
    };

    return (
        <div style={styles.app}>

            {/* Header */}
            <div style={styles.header}>
                <div>
                    <p style={styles.headerTitle}>⚡ TradeFlow</p>
                    <p style={styles.headerSubtitle}>
                        GraphQL Explorer — Spring for GraphQL + Apollo Client
                    </p>
                </div>
                <button style={styles.navBtn} onClick={() => navigate('/')}>
                    ← Trade Dashboard
                </button>
            </div>

            <div style={styles.main}>

                {/* Query Type Tabs */}
                <div style={styles.topBar}>
                    {[
                        { key: 'symbol', label: '🔍 By Symbol' },
                        { key: 'trader', label: '👤 By Trader' },
                        { key: 'id',     label: '🔑 By Trade ID' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            style={styles.tabBtn(activeTab === tab.key)}
                            onClick={() => setActiveTab(tab.key)}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div style={styles.grid}>

                    {/* Left — Query Panel */}
                    <div style={styles.card}>
                        <div style={styles.cardTitle}>Query Parameters</div>

                        {activeTab === 'symbol' && (
                            <>
                                <label style={styles.label}>Symbol</label>
                                <input style={styles.input}
                                       value={symbolInput}
                                       onChange={e => setSymbolInput(e.target.value)}
                                       onKeyDown={e => e.key === 'Enter' && handleQuery()}
                                       placeholder="AAPL" />
                            </>
                        )}

                        {activeTab === 'trader' && (
                            <>
                                <label style={styles.label}>Trader ID</label>
                                <input style={styles.input}
                                       value={traderInput}
                                       onChange={e => setTraderInput(e.target.value)}
                                       onKeyDown={e => e.key === 'Enter' && handleQuery()}
                                       placeholder="trader-001" />
                            </>
                        )}

                        {activeTab === 'id' && (
                            <>
                                <label style={styles.label}>Trade ID</label>
                                <input style={styles.input}
                                       value={tradeIdInput}
                                       onChange={e => setTradeIdInput(e.target.value)}
                                       onKeyDown={e => e.key === 'Enter' && handleQuery()}
                                       placeholder="682892b9-..." />
                            </>
                        )}

                        {/* Field Selector — only for list queries */}
                        {!isSingle && (
                            <>
                                <label style={styles.label}>Select Fields</label>
                                <div style={{ marginBottom: "16px" }}>
                                    {ALL_FIELDS.map(f => (
                                        <span
                                            key={f}
                                            style={styles.fieldPill(selectedFields.includes(f))}
                                            onClick={() => toggleField(f)}>
                      {f}
                    </span>
                                    ))}
                                </div>
                            </>
                        )}

                        <button style={styles.queryBtn} onClick={handleQuery}
                                disabled={isLoading}>
                            {isLoading ? "Querying..." : "▶ Run GraphQL Query"}
                        </button>

                        {/* Schema Preview */}
                        <div style={styles.schemaBox}>
                            <div style={styles.schemaTitle}>Query Shape</div>
                            <pre style={styles.schemaPre}>
                {schemaSnippets[activeTab]}
              </pre>
                        </div>
                    </div>

                    {/* Right — Results Panel */}
                    <div style={styles.resultCard}>
                        <div style={styles.resultHeader}>
              <span style={styles.resultTitle}>
                {activeTab === 'symbol' ? `Results for ${symbolInput}` :
                    activeTab === 'trader' ? `Results for ${traderInput}` :
                        'Trade Detail'}
              </span>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                {!isSingle && (
                                    <>
                                        <span style={styles.countBadge}>{resultCount} trades</span>
                                        <button
                                            onClick={() => setViewMode(v => v === 'table' ? 'json' : 'table')}
                                            style={{
                                                padding: "4px 12px",
                                                background: "#1f2937",
                                                border: "1px solid #374151",
                                                borderRadius: "6px",
                                                color: "#9ca3af",
                                                fontSize: "11px",
                                                cursor: "pointer",
                                                fontWeight: "600",
                                            }}>
                                            {viewMode === 'table' ? '{ } JSON' : '⊞ Table'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {isLoading && (
                            <div style={styles.loadingSpinner}>⟳ Executing GraphQL query...</div>
                        )}

                        {error && (
                            <div style={styles.errorBox}>
                                ✗ GraphQL Error: {error.message}
                            </div>
                        )}

                        {!isLoading && !error && (
                            isSingle
                                ? <SingleTradeCard trade={singleTrade} />
                                : <ResultsTable
                                    trades={results}
                                    selectedFields={selectedFields}
                                    viewMode={viewMode} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}