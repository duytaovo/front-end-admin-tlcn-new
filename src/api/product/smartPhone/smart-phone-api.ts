import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const smartPhoneApi = {
  addSmartPhone(data: any) {
    return http.post("/product/smartphone/create", data);
  },
  getSmartPhones(params: any) {
    return http.get<SuccessResponse<any>>("/product/smartphone", { params });
  },
  getSmartPhonesWithPageNumber(pageNumber: number) {
    return http.get<SuccessResponse<any>>(`/product/smartphone/${pageNumber}`);
  },
  getSmartPhonesWithPageNumberSize(pageNumber: number, pageSize: number) {
    return http.get<SuccessResponse<any>>(
      `/product/smartphone/${pageNumber}/${pageSize}`
    );
  },
  getDetailSmartPhone(params: any) {
    return http.get<SuccessResponse<any[]>>(`/product/smartphone/${params}`);
  },
  updateSmartPhone({ _id, body }: any) {
    return http.put<SuccessResponse<any>>(
      `/product/smartphone/update/${_id}`,
      body
    );
  },
  deleteSmartPhone(idSmartPhone: string[]) {
    return http.put<SuccessResponse<any>>(
      `/product/smartphone/delete/${idSmartPhone}`
    );
  },
  uploadImageSmartPhone(body: FormData) {
    return http.post<SuccessResponse<string>>(
      "/product/smartphone/upload-image",
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
  uploadImagesSmartPhone(body: FormData) {
    return http.post<SuccessResponse<string>>(
      "/product/smartphone/upload-images",
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};

export default smartPhoneApi;
