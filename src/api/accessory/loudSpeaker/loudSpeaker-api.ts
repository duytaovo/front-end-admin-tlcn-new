import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const loudSpeakerApi = {
  addloudSpeaker(data: any) {
    return http.post("/manage/product/loudspeaker/create", data);
  },
  getloudSpeakers(params: any) {
    return http.get<SuccessResponse<any>>("/manage/product/loudspeaker", {
      params,
    });
  },

  getDetailloudSpeaker(params: any) {
    return http.get<SuccessResponse<any[]>>(
      `/manage/product/loudspeaker/${params}`
    );
  },
  updateloudSpeaker({ id, body }: any) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/loudspeaker/update/${id}`,
      body
    );
  },
  deleteloudSpeaker(idloudSpeaker: string[]) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/loudspeaker/delete/${idloudSpeaker}`
    );
  },
  uploadImageloudSpeaker(body: FormData) {
    return http.post<SuccessResponse<string>>("/file/system/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadManyImagesloudSpeaker(body: any) {
    return http.post<SuccessResponse<string>>("/file/s3/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default loudSpeakerApi;
