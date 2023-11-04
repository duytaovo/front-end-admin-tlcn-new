import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const laptopApi = {
  addLaptop(data: any) {
    return http.post("/product/laptop/create", data);
  },
  getLaptops() {
    return http.get<SuccessResponse<any>>("/product/laptop");
  },
  getLaptopsWithPageNumber(pageNumber: number) {
    return http.get<SuccessResponse<any>>(`/product/laptop/${pageNumber}`);
  },
  getLaptopsWithPageNumberSize(pageNumber: number, pageSize: number) {
    return http.get<SuccessResponse<any>>(
      `/product/laptop/${pageNumber}/${pageSize}`
    );
  },
  getDetailLaptop(params: any) {
    return http.get<SuccessResponse<any[]>>(`/product/laptop/${params}`);
  },
  updateLaptop({ _id, body }: any) {
    return http.post<SuccessResponse<any>>(
      `/product/laptop/update/${_id}`,
      body
    );
  },
  deleteLaptop(idlaptop: string[]) {
    return http.post<SuccessResponse<any>>(
      `/product/laptop/delete/${idlaptop}`
    );
  },
  uploadImageLaptop(body: FormData) {
    return http.post<SuccessResponse<string>>(
      "/product/laptop/upload-image",
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
      "/product/laptop/upload-images",
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
