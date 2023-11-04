import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const characterApi = {
  addCharacter(data: any) {
    return http.post("/characteristic/create", data);
  },
  getCharacters() {
    return http.get<SuccessResponse<any>>("/characteristic");
  },
  getDetailCharacter(params: any) {
    return http.get<SuccessResponse<any[]>>(`/characteristic/${params}`);
  },
  updateCharacter({ _id, body }: any) {
    return http.post<SuccessResponse<any>>(
      `/characteristic/update/${_id}`,
      body
    );
  },
  deleteCharacter(idcharacter: string[]) {
    return http.post<SuccessResponse<any>>(
      `/characteristic/delete/${idcharacter}`
    );
  },
  getCharacterWithPageNumber(pageNumber: number) {
    return http.get<SuccessResponse<any>>(`/characteristic/${pageNumber}`);
  },
  getCharacterWithPageNumberSize(pageNumber: number, pageSize: number) {
    return http.get<SuccessResponse<any>>(
      `/characteristic/${pageNumber}/${pageSize}`
    );
  },
};

export default characterApi;
