import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const laptopApi = {
  addLaptop(data: any) {
    return http.post("/manage/product/laptop/create", data);
  },
  getLaptops(params: any) {
    return http.get<SuccessResponse<any>>("/manage/product/laptop", { params });
  },

  getDetailLaptop(params: any) {
    return http.get<SuccessResponse<any[]>>(`/manage/product/laptop/${params}`);
  },
  updateLaptop({ id, body }: any) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/laptop/update/${id}`,
      body
    );
  },
  deleteLaptop(idlaptop: string[]) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/laptop/delete/${idlaptop}`
    );
  },
  uploadImageLaptop(body: FormData) {
    return http.post<SuccessResponse<string>>(
      "/manage/product/laptop/upload-image",
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
  uploadImagesLaptop(body: FormData) {
    return http.post<SuccessResponse<string>>(
      "/manage/product/laptop/upload-images",
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};

export default laptopApi;
