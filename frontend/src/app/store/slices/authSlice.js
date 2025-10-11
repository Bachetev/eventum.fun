import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchMe, loginOrganizer, guestJoin, logoutAny } from "../../../shared/api/auth.api";
import { ROLES } from "../../../shared/constants/roles";

export const thFetchMe = createAsyncThunk("auth/fetchMe", async () => (await fetchMe()));
export const thLoginOrganizer = createAsyncThunk("auth/loginOrganizer", async (p) => (await loginOrganizer(p)));
export const thGuestJoin = createAsyncThunk("auth/guestJoin", async (p) => (await guestJoin(p)));
export const thLogout = createAsyncThunk("auth/logout", async () => { await logoutAny(); return true; });

const slice = createSlice({
  name: "auth",
  initialState: { user: null, role: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(thFetchMe.fulfilled, (s, a) => { s.user = a.payload || null; s.role = a.payload?.role==="GUEST" ? ROLES.GUEST : (a.payload ? ROLES.ORGANIZER : null); });
    b.addCase(thLoginOrganizer.pending, (s)=>{s.status="loading"; s.error=null;})
     .addCase(thLoginOrganizer.fulfilled, (s,a)=>{s.status="succeeded"; s.user=a.payload; s.role=ROLES.ORGANIZER;})
     .addCase(thLoginOrganizer.rejected, (s,a)=>{s.status="failed"; s.error=a.error?.message||"Login failed";});
    b.addCase(thGuestJoin.pending, (s)=>{s.status="loading"; s.error=null;})
     .addCase(thGuestJoin.fulfilled, (s,a)=>{s.status="succeeded"; s.user=a.payload; s.role=ROLES.GUEST;})
     .addCase(thGuestJoin.rejected, (s,a)=>{s.status="failed"; s.error=a.error?.message||"Join failed";});
    b.addCase(thLogout.fulfilled, (s)=>{ s.user=null; s.role=null; s.status="idle"; s.error=null; });
  }
});
export default slice.reducer;
