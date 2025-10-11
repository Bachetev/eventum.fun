import { api } from "./client";
export async function loginOrganizer({ email, password }) { return (await api.post("/auth/login",{email,password})).data; }
export async function fetchMe() { return (await api.get("/auth/me")).data; }
export async function logoutAny(){ try{ await api.post("/guest/leave"); }catch{} return true; }
export async function guestJoin({ join_code }) { return (await api.post("/guest/join",{ join_code })).data; }
