import "./styles/GlassButton.css";

export default function GlassButton({ children, variant="default", iconLeft, iconRight, ...rest }) {
  const cls = ["gbtn", variant==="primary"?"gbtn--primary":"", variant==="ghost"?"gbtn--ghost":"", rest.className||""].join(" ").trim();
  return (
    <button {...rest} className={cls}>
      {iconLeft ? <span className="gbtn__icon">{iconLeft}</span> : null}
      <span className="gbtn__text">{children}</span>
      {iconRight ? <span className="gbtn__icon">{iconRight}</span> : null}
    </button>
  );
}
