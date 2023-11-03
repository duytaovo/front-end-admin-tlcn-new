import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const characterApi = {
  addCharacter(data: any) {
    return http.post("/character/create", data);
  },
  getCharacters() {
    return http.get<SuccessResponse<any>>("/character");
  },
  getDetailcharacter(params: any) {
    return http.get<SuccessResponse<any[]>>(`/character/${params}`);
  },
  updateCharacter({ _id, body }: any) {
    return http.post<SuccessResponse<any>>(`/character/update/${_id}`, body);
  },
  deleteCharacter(idcharacter: string[]) {
    return http.post<SuccessResponse<any>>(`/character/delete/${idcharacter}`);
  },
  getCharacterWithPageNumber(pageNumber: number) {
    return http.get<SuccessResponse<any>>(`/character/${pageNumber}`);
  },
  getCharacterWithPageNumberSize(pageNumber: number, pageSize: number) {
    return http.get<SuccessResponse<any>>(
      `/character/${pageNumber}/${pageSize}`
    );
  },
};

export default characterApi;
