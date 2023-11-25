import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const mouseApi = {
  addMouse(data: any) {
    return http.post("/manage/product/mouse/create", data);
  },
  getMouses(params: any) {
    return http.get<SuccessResponse<any>>("/manage/product/mouse", {
      params,
    });
  },

  getDetailMouse(params: any) {
    return http.get<SuccessResponse<any[]>>(`/manage/product/mouse/${params}`);
  },
  updateMouse({ id, body }: any) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/mouse/update/${id}`,
      body
    );
  },
  deleteMouse(idmouse: string[]) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/mouse/delete/${idmouse}`
    );
  },
  uploadImageMouse(body: FormData) {
    return http.post<SuccessResponse<string>>("/file/system/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadManyImagesMouse(body: any) {
    return http.post<SuccessResponse<string>>("/file/s3/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default mouseApi;
