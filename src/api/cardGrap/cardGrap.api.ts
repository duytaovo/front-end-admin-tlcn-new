import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const cardGraphicApi = {
  addCardGraphic(data: any) {
    return http.post("/product/graphics-card/create", data);
  },
  getCardGraphics() {
    return http.get<SuccessResponse<any>>("/product/graphics-card");
  },
  getDetailCardGraphic(params: any) {
    return http.get<SuccessResponse<any[]>>(`/product/graphics-card/${params}`);
  },
  updateCardGraphic({ _id, body }: any) {
    return http.post<SuccessResponse<any>>(
      `/product/graphics-card/update/${_id}`,
      body
    );
  },
  deleteCardGraphic(idCardGraphic: string[]) {
    return http.post<SuccessResponse<any>>(
      `/product/graphics-card/delete/${idCardGraphic}`
    );
  },
  getCardGraphicWithPageNumber(pageNumber: number) {
    return http.get<SuccessResponse<any>>(
      `/product/graphics-card/${pageNumber}`
    );
  },
  getCardGraphicWithPageNumberSize(pageNumber: number, pageSize: number) {
    return http.get<SuccessResponse<any>>(
      `/product/graphics-card/${pageNumber}/${pageSize}`
    );
  },
};

export default cardGraphicApi;
