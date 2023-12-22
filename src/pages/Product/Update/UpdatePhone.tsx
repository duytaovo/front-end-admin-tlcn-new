import { yupResolver } from "@hookform/resolvers/yup";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Form, Modal } from "antd";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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
import InputNumber from "src/components/InputNumber";

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

  monitor: string;
}

const UpdatePhone: React.FC = () => {
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
    reset,
    register,
    setValue,
    control,
    trigger,
    watch,
    getValues,
  } = useForm({
    defaultValues: {
      "lstProductTypeAndPrice.0.price": "",
      "lstProductTypeAndPrice.1.price": "",
      "lstProductTypeAndPrice.2.price": "",
      "lstProductTypeAndPrice.3.price": "",
      "lstProductTypeAndPrice.0.salePrice": "",
      "lstProductTypeAndPrice.1.salePrice": "",
      "lstProductTypeAndPrice.2.salePrice": "",
      "lstProductTypeAndPrice.3.salePrice": "",
    },
    resolver: yupResolver(schemaProductSmartPhone),
  });
  const lstProductTypeAndPriceErrors = errors.lstProductTypeAndPrice ?? [];

  const [imageUrls, setImages] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
    },
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
    // imageUrls.push(imageUrl);
  }

  useEffect(() => {
    setImages(smartPhoneDetail?.productInfo?.lstProductImageUrl);

    const productInfo = smartPhoneDetail?.productInfo;

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
    setValue("accessories", smartPhoneDetail?.productInfo?.accessories);
    setValue("battery", smartPhoneDetail?.battery);
    setValue("charging", smartPhoneDetail?.charging);
    setValue("chip", smartPhoneDetail?.chip);
    setValue("mass", smartPhoneDetail?.productInfo?.mass.toString());
    setValue(
      "color",
      smartPhoneDetail?.productInfo.lstProductTypeAndPrice[0].color.toString(),
    );
    setValue("monitor", smartPhoneDetail?.monitor);
    setValue("networkSupport", smartPhoneDetail?.networkSupport);
    setValue("description", smartPhoneDetail?.productInfo?.description);
    setValue("brand", smartPhoneDetail?.productInfo?.brandId.toString());
    setValue(
      "characteristic",
      smartPhoneDetail?.productInfo?.characteristicId.toString(),
    );
    setValue("name", smartPhoneDetail?.productInfo?.name);
    setValue("sim", smartPhoneDetail?.sim);
    setValue("rearCamera", smartPhoneDetail?.rearCamera);

    setValue("frontCamera", smartPhoneDetail?.frontCamera);
    setValue("operatingSystem", smartPhoneDetail?.operatingSystem);
    setValue("design", smartPhoneDetail?.productInfo?.design);
    setValue("dimension", smartPhoneDetail?.productInfo?.dimension);
    setValue("category", smartPhoneDetail?.productInfo?.categoryId.toString());
    setValue("launchTime", 2023);
    setValue("files", smartPhoneDetail?.productInfo.lstProductImageUrl);
  }, [smartPhoneDetail]);
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
        categoryId: 1,
        productId: Number(smartPhoneDetail.productInfo.productId),
        characteristicId: Number(data.characteristic),
        productCode: smartPhoneDetail.productInfo.productCode,
        name: data.name,
        description: data?.description,
        design: data?.design,
        dimension: data?.dimension,
        mass: Number(data?.mass),
        launchTime: Number(data?.launchTime),
        accessories: data?.accessories,
        productStatus: 100,
        lstProductTypeAndPrice: data?.lstProductTypeAndPrice?.map(
          (item, index) => ({
            typeId: Number(
              smartPhoneDetail?.productInfo?.lstProductTypeAndPrice[index]
                ?.typeId,
            ),
            ram: item?.ram,
            storageCapacity: item?.storageCapacity,
            color: item?.color,
            price: Number(item?.price),
            salePrice:
              (Number(item?.salePrice) > 0 && Number(item?.salePrice)) ||
              Number(item?.price),
            quantity: Number(item?.quantity),
            depotId: Number(item?.depot),
          }),
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
      const bodyGet = {
        slug: "smartphone",
        brandId: null,
        characteristicId: null,
        priceFrom: null,
        priceTo: null,
        specialFeatures: [],
        smartphoneType: [],
        ram: [],
        storageCapacity: [],
        charging: [],
        screen: [],
      };
      const res = await dispatch(updateSmartPhone({ id, body }));
      unwrapResult(res);
      const d = res?.payload?.data;
      // if (d?.code !== 200) return toast.error(d?.message);
      await toast.success("Chỉnh sửa thành công ");
      await dispatch(
        getSmartPhones({
          body: bodyGet,
          // params: { pageNumber: 1, pageSize: 10 },
        }),
      );
      await navigate(path.smartPhone);
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
      handleOk();
    }
  });
  const onClickHuy = () => {
    setImages(smartPhoneDetail?.productInfo?.lstProductImageUrl);

    const productInfo = smartPhoneDetail?.productInfo;

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
    setValue("accessories", smartPhoneDetail?.productInfo?.accessories);
    setValue("battery", smartPhoneDetail?.battery);
    setValue("charging", smartPhoneDetail?.charging);
    setValue("chip", smartPhoneDetail?.chip);
    setValue("mass", smartPhoneDetail?.productInfo?.mass.toString());
    setValue(
      "color",
      smartPhoneDetail?.productInfo.lstProductTypeAndPrice[0].color.toString(),
    );
    setValue("monitor", smartPhoneDetail?.monitor);
    setValue("networkSupport", smartPhoneDetail?.networkSupport);
    setValue("description", smartPhoneDetail?.productInfo?.description);
    setValue("brand", smartPhoneDetail?.productInfo?.brandId.toString());
    setValue(
      "characteristic",
      smartPhoneDetail?.productInfo?.characteristicId.toString(),
    );
    setValue("name", smartPhoneDetail?.productInfo?.name);
    setValue("sim", smartPhoneDetail?.sim);
    setValue("frontCamera", smartPhoneDetail?.frontCamera);
    setValue("rearCamera", smartPhoneDetail?.rearCamera);
    setValue("operatingSystem", smartPhoneDetail?.operatingSystem);
    setValue("design", smartPhoneDetail?.productInfo?.design);
    setValue("dimension", smartPhoneDetail?.productInfo?.dimension);
    setValue("category", smartPhoneDetail?.productInfo?.categoryId.toString());
    setValue("launchTime", 2023);
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
        initialValues={{ smartPhoneDetail }}
      >
        <Form.Item
          label="Hãng sản xuất"
          name="brand"
          rules={[{ required: true }]}
        >
          <SelectCustom
            className={"flex-1 text-black"}
            id="brand"
            placeholder="Vui lòng chọn"
            defaultValue={smartPhoneDetail?.productInfo?.brandId}
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
          <Input
            name="operatingSystem"
            register={register}
            type="text"
            className=""
            errorMessage={errors.operatingSystem?.message}
            placeholder="iOS"
          />
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
              (item, index) => {
                return (
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
                        />
                      </Form.Item>
                    </div>
                    <div className="flex justify-between space-x-1">
                      <Form.Item
                        label="Giá (Nhập số)"
                        name={`lstProductTypeAndPrice.${index}.price`}
                        rules={[{ required: true }]}
                      >
                        <Controller
                          control={control}
                          name={`lstProductTypeAndPrice.${index}.price`}
                          render={({ field }) => {
                            return (
                              <InputNumber
                                type="text"
                                className="grow"
                                placeholder="4000000"
                                classNameInput="p-3 w-full text-black outline-none border border-gray-300 focus:border-gray-500 rounded focus:shadow-sm"
                                classNameError="hidden"
                                {...field}
                                onChange={(event) => {
                                  field.onChange(event);
                                  trigger(
                                    `lstProductTypeAndPrice.${index}.salePrice`,
                                  );
                                }}
                              />
                            );
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Giá khuyến mãi (Nhập số)"
                        name={`lstProductTypeAndPrice.${index}.salePrice`}
                        rules={[{ required: true }]}
                      >
                        <Controller
                          control={control}
                          name={`lstProductTypeAndPrice.${index}.salePrice`}
                          render={({ field }) => {
                            return (
                              <InputNumber
                                type="text"
                                className="grow"
                                placeholder="3800000"
                                classNameInput="p-3 w-full text-black outline-none border border-gray-300 focus:border-gray-500 rounded focus:shadow-sm"
                                classNameError="hidden"
                                {...field}
                                onChange={(event) => {
                                  field.onChange(event);
                                  trigger(
                                    `lstProductTypeAndPrice.${index}.price`,
                                  );
                                }}
                              />
                            );
                          }}
                        />
                      </Form.Item>
                    </div>
                    <div className="left-0 min-h-[1.25rem] text-center text-base text-red-600">
                      {(
                        lstProductTypeAndPriceErrors[index] as {
                          price?: { message?: string };
                        }
                      )?.price?.message ?? ""}
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
              {imageUrls?.map((imageUrl, index) => {
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
            <InputFile
              label="Upload ảnh"
              onChange={handleChangeFile}
              id="images"
            />
            <button
              className="text-red-500 border-red-300 border w-20 p-3 mt-3"
              type="button"
              onClick={() => {
                setFile([]);
                setImages([]);
              }}
            >
              Xoá
            </button>
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

export default () => <UpdatePhone />;

