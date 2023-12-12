import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const adapterApi = {
  addAdapter(data: any) {
    return http.post("/manage/product/adapter/create", data);
  },
  getAdapters(params: any) {
    return http.get<SuccessResponse<any>>("/manage/product/adapter", {
      params,
    });
  },

  getDetailAdapter(params: any) {
    return http.get<SuccessResponse<any[]>>(
      `/manage/product/adapter/${params}`,
    );
  },
  updateAdapter({ id, body }: any) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/adapter/update/${id}`,
      body,
    );
  },
  deleteAdapter(idAdapter: string[]) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/adapter/delete/${idAdapter}`,
    );
  },
  uploadImageAdapter(body: FormData) {
    return http.post<SuccessResponse<string>>("/file/system/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadManyImagesAdapter(body: any) {
    return http.post<SuccessResponse<string>>("/file/s3/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default adapterApi;

