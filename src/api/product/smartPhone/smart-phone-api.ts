import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const smartPhoneApi = {
  addSmartPhone(data: any) {
    return http.post("/manage/product/smartphone/create", data);
  },
  getSmartPhones({ body, params }: any) {
    return http.post<SuccessResponse<any>>("/manage/product/smartphone", body, {
      params,
    });
  },

  getDetailSmartPhone(params: any) {
    return http.get<SuccessResponse<any[]>>(
      `/manage/product/smartphone/${params}`
    );
  },
  updateSmartPhone({ id, body }: any) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/smartphone/update/${id}`,
      body
    );
  },
  deleteSmartPhone(idSmartPhone: string[]) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/smartphone/delete/${idSmartPhone}`
    );
  },
  uploadImageSmartPhone(body: FormData) {
    return http.post<SuccessResponse<string>>("/file/system/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadManyImagesSmartPhone(body: any) {
    return http.post<SuccessResponse<string>>("/file/s3/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getProductByProductSlugId({ slug, id }: { slug: string; id: string }) {
    return http.get(`/product/${slug}/${id}`);
  },
};

export default smartPhoneApi;
