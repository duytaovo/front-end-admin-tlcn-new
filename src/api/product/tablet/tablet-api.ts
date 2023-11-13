import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const tabletApi = {
  addTablet(data: any) {
    return http.post("/manage/product/tablet/create", data);
  },
  getTablets(params: any) {
    return http.get<SuccessResponse<any>>("/manage/product/tablet", { params });
  },
  getDetailTablet(params: any) {
    return http.get<SuccessResponse<any[]>>(`/manage/product/tablet/${params}`);
  },
  updateTablet({ _id, body }: any) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/tablet/update/${_id}`,
      body
    );
  },
  deleteTablet(idTablet: string[]) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/tablet/delete/${idTablet}`
    );
  },
  uploadImageTablet(body: FormData) {
    return http.post<SuccessResponse<string>>(
      "/manage/product/tablet/upload-image",
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
  uploadImagesTablet(body: FormData) {
    return http.post<SuccessResponse<string>>(
      "/manage/product/tablet/upload-images",
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};

export default tabletApi;
