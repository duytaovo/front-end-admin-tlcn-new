import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const keyboardApi = {
  addKeyboard(data: any) {
    return http.post("/manage/product/keyboard/create", data);
  },
  getKeyboards(params: any) {
    return http.get<SuccessResponse<any>>("/manage/product/keyboard", {
      params,
    });
  },

  getDetailKeyboard(params: any) {
    return http.get<SuccessResponse<any[]>>(
      `/manage/product/keyboard/${params}`
    );
  },
  updateKeyboard({ id, body }: any) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/keyboard/update/${id}`,
      body
    );
  },
  deleteKeyboard(idkeyboard: string[]) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/keyboard/delete/${idkeyboard}`
    );
  },
  uploadImageKeyboard(body: FormData) {
    return http.post<SuccessResponse<string>>("/file/system/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadManyImagesKeyboard(body: any) {
    return http.post<SuccessResponse<string>>("/file/s3/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default keyboardApi;
