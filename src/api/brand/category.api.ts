import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const brandApi = {
  addBrand(data: any) {
    return http.post("/brand/create", data);
  },
  getBrands() {
    return http.get<SuccessResponse<any>>("/brand");
  },
  getDetailBrand(params: any) {
    return http.get<SuccessResponse<any[]>>(`/brand/${params}`, {
      params,
    });
  },
  updateBrand({ _id, body }: any) {
    return http.post<SuccessResponse<any>>(`/brand/update/${_id}`, body);
  },
  deleteBrand(idBrand: string[]) {
    return http.post<SuccessResponse<any>>(`/brand/delete/${idBrand}`);
  },
};

export default brandApi;
