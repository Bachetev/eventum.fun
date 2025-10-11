import "./styles/GlassInput.css";

export default function GlassInput({ icon, label, ...rest }) {
  return (
    <label className="ginput">
      {label ? <span className="ginput__label">{label}</span> : null}
      <div className="ginput__wrap">
        {icon ? <span className="ginput__icon">{icon}</span> : null}
        <input className="ginput__field" {...rest}/>
      </div>
    </label>
  );
}
