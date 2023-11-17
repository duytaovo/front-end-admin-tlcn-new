import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { commentService } from "src/api/comment/commentApi.api";
import { payloadCreator } from "src/utils/utils";

export const getCommentByProductId = createAsyncThunk(
  "comments/getCommentByProductId",
  payloadCreator(commentService.getCommentById)
);

export const getCommentById = createAsyncThunk(
  "comments/getCommentById",
  payloadCreator(commentService.getCommentById)
);

export const putComments = createAsyncThunk(
  "comments/putComments",
  payloadCreator(commentService.putComment)
);

const CommentDetail = {
  code: 200,
  message: "Requested completed!",
  data: {
    id: 12,
    userId: 2,
    username: "ADMIN",
    userAvatar: "test",
    star: 3,
    comment: "abc",
    feedbackFilesUrl: [
      "https://techstore2023.s3.ap-southeast-1.amazonaws.com/1700214917749e6e163c1-5037-4cbb-a30d-2156e2a0df46-aaa.jpeg",
    ],
  },
};

const initialState = {
  commentByProduct: {
    code: 200,
    data: [
      {
        id: 12,
        userId: 2,
        username: "ADMIN",
        userAvatar: "test",
        star: 3,
        comment: "abc",
        feedbackFilesUrl: [],
      },
    ],
    message: "",
  },
  commentById: CommentDetail,
};
export const comments = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCommentByProductId.fulfilled, (state, { payload }) => {
      state.commentByProduct = payload.data;
    });
    builder.addCase(getCommentById.fulfilled, (state, { payload }) => {
      state.commentById = payload.data;
    });
  },
});
const commentsReducer = comments.reducer;
export default commentsReducer;
