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
import { schemaMicrophone, schemaProductSmartPhone } from "src/utils/rules";
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
import { getDetailMicrophone } from "src/store/accessory/microphone";

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
}

const UpdateMicrophone: React.FC = () => {
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
    resolver: yupResolver(schemaMicrophone),
  });
  const [imageUrls, setImages] = useState<string[]>([]);
  const [data, setData] = useState<any>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { category } = useAppSelector((state) => state.category);
  const { nameId } = useParams();
  const id = getIdFromNameId(nameId as string);
  // const { brand } = useAppSelector((state) => state.brand);
  const { microphoneDetail } = useAppSelector((state) => state.microphone);
  const { character } = useAppSelector((state) => state.character);
  const { depot } = useAppSelector((state) => state.depot);
  const { brand } = useAppSelector((state) => state.brand);
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "lstProductTypeAndPrice", // unique name for your Field Array
    },
  );
  useEffect(() => {
    dispatch(getCategorys({ pageSize: 100 }));
    dispatch(getCharacters({ pageSize: 100 }));
    dispatch(getBrands({ pageSize: 100 }));
    dispatch(getdepots({ pageSize: 100 }));
  }, []);

  useEffect(() => {
    dispatch(getDetailMicrophone(id));
  }, [id]);

  const [file, setFile] = useState<File[]>();
  const imageArray = file || []; // Mảng chứa các đối tượng ảnh (File hoặc Blob)

  // Tạo một mảng chứa các URL tạm thời cho ảnh

  for (const image of imageArray) {
    const imageUrl = URL.createObjectURL(image);
    imageUrls.push(imageUrl);
  }

  useEffect(() => {
    setImages(microphoneDetail.productInfo.lstProductImageUrl);

    setValue(
      "ram",
      microphoneDetail?.productInfo?.lstProductTypeAndPrice[0]?.ram,
    );
    setValue("accessories", microphoneDetail?.productInfo?.accessories);
    setValue("compatible", microphoneDetail?.compatible);
    setValue("jack", microphoneDetail?.jack);
    setValue("feature", microphoneDetail?.feature);
    setValue("mass", microphoneDetail?.productInfo?.mass.toString());
    setValue(
      "color",
      microphoneDetail?.productInfo.lstProductTypeAndPrice[0].color.toString(),
    );
    setValue("control", microphoneDetail?.control);
    setValue("description", microphoneDetail?.productInfo?.description);
    setValue("brand", microphoneDetail?.productInfo?.brandId.toString());
    setValue(
      "characteristic",
      microphoneDetail?.productInfo?.characteristicId.toString(),
    );
    setValue("name", microphoneDetail?.productInfo?.name);
    setValue(
      "salePrice",
      microphoneDetail?.productInfo?.lstProductTypeAndPrice[0].salePrice.toString(),
    );
    setValue(
      "price",
      microphoneDetail?.productInfo?.lstProductTypeAndPrice[0].price.toString(),
    );
    setValue("design", microphoneDetail?.productInfo?.design);
    setValue("dimension", microphoneDetail?.productInfo?.dimension);
    setValue("category", microphoneDetail?.productInfo?.categoryId.toString());
    setValue("launchTime", "2023");
  }, [microphoneDetail]);
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
        categoryId: 1,
        productId: Number(microphoneDetail.productInfo.productId),
        characteristicId: Number(data.characteristic) || 1,
        productCode: microphoneDetail.productInfo.productCode,
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
              microphoneDetail?.productInfo?.lstProductTypeAndPrice[index]
                .typeId,
            ),
            ram: item?.ram,
            storageCapacity: item?.storageCapacity,
            color: item?.color,
            price: Number(item?.price),
            salePrice: Number(item?.salePrice),
            quantity: Number(item?.quantity),
            depotId: Number(item?.depotId),
          }),
        ),

        lstProductImageUrl: images || [],
      },
      microphoneType: true,
      compatible: data.compatible,
      jack: data.jack,
      feature: data.feature,
      control: data.control,
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
    setImages(microphoneDetail.productInfo.lstProductImageUrl);

    setValue(
      "ram",
      microphoneDetail?.productInfo?.lstProductTypeAndPrice[0]?.ram,
    );
    setValue("accessories", microphoneDetail?.productInfo?.accessories);
    setValue("compatible", microphoneDetail?.compatible);
    setValue("jack", microphoneDetail?.jack);
    setValue("feature", microphoneDetail?.feature);
    setValue("mass", microphoneDetail?.productInfo?.mass.toString());
    setValue(
      "color",
      microphoneDetail?.productInfo.lstProductTypeAndPrice[0].color.toString(),
    );
    setValue("control", microphoneDetail?.control);
    setValue("description", microphoneDetail?.productInfo?.description);
    setValue("brand", microphoneDetail?.productInfo?.brandId.toString());
    setValue(
      "characteristic",
      microphoneDetail?.productInfo?.characteristicId.toString(),
    );
    setValue("name", microphoneDetail?.productInfo?.name);
    setValue(
      "salePrice",
      microphoneDetail?.productInfo?.lstProductTypeAndPrice[0].salePrice.toString(),
    );
    setValue(
      "price",
      microphoneDetail?.productInfo?.lstProductTypeAndPrice[0].price.toString(),
    );
    setValue("design", microphoneDetail?.productInfo?.design);
    setValue("dimension", microphoneDetail?.productInfo?.dimension);
    setValue("category", microphoneDetail?.productInfo?.categoryId.toString());
    setValue("launchTime", "2023");
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
      <h2 className="font-bold m-4 text-2xl">Cập nhật sản phẩm </h2>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600, padding: 6 }}
        autoComplete="off"
        noValidate
        onSubmitCapture={onSubmit}
      >
        <Form.Item
          label="Hãng sản xuất"
          name="brand"
          rules={[{ required: true }]}
        >
          <SelectCustom
            className={"flex-1 text-black  "}
            id="brand"
            // label="Hãng xe"
            placeholder="Chọn hãng sx"
            defaultValue={""}
            options={brand?.data?.data}
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
            id="characteristic"
            // label="Hãng xe"
            placeholder="Chọn đặc điểm "
            defaultValue={""}
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
                    placeholder="Chọn kho hàng"
                    options={depot?.data?.data}
                    register={register}
                  >
                    {errors.depotId?.message}
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

        <Form.Item
          label="Tính năng"
          name="feature"
          rules={[{ required: true }]}
        >
          <Input
            name="feature"
            register={register}
            type="text"
            className=""
            errorMessage={errors.feature?.message}
            placeholder="12 MP"
          />
        </Form.Item>
        <Form.Item label="Giắc cắm" name="jack" rules={[{ required: true }]}>
          <Input
            name="jack"
            register={register}
            type="text"
            className=""
            errorMessage={errors.jack?.message}
            placeholder="Chính 48 MP & Phụ 12 MP, 12 MP"
          />
        </Form.Item>

        <Form.Item
          label="Điều khiển"
          name="control"
          rules={[{ required: true }]}
        >
          <Input
            name="control"
            register={register}
            type="text"
            className=""
            errorMessage={errors.control?.message}
            placeholder="1 Nano SIM & 1 eSIM"
          />
        </Form.Item>

        <Form.Item
          name="files"
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
              {isSubmitting ? "Loading..." : "Lưu"}
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

export default () => <UpdateMicrophone />;

