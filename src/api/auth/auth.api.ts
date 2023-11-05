import { SuccessResponse } from "src/types/utils.type";
import http, { http_auth } from "src/utils/http";

const authApi = {
  login(data: any) {
    return http_auth.post("/authenticate", data);
  },
  register(data: any) {
    return http.post("/register", data);
  },
  logout() {
    return http.post("/logout-user", {});
  },
  addUser(data: any) {
    return http.post("/user/create", data);
  },
  getUsers() {
    return http.get<SuccessResponse<any>>("/user");
  },
  getDetailUser(params: any) {
    return http.get<SuccessResponse<any[]>>(`/user/${params}`);
  },
  updateUser({ id, body }: any) {
    console.log(id);
    return http.put<SuccessResponse<any>>(`/user/update/${id}`, body);
  },
  deleteUser(idUser: string) {
    return http.put<SuccessResponse<any>>(`/user/delete/${idUser}`);
  },
};

export default authApi;
