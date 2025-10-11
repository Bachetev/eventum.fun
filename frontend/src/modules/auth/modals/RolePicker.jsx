export default function RolePicker({ role, setRole }) {
  return (
    <div className="role-picker">
      <label><input type="radio" name="role" value="ORGANIZER" checked={role==="ORGANIZER"} onChange={()=>setRole("ORGANIZER")} /> Организатор</label>
      <label><input type="radio" name="role" value="GUEST" checked={role==="GUEST"} onChange={()=>setRole("GUEST")} /> Гость</label>
    </div>
  );
}
