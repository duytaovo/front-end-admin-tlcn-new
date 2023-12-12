import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const computerPowerApi = {
  addComputerPower(data: any) {
    return http.post("/manage/product/computer-power/create", data);
  },
  getComputerPowers(params: any) {
    return http.get<SuccessResponse<any>>("/manage/product/computer-power", {
      params,
    });
  },

  getDetailComputerPower(params: any) {
    return http.get<SuccessResponse<any[]>>(
      `/manage/product/computer-power/${params}`,
    );
  },
  updateComputerPower({ id, body }: any) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/computer-power/update/${id}`,
      body,
    );
  },
  deleteComputerPower(idComputerPower: string[]) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/computer-power/delete/${idComputerPower}`,
    );
  },
  uploadImageComputerPower(body: FormData) {
    return http.post<SuccessResponse<string>>("/file/system/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadManyImagesComputerPower(body: any) {
    return http.post<SuccessResponse<string>>("/file/s3/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default computerPowerApi;

