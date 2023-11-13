import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const smartWatchApi = {
  addSmartWatch(data: any) {
    return http.post("/manage/product/smartwatch/create", data);
  },
  getSmartWatchs(params: any) {
    return http.get<SuccessResponse<any>>("/manage/product/smartwatch", {
      params,
    });
  },

  getDetailSmartWatch(params: any) {
    return http.get<SuccessResponse<any[]>>(
      `/manage/product/smartwatch/${params}`
    );
  },
  updateSmartWatch({ id, body }: any) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/smartwatch/update/${id}`,
      body
    );
  },
  deleteSmartWatch(idSmartWatch: string[]) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/smartwatch/delete/${idSmartWatch}`
    );
  },
  uploadImageSmartWatch(body: FormData) {
    return http.post<SuccessResponse<string>>(
      "/manage/product/smartwatch/upload-image",
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
  uploadImagesSmartWatch(body: FormData) {
    return http.post<SuccessResponse<string>>(
      "/manage/product/smartwatch/upload-images",
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};

export default smartWatchApi;
