import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import "./styles/Modal.css";

const EXIT_MS = 240;

export default function Modal({ open, onClose, children, width = 640 }) {
  const [mounted, setMounted] = useState(open);
  const [exiting, setExiting] = useState(false);
  const ref = useRef(null);

  // Монтируем при open=true
  useEffect(() => {
    if (open) {
      setMounted(true);
      setExiting(false);
    } else if (mounted) {
      // плавное закрытие
      setExiting(true);
      const t = setTimeout(() => { setMounted(false); setExiting(false); }, EXIT_MS);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Esc
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mounted]);

  if (!mounted) return null;

  const handleClose = () => {
    // даём родителю сигнал  он поставит open=false, мы анимируем и размонтируемся
    onClose?.();
  };

  const onBackdrop = (e) => { if (e.target === e.currentTarget) handleClose(); };

  return (
    <div className={`mdl__backdrop ${exiting ? "mdl--exiting" : "mdl--enter"}`} onMouseDown={onBackdrop}>
      <div
        ref={ref}
        className={`mdl__inner ${exiting ? "mdl__inner--exiting" : "mdl__inner--enter"}`}
        style={{ width: `min(96vw, ${width}px)` }}
        role="dialog"
        aria-modal="true"
      >
        <button className="mdl__close" onClick={handleClose} aria-label="Закрыть">
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}
