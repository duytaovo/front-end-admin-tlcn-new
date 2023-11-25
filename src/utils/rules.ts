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
  phone: yup
    .string()
    .required("Số điện thoại là bắt buộc")
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const schemaAddUser = yup.object({
  gender: yup.string(),
  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .min(10, "Độ dài từ 10 chữ số")
    .matches(
      /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
      "Số điện thoại không đúng định dạng"
    ),
  name: yup.string(),
  fullName: yup.string().required("Họ Tên là bắt buộc"),
  email: yup.string().required("Email là bắt buộc"),
  password: yup.string().required("Password là bắt buộc"),
  address: yup.string().required("Địa chỉ là bắt buộc"),
  imageUrl: yup.string(),
});

export const schemaProductSmartPhone = yup.object({
  brand: yup.string(),
  category: yup.string(),
  characteristic: yup.string(),
  name: yup.string(),
  description: yup.string(),
  design: yup.string(),
  dimension: yup.string(),
  mass: yup.string(),
  launchTime: yup.string(),
  accessories: yup.string(),
  productStatus: yup.number(),
  ram: yup.string(),
  storageCapacity: yup.string(),
  color: yup.string(),
  price: yup.string(),
  salePrice: yup.string(),
  monitor: yup.string(),
  operatingSystem: yup.string(),
  frontCamera: yup.string(),
  rearCamera: yup.string(),
  chip: yup.string(),
  quantity: yup.string(),
  depot: yup.string(),
  sim: yup.string(),
  battery: yup.string(),
  charging: yup.string(),
  networkSupport: yup.string(),
  lstProductTypeAndPrice: yup.array(),
  files: yup.array(),
});

export const schemaProductSmartWatch = yup.object({
  brand: yup.string(),
  category: yup.string(),
  characteristic: yup.string(),
  name: yup.string(),
  description: yup.string(),
  design: yup.string(),
  dimension: yup.string(),
  mass: yup.string(),
  launchTime: yup.string(),
  accessories: yup.string(),
  productStatus: yup.number(),
  ram: yup.string(),
  storageCapacity: yup.string(),
  color: yup.string(),
  price: yup.string(),
  salePrice: yup.string(),
  monitor: yup.string(),
  operatingSystem: yup.string(),
  frontCamera: yup.string(),
  rearCamera: yup.string(),
  chip: yup.string(),
  quantity: yup.string(),
  depot: yup.string(),
  sim: yup.string(),
  battery: yup.string(),
  charging: yup.string(),
  networkSupport: yup.string(),
  cpu: yup.string(),
  connectToOs: yup.string(),
  internalMemory: yup.string(),
  connector: yup.string(),
  health: yup.string(),
  lstProductTypeAndPrice: yup.array(),
  imageUrl: yup.array(),
});

export const schemaProductRam = yup.object({
  brand: yup.string(),
  category: yup.string(),
  characteristic: yup.string(),
  name: yup.string(),
  description: yup.string(),
  design: yup.string(),
  dimension: yup.string(),
  mass: yup.string(),
  launchTime: yup.string(),
  accessories: yup.string(),
  productStatus: yup.number(),
  ram: yup.string(),
  storageCapacity: yup.string(),
  color: yup.string(),
  price: yup.string(),
  salePrice: yup.string(),
  monitor: yup.string(),
  operatingSystem: yup.string(),
  lstProductTypeAndPrice: yup.array(),
  quantity: yup.string(),
  depot: yup.string(),
  ramFor: yup.boolean(),
  model: yup.string(),
  ramType: yup.string(),
  romType: yup.string(),
  connect: yup.string(),
  readingSpeed: yup.string(),
  writingSpeed: yup.string(),
  capacity: yup.string(),
  bus: yup.number(),
  latency: yup.string(),
  voltage: yup.string(),
  led: yup.string(),
  ramTechnology: yup.string(),
  imageUrl: yup.array(),
  cpuFor: yup.boolean(),
  generation: yup.string(),
  generationName: yup.string(),
  socket: yup.string(),
  multiplier: yup.string(),
  numberOfStreams: yup.string(),
  cpuSpeed: yup.string(),
  maxSpeed: yup.string(),
  caching: yup.string(),
  memoryCapacity: yup.string(),
  graphicsEngine: yup.string(),
  standardBus: yup.string(),
  memory: yup.string(),
  memorySpeed: yup.string(),
  engineClock: yup.string(),
  outputPort: yup.string(),
  powerCapacity: yup.string(),
  maximumResolution: yup.string(),
});

