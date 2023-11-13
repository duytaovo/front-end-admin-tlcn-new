import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const ramApi = {
  addRam(data: any) {
    return http.post("/manage/product/ram/create", data);
  },
  getRams(params: any) {
    return http.get<SuccessResponse<any>>("/manage/product/ram", { params });
  },
  getDetailRam(params: any) {
    return http.get<SuccessResponse<any[]>>(`/manage/product/ram/${params}`);
  },
  updateRam({ _id, body }: any) {
    return http.post<SuccessResponse<any>>(
      `/manage/product/ram/update/${_id}`,
      body
    );
  },
  deleteRam(idRam: string[]) {
    return http.post<SuccessResponse<any>>(
      `/manage/product/ram/delete/${idRam}`
    );
  },
  getRamWithPageNumber(pageNumber: number) {
    return http.get<SuccessResponse<any>>(`/manage/product/ram/${pageNumber}`);
  },
  getRamWithPageNumberSize(pageNumber: number, pageSize: number) {
    return http.get<SuccessResponse<any>>(
      `/manage/product/ram/${pageNumber}/${pageSize}`
    );
  },
};

export default ramApi;
