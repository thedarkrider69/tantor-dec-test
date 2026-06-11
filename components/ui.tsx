import Link from "next/link";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return <div className="page-header"><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
}

export function Banner({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <div className="banner"><div><strong>{title}</strong><p>{children}</p></div>{action}</div>;
}

export function EmptyState({ title, text, href, label }: { title: string; text: string; href?: string; label?: string }) {
  return <div className="empty"><div className="empty-icon">T</div><h2>{title}</h2><p>{text}</p>{href && label && <Link className="btn btn-primary" href={href}>{label}</Link>}</div>;
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return <div className="stat-card"><small>{label}</small><strong>{value}</strong>{hint && <span>{hint}</span>}</div>;
}

export function Status({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "green" | "yellow" | "red" | "blue" | "neutral" }) {
  return <span className={`status ${tone}`}>{children}</span>;
}

export function TableShell({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return <div className="table-wrap"><table><thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table></div>;
}
