import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const processorApi = {
  addProcessor(data: any) {
    return http.post("/manage/product/processor/create", data);
  },
  getProcessors(params: any) {
    return http.get<SuccessResponse<any>>("/manage/product/processor", {
      params,
    });
  },
  getDetailProcessor(params: any) {
    return http.get<SuccessResponse<any[]>>(
      `/manage/product/processor/${params}`
    );
  },
  updateProcessor({ _id, body }: any) {
    return http.post<SuccessResponse<any>>(
      `/manage/product/processor/update/${_id}`,
      body
    );
  },
  deleteProcessor(idProcessor: string[]) {
    return http.post<SuccessResponse<any>>(
      `/manage/product/processor/delete/${idProcessor}`
    );
  },
  getProcessorWithPageNumber(pageNumber: number) {
    return http.get<SuccessResponse<any>>(
      `/manage/product/processor/${pageNumber}`
    );
  },
  getProcessorWithPageNumberSize(pageNumber: number, pageSize: number) {
    return http.get<SuccessResponse<any>>(
      `/manage/product/processor/${pageNumber}/${pageSize}`
    );
  },
};

export default processorApi;
