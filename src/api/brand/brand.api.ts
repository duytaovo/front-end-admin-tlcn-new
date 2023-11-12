import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const brandApi = {
  addBrand(data: any) {
    return http.post("/brand/create", data);
  },
  getBrands(params: any) {
    return http.get<SuccessResponse<any>>("/brand", { params });
  },

  getDetailBrand(params: any) {
    return http.get<SuccessResponse<any[]>>(`/brand/${params}`);
  },
  updateBrand({ _id, body }: any) {
    return http.post<SuccessResponse<any>>(`/brand/update/${_id}`, body);
  },
  deleteBrand(idBrand: string[]) {
    return http.post<SuccessResponse<any>>(`/brand/delete/${idBrand}`);
  },
  getBrandWithPageNumber(pageNumber: number) {
    return http.get<SuccessResponse<any>>(`/brand/${pageNumber}`);
  },
  getBrandWithPageNumberSize(pageNumber: number, pageSize: number) {
    return http.get<SuccessResponse<any>>(`/brand/${pageNumber}/${pageSize}`);
  },
};

export default brandApi;
