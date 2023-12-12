import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const backupChargerApi = {
  addBackupCharger(data: any) {
    return http.post("/manage/product/backup-charger/create", data);
  },
  getBackupChargers(params: any) {
    return http.get<SuccessResponse<any>>("/manage/product/backup-charger", {
      params,
    });
  },

  getDetailBackupCharger(params: any) {
    return http.get<SuccessResponse<any[]>>(
      `/manage/product/backup-charger/${params}`,
    );
  },
  updateBackupCharger({ id, body }: any) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/backup-charger/update/${id}`,
      body,
    );
  },
  deleteBackupCharger(idBackupCharger: string[]) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/backup-charger/delete/${idBackupCharger}`,
    );
  },
  uploadImageBackupCharger(body: FormData) {
    return http.post<SuccessResponse<string>>("/file/system/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadManyImagesBackupCharger(body: any) {
    return http.post<SuccessResponse<string>>("/file/s3/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default backupChargerApi;

