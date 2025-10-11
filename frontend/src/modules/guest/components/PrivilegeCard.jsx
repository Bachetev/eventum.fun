export default function PrivilegeCard({ item }) {
  return (
    <div className="card">
      <div className="card-title">Заявка: {item.type}</div>
      <div className="card-body">{item.message || "—"}</div>
      <div className="card-sub">Статус: {item.status}  {new Date(item.created_at).toLocaleString()}</div>
    </div>
  );
}
