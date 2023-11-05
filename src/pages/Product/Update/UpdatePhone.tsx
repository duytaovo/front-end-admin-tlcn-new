import { yupResolver } from "@hookform/resolvers/yup";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Form, Space, Upload } from "antd";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "src/components/Input";
import path from "src/constants/path";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { ErrorResponse } from "src/types/utils.type";
import { schemaProductSmartPhone } from "src/utils/rules";
import {
  generateRandomString,
  getAvatarUrl,
  getIdFromNameId,
  isAxiosUnprocessableEntityError,
} from "src/utils/utils";
import SelectCustom from "src/components/Select";

import Textarea from "src/components/Textarea";
import { getCategorys } from "src/store/category/categorySlice";
import {
  getDetailPhone,
  getSmartPhones,
  updateSmartPhone,
} from "src/store/product/smartPhoneSlice";
import InputFile from "src/components/InputFile";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { getCharacters } from "src/store/characteristic/characteristicSlice";

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

interface FormData {
  brand: string;
  category: string;
  characteristic: string;
  name: string;
  description: string;
  design: string | undefined;
  dimension: string | undefined;
  mass: string | undefined;
  launchTime: string | undefined;
  accessories: string | undefined;
  productStatus: number | undefined;
  ram: string;
  storageCapacity: string;
  color: string;
  price: string;
  salePrice: string | undefined;
  monitor: string;
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
type brand = {
  id: number;
  name: string;
};
const brandSmartPhone: brand[] = [
  {
    id: 1,
    name: "Apple",
  },
  {
    id: 2,
    name: "Samsung",
  },
  {
    id: 3,
    name: "Realmi",
  },
  {
    id: 4,
    name: "Vivo",
  },
  {
    id: 5,
    name: "Nokia",
  },
];
const UpdatePhone: React.FC = () => {
  const [componentDisabled, setComponentDisabled] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    setError,
    register,
    setValue,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(schemaProductSmartPhone),
  });
  const [data, setData] = useState<any>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { category } = useAppSelector((state) => state.category);
  const { nameId } = useParams();
  const id = getIdFromNameId(nameId as string);
  // const { brand } = useAppSelector((state) => state.brand);
  const { smartPhoneDetail } = useAppSelector((state) => state.smartPhone);
  const { character } = useAppSelector((state) => state.character);
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "lstProductTypeAndPrice", // unique name for your Field Array
    }
  );
  useEffect(() => {
    dispatch(getCategorys(""));
    dispatch(getCharacters(""));
    dispatch(getDetailPhone(id));
  }, []);

  useEffect(() => {
    dispatch(getDetailPhone(id));
  }, [id]);

  const [file, setFile] = useState<File[]>();
  const imageArray = file || []; // Mảng chứa các đối tượng ảnh (File hoặc Blob)

  // Tạo một mảng chứa các URL tạm thời cho ảnh
  const imageUrls: string[] = [];

  for (const image of imageArray) {
    const imageUrl = URL.createObjectURL(image);
    imageUrls.push(imageUrl);
  }
  useEffect(() => {
    setValue(
      "ram",
      smartPhoneDetail?.productInfo?.lstProductTypeAndPrice[0]?.ram
    );
    setValue("accessories", smartPhoneDetail?.productInfo?.accessories);
    setValue("battery", smartPhoneDetail?.battery);
    setValue("charging", smartPhoneDetail?.charging);
    setValue("chip", smartPhoneDetail?.chip);
    setValue("mass", smartPhoneDetail?.productInfo?.mass.toString());
    setValue(
      "color",
      smartPhoneDetail?.productInfo.lstProductTypeAndPrice[0].color.toString()
    );
    setValue("monitor", smartPhoneDetail?.monitor);
    setValue("networkSupport", smartPhoneDetail?.networkSupport);
    setValue("description", smartPhoneDetail?.productInfo?.description);
    setValue("brand", smartPhoneDetail?.productInfo?.brandId.toString());
    setValue(
      "characteristic",
      smartPhoneDetail?.productInfo?.characteristicId.toString()
    );
    setValue("name", smartPhoneDetail?.productInfo?.name);
    setValue("sim", smartPhoneDetail?.sim);
    setValue(
      "salePrice",
      smartPhoneDetail?.productInfo?.lstProductTypeAndPrice[0].salePrice.toString()
    );
    setValue("rearCamera", smartPhoneDetail?.rearCamera);
    setValue(
      "price",
      smartPhoneDetail?.productInfo?.lstProductTypeAndPrice[0].price.toString()
    );
    setValue("frontCamera", smartPhoneDetail?.frontCamera);
    setValue("operatingSystem", smartPhoneDetail?.operatingSystem);
    setValue("design", smartPhoneDetail?.productInfo?.design);
    setValue("dimension", smartPhoneDetail?.productInfo?.dimension);
    setValue("category", smartPhoneDetail?.productInfo?.categoryId.toString());
    setValue("launchTime", "2023");
    setValue("imageUrl", smartPhoneDetail?.productInfo.lstProductImageUrl);
  }, [smartPhoneDetail]);

  const onSubmit = handleSubmit(async (data) => {
    const body = JSON.stringify({
      productInfo: {
        brandId: 1,
        categoryId: Number(data.category),
        productId: null,
        characteristicId: 1,
        productCode: generateRandomString(10),
        name: data.name,
        description: data?.description,
        design: data?.design,
        dimension: data?.dimension,
        mass: Number(data?.mass),
        launchTime: 2023,
        accessories: data?.accessories,
        productStatus: 100,
        lstProductTypeAndPrice: data?.lstProductTypeAndPrice?.map((item) => ({
          typeId: null,
          ram: item?.ram,
          storageCapacity: item?.storageCapacity,
          color: item?.color,
          price: Number(item?.price),
          salePrice: Number(item?.salePrice),
        })),

        lstProductImageUrl: data?.imageUrl?.map((item) => ({
          typeId: null,
          ram: item?.ram,
          storageCapacity: item?.storageCapacity,
          color: item?.color,
          price: Number(item?.price),
          salePrice: Number(item?.salePrice),
        })),
      },
      monitor: data.monitor,
      operatingSystem: data.operatingSystem,
      rearCamera: data.rearCamera,
      frontCamera: data.frontCamera,
      chip: data.chip,
      sim: data.sim,
      battery: data.battery,
      charging: data.charging,
      networkSupport: data.networkSupport,
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
      const res = await dispatch(updateSmartPhone(body));
      unwrapResult(res);
      const d = res?.payload?.data;
      if (d?.status !== 200) return toast.error(d?.message);
      await toast.success("Chỉnh sửa thành công ");
      await dispatch(getSmartPhones(""));
      await navigate(path.smartPhone);
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
    setValue(
      "ram",
      smartPhoneDetail?.productInfo?.lstProductTypeAndPrice[0]?.ram
    );
    setValue("accessories", smartPhoneDetail?.productInfo?.accessories);
    setValue("battery", smartPhoneDetail?.battery);
    setValue("charging", smartPhoneDetail?.charging);
    setValue("chip", smartPhoneDetail?.chip);
    setValue("mass", smartPhoneDetail?.productInfo?.mass.toString());
    setValue(
      "color",
      smartPhoneDetail?.productInfo.lstProductTypeAndPrice[0].color.toString()
    );
    setValue("monitor", smartPhoneDetail?.monitor);
    setValue("networkSupport", smartPhoneDetail?.networkSupport);
    setValue("description", smartPhoneDetail?.productInfo?.description);
    setValue("brand", smartPhoneDetail?.productInfo?.brandId.toString());
    setValue(
      "characteristic",
      smartPhoneDetail?.productInfo?.characteristicId.toString()
    );
    setValue("name", smartPhoneDetail?.productInfo?.name);
    setValue("sim", smartPhoneDetail?.sim);
    setValue(
      "salePrice",
      smartPhoneDetail?.productInfo?.lstProductTypeAndPrice[0].salePrice.toString()
    );
    setValue("rearCamera", smartPhoneDetail?.rearCamera);
    setValue(
      "price",
      smartPhoneDetail?.productInfo?.lstProductTypeAndPrice[0].price.toString()
    );
    setValue("frontCamera", smartPhoneDetail?.frontCamera);
    setValue("operatingSystem", smartPhoneDetail?.operatingSystem);
    setValue("design", smartPhoneDetail?.productInfo?.design);
    setValue("dimension", smartPhoneDetail?.productInfo?.dimension);
    setValue("category", smartPhoneDetail?.productInfo?.categoryId.toString());
    setValue("launchTime", "2023");
    setValue("imageUrl", smartPhoneDetail?.productInfo.lstProductImageUrl);
  };
  const avatar = watch("imageUrl");
  const handleChangeFile = (file?: File[]) => {
    setFile(file);
  };

  return (
    <div className="bg-white shadow ">
      <h2 className="font-bold m-4 text-2xl">Cập nhật sản phẩm điện thoại</h2>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 800, padding: 6 }}
        autoComplete="off"
        noValidate
        onSubmitCapture={onSubmit}
      >
        <Form.Item
          label="Danh mục sản phẩm"
          name=""
          rules={[{ required: true }]}
        >
          <SelectCustom
            className={"flex-1 text-black"}
            id="category"
            // label="Hãng xe"
            placeholder="Vui lòng chọn"
            defaultValue={smartPhoneDetail?.productInfo?.categoryId}
            options={category}
            register={register}
            isBrand={true}
          >
            {errors.category?.message}
          </SelectCustom>
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
            defaultValue={smartPhoneDetail?.productInfo?.brandId}
            options={brandSmartPhone}
            register={register}
            isBrand={true}
          >
            {errors.brand?.message}
          </SelectCustom>
        </Form.Item>
        <Form.Item
          label="Hệ điều hành"
          name="operatingSystem"
          rules={[{ required: true }]}
        >
          <SelectCustom
            className={"flex-1 text-black"}
            id="operatingSystem"
            // label="Hãng xe"
            placeholder="Vui lòng chọn"
            defaultValue={""}
            options={[
              { id: "iOS", name: "iOS" },
              { id: "Android", name: "android" },
            ]}
            register={register}
            isBrand={true}
          >
            {errors.operatingSystem?.message}
          </SelectCustom>
        </Form.Item>
        <Form.Item
          label="Đặc điểm sản phẩm"
          name="characteristic"
          rules={[{ required: true }]}
        >
          <SelectCustom
            className={"flex-1 text-black"}
            id="characteristic"
            // label="Hãng xe"
            placeholder="Vui lòng chọn"
            defaultValue={""}
            options={character}
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
            placeholder="Điện thoại iPhone 15 Pro Max 1TB"
            name="name"
            register={register}
            type="text"
            className=""
            errorMessage={errors.name?.message}
          />
        </Form.Item>

        <Form.Item label="Thiết kế" name="design" rules={[{ required: true }]}>
          <Input
            name="design"
            register={register}
            type="text"
            className=""
            errorMessage={errors.design?.message}
            placeholder="Nguyên khối"
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
            placeholder="Dài 159.9 mm - Ngang 76.7 mm - Dày 8.25 mm "
          />
        </Form.Item>
        <Form.Item label="Khối lượng" name="mass" rules={[{ required: true }]}>
          <Input
            name="mass"
            register={register}
            type="number"
            className=""
            errorMessage={errors.mass?.message}
            placeholder=" 221 "
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
            type="number"
            className=""
            errorMessage={errors.launchTime?.message}
            placeholder="2023"
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
            placeholder="Tai nghe, sạc"
          />
        </Form.Item>
        <Form.Item
          label="Loại sản phẩm"
          name="lstProductTypeAndPrice"
          rules={[{ required: true }]}
        >
          <ul>
            {fields.map((item, index) => (
              <li key={item.id}>
                <div className="flex justify-between space-x-1">
                  <Form.Item
                    label="Ram"
                    name={`lstProductTypeAndPrice.${index}.ram`}
                    rules={[{ required: true }]}
                  >
                    <Input
                      name={`lstProductTypeAndPrice.${index}.ram`}
                      key={item.id} // important to include key with field's id
                      register={register}
                      placeholder="8Gb"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Bộ nhớ trong"
                    name={`lstProductTypeAndPrice.${index}.storageCapacity`}
                    rules={[{ required: true }]}
                  >
                    <Input
                      name={`lstProductTypeAndPrice.${index}.storageCapacity`}
                      key={item.id} // important to include key with field's id
                      register={register}
                      placeholder="1TB"
                    />
                  </Form.Item>
                </div>
                <div className="flex justify-between space-x-1">
                  <Form.Item
                    label="Giá"
                    name={`lstProductTypeAndPrice.${index}.price`}
                    rules={[{ required: true }]}
                  >
                    <Input
                      name={`lstProductTypeAndPrice.${index}.price`}
                      key={item.id} // important to include key with field's id
                      register={register}
                      placeholder="45000000"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Giá khuyến mãi"
                    name={`lstProductTypeAndPrice.${index}.salePrice`}
                    rules={[{ required: true }]}
                  >
                    <Input
                      name={`lstProductTypeAndPrice.${index}.salePrice`}
                      key={item.id} // important to include key with field's id
                      register={register}
                      placeholder="44000000"
                    />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    label="Màu"
                    name={`lstProductTypeAndPrice.${index}.color`}
                    rules={[{ required: true }]}
                  >
                    <Input
                      name={`lstProductTypeAndPrice.${index}.color`}
                      key={item.id} // important to include key with field's id
                      register={register}
                      placeholder="Titan tự nhiên"
                    />
                  </Form.Item>
                </div>
                <Form.Item>
                  <Button
                    type="default"
                    onClick={() => remove(index)}
                    block
                    icon={<PlusOutlined />}
                  >
                    Xóa trường này
                  </Button>
                </Form.Item>
                {/* <MinusCircleOutlined onClick={() => remove(index)} /> */}
              </li>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() =>
                  append({
                    storageCapacity: "",
                    ram: "",
                    color: "",
                    price: "",
                    salePrice: "",
                  })
                }
                block
                icon={<PlusOutlined />}
              >
                Thêm trường này
              </Button>
            </Form.Item>
          </ul>
        </Form.Item>

        <Form.Item label="Màn hình" name="monitor" rules={[{ required: true }]}>
          <Input
            name="monitor"
            register={register}
            type="text"
            className=""
            errorMessage={errors.monitor?.message}
            placeholder="6.7 - Tần số quét 120 Hz"
          />
        </Form.Item>

        <Form.Item
          label="Camera trước"
          name="frontCamera"
          rules={[{ required: true }]}
        >
          <Input
            name="frontCamera"
            register={register}
            type="text"
            className=""
            errorMessage={errors.frontCamera?.message}
            placeholder="12 MP"
          />
        </Form.Item>
        <Form.Item
          label="Camera sau"
          name="rearCamera"
          rules={[{ required: true }]}
        >
          <Input
            name="rearCamera"
            register={register}
            type="text"
            className=""
            errorMessage={errors.rearCamera?.message}
            placeholder="Chính 48 MP & Phụ 12 MP, 12 MP"
          />
        </Form.Item>
        <Form.Item label="Chip" name="chip" rules={[{ required: true }]}>
          <Input
            name="chip"
            register={register}
            type="text"
            className=""
            errorMessage={errors.chip?.message}
            placeholder="Apple A17 Pro 6 nhân"
          />
        </Form.Item>
        <Form.Item label="Sim" name="sim" rules={[{ required: true }]}>
          <Input
            name="sim"
            register={register}
            type="text"
            className=""
            errorMessage={errors.sim?.message}
            placeholder="1 Nano SIM & 1 eSIM"
          />
        </Form.Item>
        <Form.Item label="Pin" name="battery" rules={[{ required: true }]}>
          <Input
            name="battery"
            register={register}
            type="text"
            className=""
            errorMessage={errors.battery?.message}
            placeholder="4422 mAh"
          />
        </Form.Item>
        <Form.Item
          label="Sạc nhanh"
          name="charging"
          rules={[{ required: true }]}
        >
          <Input
            name="charging"
            register={register}
            type="text"
            className=""
            errorMessage={errors.charging?.message}
            placeholder="20 W"
          />
        </Form.Item>
        <Form.Item
          label="Hỗ trợ mạng"
          name="networkSupport"
          rules={[{ required: true }]}
        >
          <Input
            name="networkSupport"
            register={register}
            type="text"
            className=""
            errorMessage={errors.networkSupport?.message}
            placeholder="5G"
          />
        </Form.Item>

        <Form.Item
          name="file"
          // rules={[{ required: true }]}
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
                    src={imageUrl}
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
            {/* {errors.images?.message} */}
          </div>
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true }]}
        >
          <Textarea
            defaultValue={smartPhoneDetail?.productInfo?.description}
            id="description"
            isUpdate={false}
            register={register}
            setValue={setValue}
            textAlign={"left"}
          />
        </Form.Item>
        <div className="flex justify-start">
          <Form.Item label="" className="ml-[135px] mb-2 bg-green-300">
            <Button className="w-[100px]" onClick={onSubmit} type="default">
              Lưu
            </Button>
          </Form.Item>
          <Form.Item label="" className="ml-[70px] mb-2">
            <Button
              className="w-[100px] bg-blue-300"
              onClick={onClickHuy}
              type="dashed"
              color="red"
            >
              Đặt lại
            </Button>
          </Form.Item>
          <Form.Item label="" className="ml-[70px] mb-2 bg-red-300">
            <Button
              className="w-[100px]"
              onClick={() => {
                navigate(path.smartPhone);
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

export default () => <UpdatePhone />;
