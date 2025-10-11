export default function VoteCard({ vote, onAnswer, disabled }) {
  return (
    <div className="card">
      <div className="card-title">{vote.question}</div>
      <div className="options">
        {vote.options?.map((opt, idx) => (
          <button key={idx} className="btn btn-option" disabled={disabled} onClick={()=>onAnswer(idx)}>{opt}</button>
        ))}
      </div>
      <div className="card-sub">Статус: {vote.status}</div>
    </div>
  );
}
