import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const mainBoardApi = {
  addMainboard(data: any) {
    return http.post("/manage/product/mainboard/create", data);
  },
  getMainboards(params: any) {
    return http.get<SuccessResponse<any>>("/manage/product/mainboard", {
      params,
    });
  },

  getDetailMainboard(params: any) {
    return http.get<SuccessResponse<any[]>>(
      `/manage/product/mainboard/${params}`,
    );
  },
  updateMainboard({ id, body }: any) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/mainboard/update/${id}`,
      body,
    );
  },
  deleteMainboard(idMainboard: string[]) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/mainboard/delete/${idMainboard}`,
    );
  },
  uploadImageMainboard(body: FormData) {
    return http.post<SuccessResponse<string>>("/file/system/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadManyImagesMainboard(body: any) {
    return http.post<SuccessResponse<string>>("/file/s3/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default mainBoardApi;

