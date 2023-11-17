import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const cardGraphicApi = {
  addCardGraphic(data: any) {
    return http.post("/manage/product/graphics-card/create", data);
  },
  getCardGraphics(params: any) {
    return http.get<SuccessResponse<any>>("/manage/product/graphics-card", {
      params,
    });
  },
  getDetailCardGraphic(params: any) {
    return http.get<SuccessResponse<any[]>>(
      `/manage/product/graphics-card/${params}`
    );
  },
  updateCardGraphic({ id, body }: any) {
    return http.post<SuccessResponse<any>>(
      `/manage/product/graphics-card/update/${id}`,
      body
    );
  },
  deleteCardGraphic(idCardGraphic: string[]) {
    return http.post<SuccessResponse<any>>(
      `/manage/product/graphics-card/delete/${idCardGraphic}`
    );
  },
  getCardGraphicWithPageNumber(pageNumber: number) {
    return http.get<SuccessResponse<any>>(
      `/manage/product/graphics-card/${pageNumber}`
    );
  },
  getCardGraphicWithPageNumberSize(pageNumber: number, pageSize: number) {
    return http.get<SuccessResponse<any>>(
      `/manage/product/graphics-card/${pageNumber}/${pageSize}`
    );
  },
};

export default cardGraphicApi;
