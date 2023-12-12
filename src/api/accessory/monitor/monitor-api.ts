import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const monitorApi = {
  addMonitor(data: any) {
    return http.post("/manage/product/monitor/create", data);
  },
  getMonitors(params: any) {
    return http.get<SuccessResponse<any>>("/manage/product/monitor", {
      params,
    });
  },

  getDetailMonitor(params: any) {
    return http.get<SuccessResponse<any[]>>(
      `/manage/product/monitor/${params}`,
    );
  },
  updateMonitor({ id, body }: any) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/monitor/update/${id}`,
      body,
    );
  },
  deleteMonitor(idMonitor: string[]) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/monitor/delete/${idMonitor}`,
    );
  },
  uploadImageMonitor(body: FormData) {
    return http.post<SuccessResponse<string>>("/file/system/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadManyImagesMonitor(body: any) {
    return http.post<SuccessResponse<string>>("/file/s3/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default monitorApi;