export const schemaProductMouse = yup.object({
  brand: yup.string(),
  category: yup.string(),
  characteristic: yup.string(),
  name: yup.string(),
  description: yup.string(),
  design: yup.string(),
  dimension: yup.string(),
  mass: yup.string(),
  launchTime: yup.string(),
  accessories: yup.string(),
  productStatus: yup.number(),
  ram: yup.string(),
  storageCapacity: yup.string(),
  color: yup.string(),
  price: yup.string(),
  salePrice: yup.string(),
  mouseType: yup.boolean(),
  compatible: yup.string(),
  resolution: yup.string(),
  connector: yup.string(),
  led: yup.string(),
  softwareSupport: yup.string(),
  batteryType: yup.string(),
  time: yup.string(),
  chargingPort: yup.string(),
  lstProductTypeAndPrice: yup.array(),
});

export const schemaProductLoudSpeaker = yup.object({
  brand: yup.string(),
  category: yup.string(),
  characteristic: yup.string(),
  name: yup.string(),
  description: yup.string(),
  design: yup.string(),
  dimension: yup.string(),
  mass: yup.string(),
  launchTime: yup.string(),
  accessories: yup.string(),
  productStatus: yup.number(),
  ram: yup.string(),
  storageCapacity: yup.string(),
  color: yup.string(),
  price: yup.string(),
  salePrice: yup.string(),
  loudspeakerType: yup.boolean(),
  totalCapacity: yup.string(),
  time: yup.string(),
  connection: yup.string(),
  utilities: yup.string(),
  control: yup.string(),
  lstProductTypeAndPrice: yup.array(),
});

export const schemaProductKeyboard = yup.object({
  brand: yup.string(),
  category: yup.string(),
  characteristic: yup.string(),
  name: yup.string(),
  description: yup.string(),
  design: yup.string(),
  dimension: yup.string(),
  mass: yup.string(),
  launchTime: yup.string(),
  accessories: yup.string(),
  productStatus: yup.number(),
  ram: yup.string(),
  storageCapacity: yup.string(),
  color: yup.string(),
  price: yup.string(),
  salePrice: yup.string(),
  keyboardType: yup.boolean(),
  compatible: yup.string(),
  connector: yup.string(),
  led: yup.string(),
  numberOfKeys: yup.string(),
  keycapsMaterial: yup.string(),
  specialKeys: yup.string(),
  softwareSupport: yup.string(),
  lstProductTypeAndPrice: yup.array(),
});

export const schemaLaptop = yup.object({
  brand: yup.string(),
  category: yup.string().required("Trường này là bắt buộc"),
  characteristic: yup.string().required("Trường này là bắt buộc"),
  name: yup.string().required("Trường này là bắt buộc"),
  description: yup.string(),
  design: yup.string(),
  dimension: yup.string(),
  mass: yup.string(),
  launchTime: yup.string(),
  accessories: yup.string(),
  depot: yup.string(),
  productStatus: yup.number(),
  ram: yup.string(),
  storageCapacity: yup.string(),
  color: yup.string(),
  price: yup.string(),
  salePrice: yup.string(),
  monitor: yup.string(),
  operatingSystem: yup.string(),
  frontCamera: yup.string(),
  rearCamera: yup.string(),
  chip: yup.string(),
  sim: yup.string(),
  battery: yup.string(),
  charging: yup.string(),
  networkSupport: yup.string(),
  lstProductTypeAndPrice: yup.array(),
  gateway: yup.string(),
  special: yup.string(),
  maximumRam: yup.string(),
  maximumRom: yup.string(),
  processor: yup.string(),
  ramId: yup.string(),
  romId: yup.string(),
  graphicsCard: yup.string(),
  imageUrl: yup.array(),
});

export const schemaBrand = yup.object({
  name: yup.string().required("Tên nhãn hiệu là bắt buộc"),
  address: yup.string(),
  imageUrl: yup.string(),
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
  upload: yup.string().required(" là bắt buộc"),
});
export type UserSchema = yup.InferType<typeof userSchema>;

export type Schema = yup.InferType<typeof schema>;
