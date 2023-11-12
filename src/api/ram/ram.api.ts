import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const ramApi = {
  addRam(data: any) {
    return http.post("/product/ram/create", data);
  },
  getRams(params: any) {
    return http.get<SuccessResponse<any>>("/product/ram", { params });
  },
  getDetailRam(params: any) {
    return http.get<SuccessResponse<any[]>>(`/product/ram/${params}`);
  },
  updateRam({ _id, body }: any) {
    return http.post<SuccessResponse<any>>(`/product/ram/update/${_id}`, body);
  },
  deleteRam(idRam: string[]) {
    return http.post<SuccessResponse<any>>(`/product/ram/delete/${idRam}`);
  },
  getRamWithPageNumber(pageNumber: number) {
    return http.get<SuccessResponse<any>>(`/product/ram/${pageNumber}`);
  },
  getRamWithPageNumberSize(pageNumber: number, pageSize: number) {
    return http.get<SuccessResponse<any>>(
      `/product/ram/${pageNumber}/${pageSize}`
    );
  },
};

export default ramApi;
