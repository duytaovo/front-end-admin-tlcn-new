import { yupResolver } from "@hookform/resolvers/yup";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Form } from "antd";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "src/components/Input";
import path from "src/constants/path";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { ErrorResponse } from "src/types/utils.type";
import { schemaLaptop } from "src/utils/rules";
import {
  generateRandomString,
  isAxiosUnprocessableEntityError,
} from "src/utils/utils";
import SelectCustom from "src/components/Select";
import Textarea from "src/components/Textarea";
import { getCategorys } from "src/store/category/categorySlice";
import { getBrands } from "src/store/brand/brandSlice";

import InputFile from "src/components/InputFile";
import { getCardGraphic } from "src/store/cardGrap/cardGraphicSlice";
import { getRams } from "src/store/ram/ramSlice";
import { getRoms } from "src/store/rom/romSlice";
import { getProcessor } from "src/store/processor/processorSlice";
import { getCharacters } from "src/store/characteristic/characteristicSlice";
import { addLaptop, getLaptop } from "src/store/product/laptopSlice ";
import { PlusOutlined } from "@ant-design/icons";
import { getdepots } from "src/store/depot/depotSlice";
import { uploadManyImagesProductSmartPhone } from "src/store/product/smartPhoneSlice";

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
  productStatus: string | undefined;
  ram: string;
  storageCapacity: string;
  color: string;
  price: string;
  salePrice: string | undefined;
  monitor: string;
}

