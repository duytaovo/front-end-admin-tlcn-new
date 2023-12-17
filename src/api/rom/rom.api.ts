import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const romApi = {
  addRom(data: any) {
    return http.post("/manage/product/rom/create", data);
  },
  getRoms(params: any) {
    return http.get<SuccessResponse<any>>("/manage/product/rom", { params });
  },
  getDetailRom(params: any) {
    return http.get<SuccessResponse<any[]>>(`/manage/product/rom/${params}`);
  },
  updateRom({ id, body }: any) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/rom/update/${id}`,
      body,
    );
  },
  deleteRom(idRom: string[]) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/rom/delete/${idRom}`,
    );
  },
  getRomWithPageNumber(pageNumber: number) {
    return http.get<SuccessResponse<any>>(`/manage/product/rom/${pageNumber}`);
  },
  getRomWithPageNumberSize(pageNumber: number, pageSize: number) {
    return http.get<SuccessResponse<any>>(
      `/manage/product/rom/${pageNumber}/${pageSize}`,
    );
  },
};

export default romApi;

