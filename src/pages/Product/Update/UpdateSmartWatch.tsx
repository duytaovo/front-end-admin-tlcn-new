import { yupResolver } from "@hookform/resolvers/yup";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Form, Modal, Space, Upload } from "antd";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "src/components/Input";
import path from "src/constants/path";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { ErrorResponse } from "src/types/utils.type";
import { schemaProductSmartWatch } from "src/utils/rules";
import {
  generateRandomString,
  getIdFromNameId,
  isAxiosUnprocessableEntityError,
} from "src/utils/utils";
import SelectCustom from "src/components/Select";

import Textarea from "src/components/Textarea";
import { getCategorys } from "src/store/category/categorySlice";
import {
  getDetailPhone,
  uploadManyImagesProductSmartPhone,
} from "src/store/product/smartPhoneSlice";
import InputFile from "src/components/InputFile";
import { PlusOutlined } from "@ant-design/icons";
import { getCharacters } from "src/store/characteristic/characteristicSlice";
import { getBrands } from "src/store/brand/brandSlice";
import { getdepots } from "src/store/depot/depotSlice";
import {
  getDetailSmartWatch,
  getSmartWatch,
  updateSmartWatch,
} from "src/store/product/smartwatchSlice";

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

interface FormData {
  brand: string;
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

const UpdateSmartWatch: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const {
    handleSubmit,
    formState: { errors },
    setError,
    register,
    setValue,
    watch,
    control,
    getValues,
  } = useForm({
    resolver: yupResolver(schemaProductSmartWatch),
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { category } = useAppSelector((state) => state.category);
  const { nameId } = useParams();
  const id = getIdFromNameId(nameId as string);
  const { smartWatchDetail } = useAppSelector((state) => state.smartWatch);
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
    dispatch(getDetailSmartWatch(id));
  }, [id]);

  const [file, setFile] = useState<File[]>();
  const imageArray = file || []; // Mảng chứa các đối tượng ảnh (File hoặc Blob)
  const [imageUrls, setImages] = useState<string[]>([]);

  // Tạo một mảng chứa các URL tạm thời cho ảnh

  for (const image of imageArray) {
    const imageUrl = URL.createObjectURL(image);
    imageUrls.push(imageUrl);
  }
  useEffect(() => {
    setImages(smartWatchDetail.productInfo.lstProductImageUrl);

    const productInfo = smartWatchDetail?.productInfo;

    if (
      productInfo?.lstProductTypeAndPrice &&
      Array.isArray(productInfo.lstProductTypeAndPrice)
    ) {
      // Define the fields you want to set dynamically
      const fields = [
        "ram",
        "storageCapacity",
        "color",
        "price",
        "salePrice",
        "quantity",
        "depot",
      ];

      // Loop through the array and set values dynamically
      productInfo.lstProductTypeAndPrice.forEach(
        (product: any, index: number) => {
          fields.forEach((field) => {
            const fieldName: any = `lstProductTypeAndPrice.${index}.${field}`;
            const fieldValue = product[field];

            // Check if the field value is defined before setting it
            if (fieldValue !== undefined) {
              setValue(fieldName, fieldValue);
            }
          });
        },
      );
    }
    setValue("accessories", smartWatchDetail?.productInfo?.accessories);
    setValue("battery", smartWatchDetail?.battery);
    setValue("charging", smartWatchDetail?.charging);
    setValue("chip", smartWatchDetail?.chip);
    setValue("mass", smartWatchDetail?.productInfo?.mass.toString());
    setValue(
      "color",
      smartWatchDetail?.productInfo.lstProductTypeAndPrice[0].color.toString(),
    );
    setValue("monitor", smartWatchDetail?.monitor);
    setValue("networkSupport", smartWatchDetail?.networkSupport);
    setValue("description", smartWatchDetail?.productInfo?.description);
    setValue("brand", smartWatchDetail?.productInfo?.brandId.toString());
    setValue(
      "characteristic",
      smartWatchDetail?.productInfo?.characteristicId.toString(),
    );
    setValue("name", smartWatchDetail?.productInfo?.name);
    setValue("internalMemory", smartWatchDetail?.internalMemory);
    setValue(
      "salePrice",
      smartWatchDetail?.productInfo?.lstProductTypeAndPrice[0].salePrice.toString(),
    );
    setValue("health", smartWatchDetail?.health);
    setValue(
      "price",
      smartWatchDetail?.productInfo?.lstProductTypeAndPrice[0].price.toString(),
    );
    setValue("connectToOs", smartWatchDetail?.connectToOs);
    setValue("monitor", smartWatchDetail?.monitor);
    setValue("battery", smartWatchDetail?.battery);
    setValue("connector", smartWatchDetail?.connector);
    setValue("cpu", smartWatchDetail?.cpu);
    setValue("internalMemory", smartWatchDetail?.internalMemory);
    setValue("design", smartWatchDetail?.productInfo?.design);
    setValue("dimension", smartWatchDetail?.productInfo?.dimension);
    setValue("launchTime", "2023");
    setValue("imageUrl", smartWatchDetail?.productInfo.lstProductImageUrl);
  }, [smartWatchDetail]);

