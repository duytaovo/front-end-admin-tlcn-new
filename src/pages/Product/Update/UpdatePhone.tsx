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
import { schemaProductSmartPhone } from "src/utils/rules";
import {
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
  uploadManyImagesProductSmartPhone,
} from "src/store/product/smartPhoneSlice";
import InputFile from "src/components/InputFile";
import { PlusOutlined } from "@ant-design/icons";
import { getCharacters } from "src/store/characteristic/characteristicSlice";
import { getBrands } from "src/store/brand/brandSlice";
import { getdepots } from "src/store/depot/depotSlice";

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

const UpdatePhone: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    setError,
    register,
    setValue,
    getValues,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(schemaProductSmartPhone),
  });
  const [imageUrls, setImages] = useState<string[]>([]);
  const [data, setData] = useState<any>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { category } = useAppSelector((state) => state.category);
  const { nameId } = useParams();
  const id = getIdFromNameId(nameId as string);
  // const { brand } = useAppSelector((state) => state.brand);
  const { smartPhoneDetail } = useAppSelector((state) => state.smartPhone);
  const { character } = useAppSelector((state) => state.character);
  const { depot } = useAppSelector((state) => state.depot);
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
  }, []);

  useEffect(() => {
    dispatch(getDetailPhone(id));
  }, [id]);

  const [file, setFile] = useState<File[]>();
  const imageArray = file || []; // Mảng chứa các đối tượng ảnh (File hoặc Blob)

  // Tạo một mảng chứa các URL tạm thời cho ảnh

  for (const image of imageArray) {
    const imageUrl = URL.createObjectURL(image);
    imageUrls.push(imageUrl);
  }

  useEffect(() => {
    setImages(smartPhoneDetail.productInfo.lstProductImageUrl);

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
    setValue("files", smartPhoneDetail?.productInfo.lstProductImageUrl);
  }, [smartPhoneDetail]);
  console.log(file);
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
    }
    const body = JSON.stringify({
      productInfo: {
        brandId: Number(data.brand) || 1,
        categoryId: Number(data.category) || 1,
        productId: Number(smartPhoneDetail.productInfo.productId),
        characteristicId: Number(data.characteristic) || 1,
        productCode: smartPhoneDetail.productInfo.productCode,
        name: data.name,
        description: data?.description,
        design: data?.design,
        dimension: data?.dimension,
        mass: Number(data?.mass),
        launchTime: 2023,
        accessories: data?.accessories,
        productStatus: 100,
        lstProductTypeAndPrice: data?.lstProductTypeAndPrice?.map(
          (item, index) => ({
            typeId: Number(
              smartPhoneDetail?.productInfo?.lstProductTypeAndPrice[index]
                .typeId
            ),
            ram: item?.ram,
            storageCapacity: item?.storageCapacity,
            color: item?.color,
            price: Number(item?.price),
            salePrice: Number(item?.salePrice),
            quantity: Number(item?.quantity),
            depotId: Number(item?.depot) || 1,
          })
        ),

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
      const res = await dispatch(updateSmartPhone({ id, body }));
      unwrapResult(res);
      const d = res?.payload?.data;
      if (d?.code !== 200) return toast.error(d?.message);
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
    setValue("files", smartPhoneDetail?.productInfo.lstProductImageUrl);
  };

  const handleChangeFile = (file?: File[]) => {
    setFile(file);
  };

  const handleEditImage = (index: number) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.addEventListener("change", (event) => {
      const selectedFile = (event.target as HTMLInputElement).files?.[0];

      if (selectedFile) {
        const currentImages = getValues("files") || [];
        currentImages[index] = selectedFile;
        setValue("files", currentImages);

        // Update the image preview immediately
        setImages((prevImages) => {
          const updatedImages = [...prevImages];
          updatedImages[index] = URL.createObjectURL(selectedFile);
          return updatedImages;
        });
      }
    });

    fileInput.click();
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
            options={category?.data}
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
            options={brand?.data?.data}
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
            defaultValue={smartPhoneDetail?.operatingSystem}
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
            defaultValue={smartPhoneDetail?.productInfo?.characteristicId}
            options={character?.data}
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
            {smartPhoneDetail?.productInfo?.lstProductTypeAndPrice?.map(
              (item, index) => (
                <li key={index}>
                  <div className="flex justify-between space-x-1">
                    <Form.Item
                      label="Ram"
                      name={`lstProductTypeAndPrice.${index}.ram`}
                      rules={[{ required: true }]}
                    >
                      <Input
                        name={`lstProductTypeAndPrice.${index}.ram`}
                        key={index} // important to include key with field's id
                        register={register}
                        placeholder="8Gb"
                        defaultValue={item.ram}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Bộ nhớ trong"
                      name={`lstProductTypeAndPrice.${index}.storageCapacity`}
                      rules={[{ required: true }]}
                    >
                      <Input
                        name={`lstProductTypeAndPrice.${index}.storageCapacity`}
                        key={index} // important to include key with field's id
                        register={register}
                        placeholder="1TB"
                        defaultValue={item.storageCapacity}
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
                        key={index} // important to include key with field's id
                        register={register}
                        placeholder="45000000"
                        defaultValue={item.price}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Giá khuyến mãi"
                      name={`lstProductTypeAndPrice.${index}.salePrice`}
                      rules={[{ required: true }]}
                    >
                      <Input
                        name={`lstProductTypeAndPrice.${index}.salePrice`}
                        key={index} // important to include key with field's id
                        register={register}
                        placeholder="44000000"
                        defaultValue={item.salePrice}
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
                      defaultValue={item.depotId}
                      options={depot?.data?.data}
                      register={register}
                    >
                      {errors.depot?.message}
                    </SelectCustom>
                  </Form.Item>
                  <div>
                    <Form.Item
                      label="Số lượng sản phẩm"
                      name={`lstProductTypeAndPrice.${index}.quantity`}
                      rules={[{ required: true }]}
                    >
                      <Input
                        name={`lstProductTypeAndPrice.${index}.quantity`}
                        key={index} // important to include key with field's id
                        register={register}
                        defaultValue={item.quantity}
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
                        key={index} // important to include key with field's id
                        register={register}
                        defaultValue={item.color}
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
              )
            )}
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
          label="Hình ảnh"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <div className="flex flex-col items-start ">
            <div className="my-5 w-24 space-y-5 justify-between items-center">
              {imageUrls.map((imageUrl, index) => {
                return (
                  <div key={index}>
                    <img
                      src={imageUrl}
                      alt={`Image ${index + 1}`}
                      width="100"
                      height="100"
                      className="h-full rounded-md w-full  object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => handleEditImage(index)}
                    >
                      Edit
                    </button>
                  </div>
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
