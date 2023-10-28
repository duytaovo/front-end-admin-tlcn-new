import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const authApi = {
  login(data: any) {
    return http.post("/auth/login", data);
  },
  register(data: any) {
    return http.post("/auth/register", data);
  },
  logout() {
    return http.post("/auth/logout-user", {});
  },
  addUser(data: any) {
    return http.post("/user/create", data);
  },
  getUser() {
    return http.get<SuccessResponse<any>>("", {});
  },
};

export default authApi;
