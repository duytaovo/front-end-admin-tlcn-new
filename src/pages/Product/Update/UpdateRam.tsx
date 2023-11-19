import { PlusOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Form } from "antd";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "src/components/Input";
import path from "src/constants/path";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { ErrorResponse } from "src/types/utils.type";
import { schemaProductRam } from "src/utils/rules";
import {
  generateRandomString,
  getIdFromNameId,
  isAxiosUnprocessableEntityError,
} from "src/utils/utils";
import SelectCustom from "src/components/Select";
import Textarea from "src/components/Textarea";
import { getCategorys } from "src/store/category/categorySlice";
import InputFile from "src/components/InputFile";
import { getCharacters } from "src/store/characteristic/characteristicSlice";
import { getBrands } from "src/store/brand/brandSlice";
import { getdepots } from "src/store/depot/depotSlice";
import {
  addRam,
  getDetailRam,
  getRams,
  updateRam,
} from "src/store/ram/ramSlice";

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

const NewRam: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    setError,
    register,
    setValue,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(schemaProductRam),
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { nameId } = useParams();
  const { ram } = useAppSelector((state) => state.ram);
  const id = getIdFromNameId(nameId as string);
  const { category } = useAppSelector((state) => state.category);
  const { character } = useAppSelector((state) => state.character);
  const { depot } = useAppSelector((state) => state.depot);
  const { brand } = useAppSelector((state) => state.brand);
  useEffect(() => {
    dispatch(getCategorys(""));
    dispatch(getCharacters(""));
    dispatch(getBrands(""));
    dispatch(getdepots(""));
  }, []);

  useEffect(() => {
    dispatch(getDetailRam(id));
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
    setValue("ram", ram?.productInfo?.lstProductTypeAndPrice[0]?.ram);
    setValue("accessories", ram?.productInfo?.accessories);
    setValue("mass", ram?.productInfo?.mass.toString());
    setValue(
      "color",
      ram?.productInfo.lstProductTypeAndPrice[0].color.toString()
    );
    setValue("monitor", ram?.monitor);
    setValue("description", ram?.productInfo?.description);
    setValue("brand", ram?.productInfo?.brandId.toString());
    setValue("characteristic", ram?.productInfo?.characteristicId.toString());
    setValue("name", ram?.productInfo?.name);
    setValue(
      "salePrice",
      ram?.productInfo?.lstProductTypeAndPrice[0].salePrice.toString()
    );
    setValue(
      "price",
      ram?.productInfo?.lstProductTypeAndPrice[0].price.toString()
    );
    setValue("operatingSystem", ram?.operatingSystem);
    setValue("design", ram?.productInfo?.design);
    setValue("dimension", ram?.productInfo?.dimension);
    setValue("category", ram?.productInfo?.categoryId.toString());
    setValue("launchTime", "2023");
    setValue("imageUrl", ram?.productInfo.lstProductImageUrl);
    setValue("model", ram?.model);
    setValue("bus", ram?.bus);
    setValue("capacity", ram?.capacity);
    setValue("ramType", ram?.ramType);
    setValue("latency", ram?.latency);
    setValue("voltage", ram?.voltage);
    setValue("led", ram?.led);
    setValue("ramTechnology", ram?.ramTechnology);
  }, [ram]);
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "lstProductTypeAndPrice", // unique name for your Field Array
    }
  );
  const onSubmit = handleSubmit(async (data) => {
    const body = JSON.stringify({
      productInfo: {
        brandId: Number(data.brand) || 1,
        categoryId: Number(data.category) || 1,
        productId: null,
        characteristicId: Number(data.characteristic) || 1,
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
          quantity: Number(item?.quantity),
          depotId: Number(item?.depot) || 1,
        })),

        lstProductImageUrl: [],
      },
      ramFor: true,
      model: data.model,
      ramType: data.ramType,
      capacity: data.capacity,
      bus: Number(data.bus),
      latency: data.latency,
      voltage: data.voltage,
      led: data.led,
      ramTechnology: data.ramTechnology,
    });

    try {
      setIsSubmitting(true);
      const res = await dispatch(updateRam(body));
      unwrapResult(res);
      const d = res?.payload?.data;
      if (d?.code !== 201) return toast.error(d?.message);
      await toast.success("Cập nhật sản phẩm thành công ");
      await dispatch(getRams(""));
      await navigate(path.ram);
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
    setValue("ram", ram?.productInfo?.lstProductTypeAndPrice[0]?.ram);
    setValue("accessories", ram?.productInfo?.accessories);
    setValue("mass", ram?.productInfo?.mass.toString());
    setValue(
      "color",
      ram?.productInfo.lstProductTypeAndPrice[0].color.toString()
    );
    setValue("monitor", ram?.monitor);
    setValue("description", ram?.productInfo?.description);
    setValue("brand", ram?.productInfo?.brandId.toString());
    setValue("characteristic", ram?.productInfo?.characteristicId.toString());
    setValue("name", ram?.productInfo?.name);
    setValue(
      "salePrice",
      ram?.productInfo?.lstProductTypeAndPrice[0].salePrice.toString()
    );
    setValue(
      "price",
      ram?.productInfo?.lstProductTypeAndPrice[0].price.toString()
    );
    setValue("operatingSystem", ram?.operatingSystem);
    setValue("design", ram?.productInfo?.design);
    setValue("dimension", ram?.productInfo?.dimension);
    setValue("category", ram?.productInfo?.categoryId.toString());
    setValue("launchTime", "2023");
    setValue("imageUrl", ram?.productInfo.lstProductImageUrl);
    setValue("model", ram?.model);
    setValue("bus", ram?.bus);
    setValue("capacity", ram?.capacity);
    setValue("ramType", ram?.ramType);
    setValue("latency", ram?.latency);
    setValue("voltage", ram?.voltage);
    setValue("led", ram?.led);
    setValue("ramTechnology", ram?.ramTechnology);
  };
  const avatar = watch("imageUrl");
  const handleChangeFile = (file?: File[]) => {
    setFile(file);
  };

  return (
    <div className="bg-white shadow ">
      <h2 className="font-bold m-4 text-2xl">Cập nhật sản phẩm thành công</h2>
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
            defaultValue={""}
            options={brand}
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
                    options={depot}
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

        <Form.Item label="Loại ram" name="ramType" rules={[{ required: true }]}>
          <Input
            name="ramType"
            register={register}
            type="text"
            className=""
            errorMessage={errors.ramType?.message}
            placeholder=""
          />
        </Form.Item>
        <Form.Item label="Kiểu" name="model" rules={[{ required: true }]}>
          <Input
            name="model"
            register={register}
            type="text"
            className=""
            errorMessage={errors.model?.message}
            placeholder=""
          />
        </Form.Item>
        <Form.Item
          label="Dung tích"
          name="capacity"
          rules={[{ required: true }]}
        >
          <Input
            name="capacity"
            register={register}
            type="text"
            className=""
            errorMessage={errors.capacity?.message}
            placeholder=""
          />
        </Form.Item>
        <Form.Item label="Bus" name="bus" rules={[{ required: true }]}>
          <Input
            name="bus"
            register={register}
            type="text"
            className=""
            errorMessage={errors.bus?.message}
            placeholder=""
          />
        </Form.Item>
        <Form.Item label="Độ trễ" name="latency" rules={[{ required: true }]}>
          <Input
            name="latency"
            register={register}
            type="text"
            className=""
            errorMessage={errors.latency?.message}
            placeholder=""
          />
        </Form.Item>
        <Form.Item label="Vol" name="voltage" rules={[{ required: true }]}>
          <Input
            name="voltage"
            register={register}
            type="text"
            className=""
            errorMessage={errors.voltage?.message}
            placeholder=""
          />
        </Form.Item>
        <Form.Item label="Led" name="led" rules={[{ required: true }]}>
          <Input
            name="led"
            register={register}
            type="text"
            className=""
            errorMessage={errors.led?.message}
            placeholder=""
          />
        </Form.Item>

        <Form.Item
          label="Công nghệ"
          name="ramTechnology"
          rules={[{ required: true }]}
        >
          <Input
            name="ramTechnology"
            register={register}
            type="text"
            className=""
            errorMessage={errors.ramTechnology?.message}
            placeholder=""
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
            <InputFile label="" onChange={handleChangeFile} id="images" />
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

export default () => <NewRam />;
