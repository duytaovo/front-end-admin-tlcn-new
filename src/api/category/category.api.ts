import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const categoryApi = {
  addCategory(data: any) {
    return http.post("/category/create", data);
  },
  getCategorys() {
    return http.get<SuccessResponse<any>>("/category");
  },
  getDetailCategory(params: any) {
    return http.get<SuccessResponse<any[]>>(`/category/${params}`, {
      params,
    });
  },
  updateCategory({ _id, body }: any) {
    return http.post<SuccessResponse<any>>(`/category/update/${_id}`, body);
  },
  deleteCategory(idcategory: string[]) {
    return http.post<SuccessResponse<any>>(`/category/delete/${idcategory}`);
  },
};

export default categoryApi;
