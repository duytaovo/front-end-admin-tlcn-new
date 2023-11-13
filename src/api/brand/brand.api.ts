import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const brandApi = {
  addBrand(data: any) {
    return http.post("/manage/brand/create", data);
  },
  getBrands(params: any) {
    return http.get<SuccessResponse<any>>("/manage/brand", { params });
  },

  getDetailBrand(params: any) {
    return http.get<SuccessResponse<any[]>>(`/manage/brand/${params}`);
  },
  updateBrand({ _id, body }: any) {
    return http.post<SuccessResponse<any>>(`/manage/brand/update/${_id}`, body);
  },
  deleteBrand(idBrand: string[]) {
    return http.post<SuccessResponse<any>>(`/manage/brand/delete/${idBrand}`);
  },
  getBrandWithPageNumber(pageNumber: number) {
    return http.get<SuccessResponse<any>>(`/manage/brand/${pageNumber}`);
  },
  getBrandWithPageNumberSize(pageNumber: number, pageSize: number) {
    return http.get<SuccessResponse<any>>(
      `/manage/brand/${pageNumber}/${pageSize}`
    );
  },
};

export default brandApi;
