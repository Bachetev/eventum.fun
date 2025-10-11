import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import RoleModal from "../modals/RoleModal";

export default function Login(){
  const [open, setOpen] = useState(true);
  const { search } = useLocation();

  // Открывать модалку заново при каждом изменении query (?m=...)
  useEffect(() => { setOpen(true); }, [search]);

  return (
    <div style={{ minHeight: "60vh" }}>
      <RoleModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
