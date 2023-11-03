import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const processorApi = {
  addProcessor(data: any) {
    return http.post("/product/processor/create", data);
  },
  getProcessors() {
    return http.get<SuccessResponse<any>>("/product/processor");
  },
  getDetailProcessor(params: any) {
    return http.get<SuccessResponse<any[]>>(`/product/processor/${params}`);
  },
  updateProcessor({ _id, body }: any) {
    return http.post<SuccessResponse<any>>(
      `/product/processor/update/${_id}`,
      body
    );
  },
  deleteProcessor(idProcessor: string[]) {
    return http.post<SuccessResponse<any>>(
      `/product/processor/delete/${idProcessor}`
    );
  },
  getProcessorWithPageNumber(pageNumber: number) {
    return http.get<SuccessResponse<any>>(`/product/processor/${pageNumber}`);
  },
  getProcessorWithPageNumberSize(pageNumber: number, pageSize: number) {
    return http.get<SuccessResponse<any>>(
      `/product/processor/${pageNumber}/${pageSize}`
    );
  },
};

export default processorApi;
