import axios from "axios";

export async function svgcode(payload) {
  console.log(payload)
  return axios.get("/api/sms/svgcode", payload);
}

export async function Login(payload) {
  return axios.post("/api/user/login", payload);
}

export async function AddUser(payload) {
  return axios.post("/api/user/add", payload);
}

export async function Updatesvgcode(id) {
  return axios.post("/api/sms/updatesvgcode", {id});
}

export async function List(payload) {
  return axios.post("/api/user/list", payload);
}

export async function AddUserRole(payload) {
  return axios.post("/api/user/addUserRole", payload);
}
export async function UpdatePassword(payload) {
  return axios.post("/api/user/updatePassword", payload);
}

export async function UserLogout() {
  return axios.post("me_signout");
}
