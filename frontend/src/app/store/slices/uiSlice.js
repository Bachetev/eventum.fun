import { createSlice } from "@reduxjs/toolkit";
const uiSlice = createSlice({
  name: "ui",
  initialState: { toast:null, loadingOverlay:false },
  reducers: {
    showToast:(s,a)=>{s.toast=a.payload}, hideToast:(s)=>{s.toast=null},
    setLoading:(s,a)=>{s.loadingOverlay=!!a.payload}
  }
});
export const { showToast, hideToast, setLoading } = uiSlice.actions;
export default uiSlice.reducer;
