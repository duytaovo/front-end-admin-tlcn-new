import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const characterApi = {
  addCharacter(data: any) {
    return http.post("/managecreate", data);
  },
  getCharacters() {
    return http.get<SuccessResponse<any>>("/manage/characteristic");
  },
  getDetailCharacter(params: any) {
    return http.get<SuccessResponse<any[]>>(`/manage${params}`);
  },
  updateCharacter({ _id, body }: any) {
    return http.post<SuccessResponse<any>>(`/manageupdate/${_id}`, body);
  },
  deleteCharacter(idcharacter: string[]) {
    return http.post<SuccessResponse<any>>(`/managedelete/${idcharacter}`);
  },
  getCharacterWithPageNumber(pageNumber: number) {
    return http.get<SuccessResponse<any>>(`/manage${pageNumber}`);
  },
  getCharacterWithPageNumberSize(pageNumber: number, pageSize: number) {
    return http.get<SuccessResponse<any>>(`/manage${pageNumber}/${pageSize}`);
  },
};

export default characterApi;