const NewLaptop: React.FC = () => {
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
    resolver: yupResolver(schemaLaptop),
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { category } = useAppSelector((state) => state.category);
  const { cardGraphic } = useAppSelector((state) => state.cardGraphic);
  const { ram } = useAppSelector((state) => state.ram);
  const { depot } = useAppSelector((state) => state.depot);
  const { rom } = useAppSelector((state) => state.rom);
  const { processor } = useAppSelector((state) => state.processor);
  const { character } = useAppSelector((state) => state.character);
  const { brand } = useAppSelector((state) => state.brand);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "lstProductTypeAndPrice", // unique name for your Field Array
    }
  );
  useEffect(() => {
    dispatch(getCategorys({ pageSize: 100 }));
    dispatch(getCharacters({ pageSize: 100 }));
    dispatch(getBrands({ pageSize: 100 }));
    dispatch(getdepots({ pageSize: 100 }));
    dispatch(getCardGraphic({ pageSize: 100 }));
    dispatch(getRams({ pageSize: 100 }));
    dispatch(getRoms({ pageSize: 100 }));
    dispatch(getProcessor({ pageSize: 100 }));
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
    setValue("brand", "");
    setValue("name", "");
    setValue("sim", "");
    setValue("salePrice", "");
    setValue("rearCamera", "");
    setValue("price", "");
    setValue("frontCamera", "");
    setValue("design", "");
    setValue("dimension", "");
    setValue("gateway", "");
    setValue("graphicsCard", "");
    setValue("maximumRam", "");
    setValue("maximumRom", "");
    setValue("networkSupport", "");
    setValue("imageUrl", []);
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    let images = [];

    if (file) {
      const form = new FormData();
      for (let i = 0; i < file.length; i++) {
        form.append("files", file[i]);
      }
      const res = await dispatch(uploadManyImagesProductSmartPhone(form));
      unwrapResult(res);
      const d = res?.payload?.data?.data;
      for (let i = 0; i < d.length; i++) {
        images.push(d[i]?.fileUrl);
      }
    } else {
      toast.warning("Cần chọn ảnh");
      return;
    }
    const body = JSON.stringify({
      gateway: data.gateway,
      special: data.special,
      maximumRam: Number(data.maximumRam),
      maximumRom: Number(data.maximumRom),
      processorId: Number(data.processor),
      ramId: Number(data.ramId),
      romId: Number(data.romId),
      graphicsCardId: Number(data.graphicsCard),
      productInfo: {
        brandId: Number(data.brand),
        categoryId: Number(data.category),
        productId: null,
        characteristicId: Number(data.characteristic),
        productCode: generateRandomString(10),
        name: data.name,
        description: data.description,
        design: data.design,
        dimension: data.dimension,
        mass: Number(data.mass),
        launchTime: Number(data.launchTime),
        accessories: data.accessories,
        productStatus: 100,
        lstProductTypeAndPrice: data?.lstProductTypeAndPrice?.map((item) => ({
          typeId: null,
          ram: item?.ram,
          storageCapacity: item?.storageCapacity,
          color: item?.color,
          price: Number(item?.price),
          salePrice: Number(item?.salePrice),
          quantity: Number(item?.quantity),
          depotId: Number(item?.depot) || 1,
        })),
        lstProductImageUrl: images || [],
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

    try {
      setIsSubmitting(true);
      const res = await dispatch(addLaptop(body));
      unwrapResult(res);
      const d = res?.payload?.data;
      if (d?.code !== 200) return toast.error(d?.message);
      await toast.success("Thêm sp laptop thành công ");
      await dispatch(getLaptop(""));
      await navigate(path.laptop);
    } catch (error: any) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data;
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
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
    setValue("brand", "");
    setValue("name", "");
    setValue("sim", "");
    setValue("salePrice", "");
    setValue("rearCamera", "");
    setValue("price", "");
    setValue("frontCamera", "");
    setValue("design", "");
    setValue("dimension", "");
    setValue("gateway", "");
    setValue("graphicsCard", "");
    setValue("maximumRam", "");
    setValue("maximumRom", "");
    setValue("networkSupport", "");
    setValue("imageUrl", []);
  };
  const avatar = watch("imageUrl");
  const handleChangeFile = (file?: File[]) => {
    setFile(file);
  };
  return (
    <div className="bg-white shadow ">
      <h2 className="font-bold m-4 text-2xl">Thêm sản phẩm laptop</h2>
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
            defaultValue={""}
            options={category?.data}
            register={register}
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
            placeholder="Vui lòng chọn"
            defaultValue={""}
            options={brand?.data?.data}
            register={register}
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
            options={[
              { id: "macOs", name: "macOs" },
              { id: "Windows", name: "Windows" },
            ]}
            register={register}
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
            options={character?.data}
            register={register}
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
            placeholder="MacBook Air 15 inch M2 2023"
            name="name"
            register={register}
            type="text"
            className=""
            errorMessage={errors.name?.message}
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
            placeholder=" 1.51 "
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
                  >
                    <Input
                      name={`lstProductTypeAndPrice.${index}.salePrice`}
                      key={item.id} // important to include key with field's id
                      register={register}
                      placeholder="44000000"
                    />
                  </Form.Item>
                </div>
                <Form.Item
                  label="Kho hàng"
                  name={`lstProductTypeAndPrice.${index}.depot`}
                  rules={[{ required: true }]}
                >
                  <SelectCustom
                    className={"flex-1 text-black"}
                    id={`lstProductTypeAndPrice.${index}.depot`}
                    // label="Hãng xe"
                    placeholder="Vui lòng chọn"
                    defaultValue={1}
                    options={depot?.data?.data}
                    register={register}
                  >
                    {errors.depot?.message}
                  </SelectCustom>
                </Form.Item>
                <div className="flex justify-between space-x-1">
                  <Form.Item
                    label="Số lượng sản phẩm"
                    name={`lstProductTypeAndPrice.${index}.quantity`}
                    rules={[{ required: true }]}
                  >
                    <Input
                      name={`lstProductTypeAndPrice.${index}.quantity`}
                      key={item.id} // important to include key with field's id
                      register={register}
                      placeholder="1000"
                    />
                  </Form.Item>
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
            placeholder="15.3 inch"
          />
        </Form.Item>

        <Form.Item
          label="Camera"
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
        <Form.Item label="Chip" name="chip" rules={[{ required: true }]}>
          <Input
            name="chip"
            register={register}
            type="text"
            className=""
            errorMessage={errors.chip?.message}
            placeholder="Apple M2"
          />
        </Form.Item>
        <Form.Item label="Pin" name="battery" rules={[{ required: true }]}>
          <Input
            name="battery"
            register={register}
            type="text"
            className=""
            errorMessage={errors.battery?.message}
            placeholder="Lên đến 18 giờ "
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
            placeholder="35 W"
          />
        </Form.Item>
        <Form.Item
          label="Cổng kết nối"
          name="gateway"
          rules={[{ required: true }]}
        >
          <Input
            name="gateway"
            register={register}
            type="text"
            className=""
            errorMessage={errors.gateway?.message}
            placeholder="MagSafe 3"
          />
        </Form.Item>
        <Form.Item
          label="Tính năng đặc biệt"
          name="special"
          rules={[{ required: true }]}
        >
          <Input
            name="special"
            register={register}
            type="text"
            className=""
            errorMessage={errors.special?.message}
            placeholder="Bảo mật vân tay"
          />
        </Form.Item>
        <Form.Item
          label="Ram tối đa"
          name="maximumRam"
          rules={[{ required: true }]}
        >
          <Input
            name="maximumRam"
            register={register}
            type="text"
            className=""
            errorMessage={errors.maximumRam?.message}
            placeholder="16GB"
          />
        </Form.Item>
        <Form.Item
          label="Rom tối đa"
          name="maximumRom"
          rules={[{ required: true }]}
        >
          <Input
            name="maximumRom"
            register={register}
            type="text"
            className=""
            errorMessage={errors.maximumRom?.message}
            placeholder="512GB"
          />
        </Form.Item>
        <Form.Item
          label="Vi xử lý"
          name="processor"
          rules={[{ required: true }]}
        >
          <SelectCustom
            className={"flex-1 text-black"}
            id="processor"
            // label="Hãng xe"
            placeholder="Vui lòng chọn"
            defaultValue={""}
            options={processor?.data?.data}
            register={register}
          >
            {errors.processor?.message}
          </SelectCustom>
        </Form.Item>
        <Form.Item label="Loại ram" name="ramId" rules={[{ required: true }]}>
          <SelectCustom
            className={"flex-1 text-black"}
            id="ramId"
            placeholder="Vui lòng chọn"
            defaultValue={""}
            options={ram?.data?.data}
            register={register}
          >
            {errors.ramId?.message}
          </SelectCustom>
        </Form.Item>
        <Form.Item
          label="Loại ổ cứng"
          name="romId"
          rules={[{ required: true }]}
        >
          <SelectCustom
            className={"flex-1 text-black"}
            id="romId"
            placeholder="Vui lòng chọn"
            defaultValue={""}
            options={rom?.data?.data}
            register={register}
          >
            {errors.romId?.message}
          </SelectCustom>
        </Form.Item>
        <Form.Item
          label="Card đồ họa"
          name="graphicsCard"
          rules={[{ required: true }]}
        >
          <SelectCustom
            className={"flex-1 text-black"}
            id="graphicsCard"
            placeholder="Vui lòng chọn"
            defaultValue={""}
            options={cardGraphic?.data?.data}
            register={register}
          >
            {errors.graphicsCard?.message}
          </SelectCustom>
        </Form.Item>
        <Form.Item
          name="files"
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
            <InputFile label="" onChange={handleChangeFile} id="files" />
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
            defaultValue="Mô tả sản phẩm"
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

export default () => <NewLaptop />;
