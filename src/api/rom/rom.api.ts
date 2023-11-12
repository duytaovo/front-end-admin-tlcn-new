import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const romApi = {
  addRom(data: any) {
    return http.post("/product/rom/create", data);
  },
  getRoms(params: any) {
    return http.get<SuccessResponse<any>>("/product/rom", { params });
  },
  getDetailRom(params: any) {
    return http.get<SuccessResponse<any[]>>(`/product/rom/${params}`);
  },
  updateRom({ _id, body }: any) {
    return http.post<SuccessResponse<any>>(`/product/rom/update/${_id}`, body);
  },
  deleteRom(idRom: string[]) {
    return http.post<SuccessResponse<any>>(`/product/rom/delete/${idRom}`);
  },
  getRomWithPageNumber(pageNumber: number) {
    return http.get<SuccessResponse<any>>(`/product/rom/${pageNumber}`);
  },
  getRomWithPageNumberSize(pageNumber: number, pageSize: number) {
    return http.get<SuccessResponse<any>>(
      `/product/rom/${pageNumber}/${pageSize}`
    );
  },
};

export default romApi;
