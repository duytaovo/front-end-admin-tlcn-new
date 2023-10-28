import type { RegisterOptions, UseFormGetValues } from "react-hook-form";
import * as yup from "yup";

type Rules = {
  [key in "email" | "password" | "confirm_password"]?: RegisterOptions;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: "Email là bắt buộc",
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: "Email không đúng định dạng",
    },
    maxLength: {
      value: 160,
      message: "Độ dài từ 5 - 160 ký tự",
    },
    minLength: {
      value: 5,
      message: "Độ dài từ 5 - 160 ký tự",
    },
  },
  password: {
    required: {
      value: true,
      message: "Password là bắt buộc",
    },
    maxLength: {
      value: 160,
      message: "Độ dài từ 6 - 160 ký tự",
    },
    minLength: {
      value: 6,
      message: "Độ dài từ 6 - 160 ký tự",
    },
  },
  confirm_password: {
    required: {
      value: true,
      message: "Nhập lại password là bắt buộc",
    },
    maxLength: {
      value: 160,
      message: "Độ dài từ 6 - 160 ký tự",
    },
    minLength: {
      value: 6,
      message: "Độ dài từ 6 - 160 ký tự",
    },
    validate:
      typeof getValues === "function"
        ? (value) =>
            value === getValues("password") || "Nhập lại password không khớp"
        : undefined,
  },
});

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required("Nhập lại password là bắt buộc")
    .min(6, "Độ dài từ 6 - 160 ký tự")
    .max(160, "Độ dài từ 6 - 160 ký tự")
    .oneOf([yup.ref(refString)], "Nhập lại password không khớp");
};

export const schema = yup.object({
  email: yup
    .string()
    .required("Email là bắt buộc")
    .email("Email không đúng định dạng")
    .min(5, "Độ dài từ 5 - 160 ký tự")
    .max(160, "Độ dài từ 5 - 160 ký tự"),
  password: yup
    .string()
    .required("Password là bắt buộc")
    .min(6, "Độ dài từ 6 - 160 ký tự")
    .max(160, "Độ dài từ 6 - 160 ký tự"),
  confirm_password: handleConfirmPasswordYup("password"),
});

export const userSchema = yup.object({
  name: yup.string().max(160, "Độ dài tối đa là 160 ký tự"),
  avatar: yup.string().max(1000, "Độ dài tối đa là 1000 ký tự"),
  password: schema.fields["password"],
  new_password: schema.fields["password"],
  confirm_password: handleConfirmPasswordYup("new_password"),
});
export const schemaAddUser = yup.object({
  gioitinh: yup.string(),
  phone: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .min(10, "Độ dài từ 10 chữ số")
    .matches(
      /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
      "Số điện thoại không đúng định dạng"
    ),
  name: yup.string().required("Họ Tên là bắt buộc"),
  address: yup.string().required("Địa chỉ là bắt buộc"),
  image: yup.string(),
});

export const schemaProduct = yup.object({
  loaiSp: yup.string().required("Loại sản phẩm là bắt buộc"),
  screen: yup.string().required("Màn hình sản phẩm là bắt buộc"),
  os: yup.string().required("Hệ điều hành sản phẩm là bắt buộc"),
  cameraBehind: yup.string().required("Camera trước sản phẩm là bắt buộc"),
  cameraBefore: yup.string().required("Camera sau sản phẩm là bắt buộc"),
  chip: yup.string().required("Chip sản phẩm là bắt buộc"),
  sim: yup.string().required("Sim sản phẩm là bắt buộc"),
  pin: yup.string().required("Pin sản phẩm là bắt buộc"),
  Ram: yup.string().required("Ram sản phẩm là bắt buộc"),
  Rom: yup.string().required("Rom sản phẩm là bắt buộc"),
  name: yup.string().required("Tên sp là bắt buộc"),
  model: yup.string().required("Hãng sx là bắt buộc"),
  price: yup.string().required("Giá sản phẩm là bắt buộc"),
  sale: yup.string(),
  mota: yup.string().required("Mô tả là bắt buộc"),
  upload: yup.string().required("Upload ảnh là bắt buộc"),
});

export const schemaLaptop = yup.object({
  loaiSp: yup.string().required("Loại sản phẩm là bắt buộc"),
  screen: yup.string().required("Màn hình sản phẩm là bắt buộc"),
  os: yup.string().required("Hệ điều hành sản phẩm là bắt buộc"),
  chip: yup.string().required("Chip sản phẩm là bắt buộc"),
  Ram: yup.string().required("Ram sản phẩm là bắt buộc"),
  pin: yup.string().required("Pin sản phẩm là bắt buộc"),
  card: yup.string().required("Card màn hình sản phẩm là bắt buộc"),
  Rom: yup.string().required("Rom sản phẩm là bắt buộc"),
  name: yup.string().required("Tên sp là bắt buộc"),
  model: yup.string().required("Hãng sx là bắt buộc"),
  price: yup.string().required("Giá sản phẩm là bắt buộc"),
  sale: yup.string(),
  mota: yup.string().required("Mô tả là bắt buộc"),
  upload: yup.string().required("Upload ảnh là bắt buộc"),
});

export const schemaSmartWatch = yup.object({
  loaiSp: yup.string().required("Loại sản phẩm là bắt buộc"),
  sex: yup.string().required("Giới tính là bắt buộc"),
  face: yup.string(),
  pin: yup.string(),
  healcare: yup.string(),
  name: yup.string().required("Tên sp là bắt buộc"),
  model: yup.string().required("Hãng sx là bắt buộc"),
  price: yup.string().required("Giá sản phẩm là bắt buộc"),
  sale: yup.string(),
  mota: yup.string().required("Mô tả là bắt buộc"),
  upload: yup.string().required("Upload ảnh là bắt buộc"),
});
export type UserSchema = yup.InferType<typeof userSchema>;

export type Schema = yup.InferType<typeof schema>;
