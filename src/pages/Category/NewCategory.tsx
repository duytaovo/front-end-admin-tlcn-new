import { PlusOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Form, Upload } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "src/components/Input";
import path from "src/constants/path";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { addUser, getUser } from "src/store/user/userSlice";
import { ErrorResponse } from "src/types/utils.type";
import { schemaProductSmartPhone } from "src/utils/rules";
import { getAvatarUrl, isAxiosUnprocessableEntityError } from "src/utils/utils";
import SelectCustom from "src/components/Select";

import Textarea from "src/components/Textarea";
import { getCategorys } from "src/store/category/categorySlice";
import { getBrands } from "src/store/brand/brandSlice";
import {
  addSmartPhone,
  getSmartPhones,
} from "src/store/product/smartPhoneSlice";
import InputFile from "src/components/InputFile";

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

interface FormData {
  brand: number;
  category: number;
  characteristic: number;
  name: string;
  description: string;
  design: string;
  dimension: string;
  mass: number;
  launchTime: number;
  accessories: string;
  productStatus: number;
  ram: string;
  storageCapacity: string;
  color: string;
  price: number;
  salePrice: number;
  // lstProductImageUrl: string[]
  monitor: string;
  operatingSystem: string;
  rearCamera: string;
  frontCamera: string;
  chip: string;
  sim: string;
  battery: string;
  charging: string;
  networkSupport: string;
}
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const FormDisabledDemo: React.FC = () => {
  const [componentDisabled, setComponentDisabled] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    setError,
    register,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schemaProductSmartPhone),
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { category } = useAppSelector((state) => state.category);
  const { brand } = useAppSelector((state) => state.brand);
  useEffect(() => {
    dispatch(getCategorys(""));
    dispatch(getBrands(""));
  }, []);
  const [file, setFile] = useState<File[]>();
  const imageArray = file || []; // Mảng chứa các đối tượng ảnh (File hoặc Blob)

  // Tạo một mảng chứa các URL tạm thời cho ảnh
  const imageUrls: string[] = [];

  for (const image of imageArray) {
    const imageUrl = URL.createObjectURL(image);
    imageUrls.push(imageUrl);
  }
  useEffect(() => {
    setValue("ram", "");
    setValue("accessories", "");
    setValue("battery", "");
    setValue("charging", "");
    setValue("chip", "");
    setValue("color", "");
    setValue("description", "");
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    const body = JSON.stringify({
      productInfo: {
        brandId: 1,
        categoryId: 1,
        productId: null,
        characteristicId: 1,
        productCode: "cMH8wbb3gq",
        name: "iphone 15",
        description: "iphone 15",
        design: "dinamic island",
        dimension: "",
        mass: 6.1,
        launchTime: 0,
        accessories: "2023",
        productStatus: 0,
        lstProductTypeAndPrice: [
          {
            typeId: null,
            ram: "8gb",
            storageCapacity: "256gb",
            color: "black",
            price: 40000000,
            salePrice: 39000000,
          },
        ],
        lstProductImageUrl: ["abc"],
      },
      monitor: "oled",
      operatingSystem: "iOS",
      rearCamera: "49px",
      frontCamera: "12px",
      chip: "A16",
      sim: "2 sim",
      battery: "4000mh",
      charging: "",
      networkSupport: "",
    });
    // if (file) {
    //   const form = new FormData();
    //   form.append("file", file[0]);
    //   form.append("image", file[0]);
    // } else {
    //   toast.warning("Cần chọn ảnh");
    // }

    try {
      setIsSubmitting(true);
      const res = await dispatch(addSmartPhone(body));
      unwrapResult(res);
      const d = res?.payload?.data;
      if (d?.status !== 200) return toast.error(d?.message);
      await toast.success("Thêm thành công ");
      await dispatch(getSmartPhones(""));
      await navigate(path.users);
    } catch (error: any) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data;
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              // message: formError[key as keyof FormData],
              type: "Server",
            });
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  });
  const onClickHuy = () => {
    setValue("ram", "");
    setValue("accessories", "");
    setValue("battery", "");
    setValue("charging", "");
    setValue("chip", "");
    setValue("color", "");
    setValue("description", "");
  };
  const avatar = watch("images");
  const handleChangeFile = (file?: File[]) => {
    setFile(file);
  };
  return (
    <div className="bg-white shadow ">
      <h2 className="font-bold m-4 text-2xl">Thêm sản phẩm điện thoại</h2>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 700, padding: 6 }}
        autoComplete="off"
        noValidate
        onSubmitCapture={onSubmit}
      >
        <Form.Item
          label="Loại sản phẩm"
          className="rounded-3xl"
          name="category"
          rules={[{ required: true }]}
        >
          <Input
            name="category"
            register={register}
            type="text"
            className=""
            errorMessage={errors.category?.message}
            value="Điện thoại"
            disabled
            placeholder="Điện thoại"
          />
        </Form.Item>
        <Form.Item
          label="Hãng sản xuất"
          name="brand"
          rules={[{ required: true }]}
        >
          <SelectCustom
            className={"flex-1 text-black"}
            id="brand"
            // label="Hãng xe"
            placeholder="Vui lòng chọn"
            defaultValue={""}
            options={brand}
            register={register}
            isBrand={true}
          >
            {errors.brand?.message}
          </SelectCustom>
        </Form.Item>
        <Form.Item
          label="Đặc điểm sản phẩm"
          name="characteristic"
          rules={[{ required: true }]}
        >
          <SelectCustom
            className={"flex-1 text-black"}
            id="brand"
            // label="Hãng xe"
            placeholder="Vui lòng chọn"
            defaultValue={""}
            options={brand}
            register={register}
            isBrand={true}
          >
            {errors.characteristic?.message}
          </SelectCustom>
        </Form.Item>
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true }]}
        >
          <Input
            // placeholder="Iphone 15 Plus"
            name="name"
            register={register}
            type="text"
            className=""
            errorMessage={errors.name?.message}
          />
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true }]}
        >
          <Textarea
            defaultValue="Mô tả sản phẩm"
            id="description"
            isUpdate={false}
            register={register}
            setValue={setValue}
            textAlign={"left"}
          />
        </Form.Item>
        <Form.Item label="Thiết kế" name="design" rules={[{ required: true }]}>
          <Input
            name="design"
            register={register}
            type="text"
            className=""
            errorMessage={errors.design?.message}
            // placeholder="Màn hinh"
          />
        </Form.Item>
        <Form.Item
          label="Kích thước"
          name="dimension"
          rules={[{ required: true }]}
        >
          <Input
            name="dimension"
            register={register}
            type="text"
            className=""
            errorMessage={errors.dimension?.message}
            // placeholder="Màn hinh"
          />
        </Form.Item>
        <Form.Item label="Màn hình" name="mass" rules={[{ required: true }]}>
          <Input
            name="mass"
            register={register}
            type="text"
            className=""
            errorMessage={errors.mass?.message}
            // placeholder="Màn hinh"
          />
        </Form.Item>
        <Form.Item
          label="Năm ra mắt"
          name="launchTime"
          rules={[{ required: true }]}
        >
          <Input
            name="launchTime"
            register={register}
            type="text"
            className=""
            errorMessage={errors.launchTime?.message}
            // placeholder="Màn hinh"
          />
        </Form.Item>
        <Form.Item
          label="Phụ kiện"
          name="accessories"
          rules={[{ required: true }]}
        >
          <Input
            name="accessories"
            register={register}
            type="text"
            className=""
            errorMessage={errors.accessories?.message}
            // placeholder="Màn hinh"
          />
        </Form.Item>
        <Form.Item label="Ram" name="ram" rules={[{ required: true }]}>
          <Input
            name="ram"
            register={register}
            type="text"
            className=""
            errorMessage={errors.ram?.message}
            // placeholder="Màn hinh"
          />
        </Form.Item>
        <Form.Item
          label="Rom"
          name="storageCapacity"
          rules={[{ required: true }]}
        >
          <Input
            name="storageCapacity"
            register={register}
            type="text"
            className=""
            errorMessage={errors.storageCapacity?.message}
            // placeholder="Màn hinh"
          />
        </Form.Item>
        <Form.Item label="Màu sắc" name="color" rules={[{ required: true }]}>
          <Input
            name="color"
            register={register}
            type="text"
            className=""
            errorMessage={errors.color?.message}
            // placeholder="Màn hinh"
          />
        </Form.Item>
        <Form.Item label="Màu sắc" name="color" rules={[{ required: true }]}>
          <Input
            name="color"
            register={register}
            type="text"
            className=""
            errorMessage={errors.color?.message}
            // placeholder="Màn hinh"
          />
        </Form.Item>
        <Form.Item label="Giá" name="price" rules={[{ required: true }]}>
          <Input
            name="price"
            register={register}
            type="text"
            className=""
            errorMessage={errors.price?.message}
            // placeholder="Màn hinh"
          />
        </Form.Item>
        <Form.Item
          label="Giá khuyến mãi"
          name="salePrice"
          rules={[{ required: true }]}
        >
          <Input
            name="salePrice"
            register={register}
            type="text"
            className=""
            errorMessage={errors.salePrice?.message}
            // placeholder="Màn hinh"
          />
        </Form.Item>
        <Form.Item
          name="file"
          rules={[{ required: true }]}
          label="Hình ảnh"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <div className="flex flex-col items-start ">
            <div className="my-5 w-24 space-y-5 justify-between items-center">
              {imageUrls.map((imageUrl, index) => {
                return (
                  <img
                    key={index}
                    src={imageUrl || getAvatarUrl(avatar)}
                    className="h-full rounded-md w-full  object-cover"
                    alt="avatar"
                  />
                );
              })}
            </div>
            <InputFile
              label="Upload ảnh"
              onChange={handleChangeFile}
              id="images"
            />
            <div className="mt-3  flex flex-col items-center text-red-500">
              <div>Dụng lượng file tối đa 2 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </div>
            {errors.images?.message}
          </div>
        </Form.Item>
        <Form.Item label="Màn hình" name="monitor" rules={[{ required: true }]}>
          <Input
            name="monitor"
            register={register}
            type="text"
            className=""
            errorMessage={errors.monitor?.message}
            // placeholder="Màn hinh"
          />
        </Form.Item>

        <div className="flex justify-start">
          <Form.Item label="" className="ml-[115px] mb-2">
            <Button className="w-[100px]" onClick={onSubmit}>
              Lưu
            </Button>
          </Form.Item>
          <Form.Item label="" className="ml-[50px] mb-2">
            <Button className="w-[100px]" onClick={onClickHuy}>
              Đặt lại
            </Button>
          </Form.Item>
          <Form.Item label="" className="ml-[50px] mb-2">
            <Button
              className="w-[100px]"
              onClick={() => {
                navigate(path.users);
              }}
            >
              Hủy
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default () => <FormDisabledDemo />;
