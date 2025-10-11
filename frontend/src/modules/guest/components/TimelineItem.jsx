export default function TimelineItem({ item }) {
  return (
    <div className="timeline-item">
      <div className="time">{new Date(item.starts_at).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}</div>
      <div className="dot" />
      <div className="content">
        <div className="title">{item.title}</div>
        {item.description && <div className="desc">{item.description}</div>}
      </div>
    </div>
  );
}