  const onSubmit = handleSubmit(async (data) => {
    let images = [];
    showModal();
    setIsSubmitting(true);
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
        brandId: Number(data.brand),
        categoryId: 28,
        productId: Number(smartWatchDetail.productInfo.productId),
        characteristicId: Number(data.characteristic),
        productCode: smartWatchDetail.productInfo.productCode,
        name: data.name,
        description: data?.description,
        design: data?.design,
        dimension: data?.dimension,
        mass: Number(data?.mass),
        launchTime: Number(data?.launchTime),
        accessories: data?.accessories,
        productStatus: 100,
        lstProductTypeAndPrice: data?.lstProductTypeAndPrice?.map((item) => ({
          typeId: null,
          color: item?.color,
          price: Number(item?.price),
          salePrice: Number(item?.salePrice),
          quantity: Number(item?.quantity),
          depotId: Number(item?.depot),
        })),

        lstProductImageUrl: images || [],
      },
      monitor: data.monitor,
      connector: data.connector,
      health: data.health,
      cpu: data.cpu,
      internalMemory: data.internalMemory,
      battery: data.battery,
      connectToOs: data.connectToOs,
      operatingSystem: "watch",
    });

    try {
      setIsSubmitting(true);
      const res = await dispatch(updateSmartWatch({ id, body }));
      unwrapResult(res);
      const d = res?.payload?.data;
      // if (d?.code !== 200) return toast.error(d?.message);
      await toast.success("Chỉnh sửa thành công ");
      await dispatch(getSmartWatch(""));
      await navigate(path.smartWatch);
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
    setImages(smartWatchDetail.productInfo.lstProductImageUrl);

    const productInfo = smartWatchDetail?.productInfo;

    if (
      productInfo?.lstProductTypeAndPrice &&
      Array.isArray(productInfo.lstProductTypeAndPrice)
    ) {
      // Define the fields you want to set dynamically
      const fields = [
        "ram",
        "storageCapacity",
        "color",
        "price",
        "salePrice",
        "quantity",
        "depot",
      ];

      // Loop through the array and set values dynamically
      productInfo.lstProductTypeAndPrice.forEach(
        (product: any, index: number) => {
          fields.forEach((field) => {
            const fieldName: any = `lstProductTypeAndPrice.${index}.${field}`;
            const fieldValue = product[field];

            // Check if the field value is defined before setting it
            if (fieldValue !== undefined) {
              setValue(fieldName, fieldValue);
            }
          });
        },
      );
    }
    setValue("accessories", smartWatchDetail?.productInfo?.accessories);
    setValue("battery", smartWatchDetail?.battery);
    setValue("charging", smartWatchDetail?.charging);
    setValue("chip", smartWatchDetail?.chip);
    setValue("mass", smartWatchDetail?.productInfo?.mass.toString());
    setValue(
      "color",
      smartWatchDetail?.productInfo.lstProductTypeAndPrice[0].color.toString(),
    );
    setValue("monitor", smartWatchDetail?.monitor);
    setValue("networkSupport", smartWatchDetail?.networkSupport);
    setValue("description", smartWatchDetail?.productInfo?.description);
    setValue("brand", smartWatchDetail?.productInfo?.brandId.toString());
    setValue(
      "characteristic",
      smartWatchDetail?.productInfo?.characteristicId.toString(),
    );
    setValue("name", smartWatchDetail?.productInfo?.name);
    setValue("internalMemory", smartWatchDetail?.internalMemory);
    setValue(
      "salePrice",
      smartWatchDetail?.productInfo?.lstProductTypeAndPrice[0].salePrice.toString(),
    );
    setValue("health", smartWatchDetail?.health);
    setValue(
      "price",
      smartWatchDetail?.productInfo?.lstProductTypeAndPrice[0].price.toString(),
    );
    setValue("connectToOs", smartWatchDetail?.connectToOs);
    setValue("monitor", smartWatchDetail?.monitor);
    setValue("battery", smartWatchDetail?.battery);
    setValue("connector", smartWatchDetail?.connector);
    setValue("internalMemory", smartWatchDetail?.internalMemory);
    setValue("design", smartWatchDetail?.productInfo?.design);
    setValue("dimension", smartWatchDetail?.productInfo?.dimension);
    setValue("launchTime", "2023");
    setValue("imageUrl", smartWatchDetail?.productInfo.lstProductImageUrl);
  };
  const avatar = watch("imageUrl");
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
      <h2 className="font-bold m-4 text-2xl">Cập nhật sản phẩm smartwatch</h2>
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
          label="Hãng sản xuất"
          name="brand"
          rules={[{ required: true }]}
        >
          <SelectCustom
            className={"flex-1 text-black  "}
            id="brand"
            placeholder="Vui lòng chọn"
            defaultValue={smartWatchDetail?.productInfo?.brandId}
            options={brand?.data?.data}
            register={register}
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
            placeholder="Vui lòng chọn"
            options={character?.data}
            register={register}
            defaultValue={smartWatchDetail?.productInfo?.characteristicId}
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
            placeholder=""
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
            {smartWatchDetail?.productInfo?.lstProductTypeAndPrice?.map(
              (item: any, index: number) => {
                return (
                  <li key={index}>
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
                        placeholder="Vui lòng chọn"
                        defaultValue={item.depotId}
                        options={depot?.data?.data}
                        register={register}
                      >
                        {errors.depotId?.message}
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
                );
              },
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
          name="health"
          rules={[{ required: true }]}
        >
          <Input
            name="health"
            register={register}
            type="text"
            className=""
            errorMessage={errors.health?.message}
            placeholder="12 MP"
          />
        </Form.Item>
        <Form.Item
          label="Cổng kết nối"
          name="connector"
          rules={[{ required: true }]}
        >
          <Input
            name="connector"
            register={register}
            type="text"
            className=""
            errorMessage={errors.connector?.message}
            placeholder="Chính 48 MP & Phụ 12 MP, 12 MP"
          />
        </Form.Item>
        <Form.Item label="Cpu" name="cpu" rules={[{ required: true }]}>
          <Input
            name="cpu"
            register={register}
            type="text"
            className=""
            errorMessage={errors.cpu?.message}
            placeholder=""
          />
        </Form.Item>
        <Form.Item
          label="Bộ nhớ trong"
          name="internalMemory"
          rules={[{ required: true }]}
        >
          <Input
            name="internalMemory"
            register={register}
            type="text"
            className=""
            errorMessage={errors.internalMemory?.message}
            placeholder="1 Nano internalMemory & 1 einternalMemory"
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
          label="Kết nối hệ điều hành"
          name="connectToOs"
          rules={[{ required: true }]}
        >
          <Input
            name="connectToOs"
            register={register}
            type="text"
            className=""
            errorMessage={errors.connectToOs?.message}
            placeholder=""
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
                navigate(path.smartWatch);
              }}
            >
              Hủy
            </Button>
          </Form.Item>
        </div>
      </Form>
      <Modal
        title="Cập nhật sản phẩm"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <p>Đang xử lý, vui lòng đợi...</p>
      </Modal>
    </div>
  );
};

export default () => <UpdateSmartWatch />;

