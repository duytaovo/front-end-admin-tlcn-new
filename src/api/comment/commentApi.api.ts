import http from "src/utils/http";

export const commentService = {
  getCommentById(id: string) {
    return http.get(`/manage/feedback/${id}`);
  },
  getComment(id: string) {
    return http.get(`/manage/feedback`);
  },

  putComment(id: any) {
    return http.put(`/manage/feedback/delete/${id}`);
  },
};
