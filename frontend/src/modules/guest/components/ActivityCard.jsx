export default function ActivityCard({ activity }) {
  return (
    <div className="card">
      <div className="card-title">{activity.title}</div>
      <div className="card-sub">{activity.starts_at ? (new Date(activity.starts_at).toLocaleString() + "  " + new Date(activity.ends_at).toLocaleString()) : "Скоро"}</div>
      <div className="card-body">{activity.description || "Без описания"}</div>
    </div>
  );
}
