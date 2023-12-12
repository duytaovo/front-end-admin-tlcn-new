import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const microPhoneApi = {
  addMicrophone(data: any) {
    return http.post("/manage/product/microphone/create", data);
  },
  getMicrophones(params: any) {
    return http.get<SuccessResponse<any>>("/manage/product/microphone", {
      params,
    });
  },

  getDetailMicrophone(params: any) {
    return http.get<SuccessResponse<any[]>>(
      `/manage/product/microphone/${params}`,
    );
  },
  updateMicrophone({ id, body }: any) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/microphone/update/${id}`,
      body,
    );
  },
  deleteMicrophone(idMicrophone: string[]) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/microphone/delete/${idMicrophone}`,
    );
  },
  uploadImageMicrophone(body: FormData) {
    return http.post<SuccessResponse<string>>("/file/system/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadManyImagesMicrophone(body: any) {
    return http.post<SuccessResponse<string>>("/file/s3/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default microPhoneApi;

