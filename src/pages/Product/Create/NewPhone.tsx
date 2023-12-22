import { PlusOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Form, Modal } from "antd";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "src/components/Input";
import path from "src/constants/path";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { ErrorResponse } from "src/types/utils.type";
import { schemaProductSmartPhone } from "src/utils/rules";
import {
  generateRandomString,
  isAxiosUnprocessableEntityError,
} from "src/utils/utils";
import SelectCustom from "src/components/Select";
import Textarea from "src/components/Textarea";
import { getCategorys } from "src/store/category/categorySlice";
import {
  addSmartPhone,
  getSmartPhones,
  uploadManyImagesProductSmartPhone,
} from "src/store/product/smartPhoneSlice";
import InputFile from "src/components/InputFile";
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
  quantity: string;
  depotId: string;
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

const smartPhoneDetail = {
  id: 29,
  monitor: "6.1 - Tần số quét 120 Hz",
  operatingSystem: "iOS",
  rearCamera: "Chính 48 MP & Phụ 12 MP, 12 MP",
  frontCamera: "12 MP",
  chip: "Apple A17 Pro 6 nhân",
  sim: "1 Nano Sim",
  battery: "4442mah",
  charging: "20 W",
  networkSupport: "5G",
  productInfo: {
    brandId: 1,
    categoryId: 1,
    productId: 47,
    characteristicId: 7,
    productCode: "lpFVXdwqmt",
    name: "Điện thoại iPhone 15 Pro 128GBb",
    description:
      '<h3><a href="https://cdn.tgdd.vn/Products/Images/42/299033/iphone-15-pro-131023-034959.jpg" rel="noopener noreferrer" target="_blank" style="color: rgb(47, 128, 237);"><strong><img src="https://cdn.tgdd.vn/Products/Images/42/299033/iphone-15-pro-131023-034959.jpg" alt="iPhone 15 Pro Tổng quan"></strong></a></h3><p><a href="https://cdn.tgdd.vn/Products/Images/42/299033/iphone-15-pro-131023-035001.jpg" rel="noopener noreferrer" target="_blank" style="color: rgb(47, 128, 237);"><img src="https://cdn.tgdd.vn/Products/Images/42/299033/iphone-15-pro-131023-035001.jpg" alt="iPhone 15 Pro Thông số kỹ thuật và tính năng"></a></p><p><br></p><p><a href="https://cdn.tgdd.vn/Products/Images/42/299033/iphone-15-pro-131023-035003.jpg" rel="noopener noreferrer" target="_blank" style="color: rgb(47, 128, 237);"><img src="https://cdn.tgdd.vn/Products/Images/42/299033/iphone-15-pro-131023-035003.jpg" alt="iPhone 15 Pro So sánh"></a></p><p><a href="https://cdn.tgdd.vn/Products/Images/42/299033/iphone-15-pro-131023-035005.jpg" rel="noopener noreferrer" target="_blank" style="color: rgb(47, 128, 237);"><img src="https://cdn.tgdd.vn/Products/Images/42/299033/iphone-15-pro-131023-035005.jpg" alt="iPhone 15 Pro Chuyển đổi"></a></p><p><br></p><p><a href="https://cdn.tgdd.vn/Products/Images/42/299033/iphone-15-pro-131023-035007.jpg" rel="noopener noreferrer" target="_blank" style="color: rgb(21, 94, 193);"><img src="https://cdn.tgdd.vn/Products/Images/42/299033/iphone-15-pro-131023-035007.jpg" alt="iPhone 15 Pro Phụ kiện"></a></p><p><br></p><p><br></p>',
    design: "Nguyên khối",
    dimension: "Dài 146.6 mm - Ngang 70.6 mm - Dày 8.25 mm ",
    mass: 221.0,
    launchTime: 2023,
    accessories: "Tai nghe sạc",
    productStatus: 100,
    lstProductTypeAndPrice: [
      {
        typeId: 12,
        ram: "8GB",
        storageCapacity: "1TB",
        color: "Titan tự nhiên",
        price: 45000001.0,
        salePrice: 44000000.0,
        quantity: 62,
        depotId: 1,
      },
      // {
      //   typeId: 26,
      //   ram: "8GB",
      //   storageCapacity: "512GB",
      //   color: "Đen",
      //   price: 39000000.0,
      //   salePrice: 38000000.0,
      //   quantity: 102,
      //   depotId: 1,
      // },
    ],
    lstProductImageUrl: [
      "https://techstore2023.s3.ap-southeast-1.amazonaws.com/170253658751890bc2ff3-ed52-4112-ac86-26287ac42f28-iphone-15-pro-blue-1.jpg",
      "https://techstore2023.s3.ap-southeast-1.amazonaws.com/1702536591296ee69d153-eb21-4795-82cc-b9105909960f-iphone-15-pro-blue-2.jpg",
      "https://techstore2023.s3.ap-southeast-1.amazonaws.com/1702536591987e7baae4f-cdc6-4dca-891b-6695cad47ad2-iphone-15-pro-blue-3.jpg",
      "https://techstore2023.s3.ap-southeast-1.amazonaws.com/17025365962242ba6780d-7e46-4761-8aca-f6485183bca3-iphone-15-pro-blue-4.jpg",
    ],
    star: 4.9,
    totalReview: 100,
    slug: "smartphone",
  },
};
const NewPhone: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isValueMau, setIsValueMau] = useState(false);

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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { character } = useAppSelector((state) => state.character);
  const { depot } = useAppSelector((state) => state.depot);
  const { brand } = useAppSelector((state) => state.brand);
  useEffect(() => {
    dispatch(getBrands({ slug: "smartphone", pageSize: 100 }));
    dispatch(getCharacters({ categorySlug: "smartphone", pageSize: 100 }));
    dispatch(getCategorys({ pageSize: 100 }));
    dispatch(getdepots({ pageSize: 100 }));
  }, []);

  const [file, setFile] = useState<File[]>();
  const imageArray = file || []; // Mảng chứa các đối tượng ảnh (File hoặc Blob)

  // Tạo một mảng chứa các URL tạm thời cho ảnh
  const [imageUrls, setImages] = useState<string[]>([]);

  for (const image of imageArray) {
    const imageUrl = URL.createObjectURL(image);
    imageUrls.push(imageUrl);
  }
  useEffect(() => {
    reset();
    setIsValueMau(false);
    setImages([]);
  }, []);
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "lstProductTypeAndPrice", // unique name for your Field Array
    },
  );
  const onSubmit = handleSubmit(async (data) => {
    let images = [];
    if (file) {
      showModal();
      setIsSubmitting(true);
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
    try {
      const bodySmartphone = {
        slug: "smartphone",
        brandId: null,
        characteristic: null,
        priceFrom: null,
        priceTo: null,
        specialFeatures: [],
        smartphoneType: [],
        ram: [],
        storageCapacity: [],
        charging: [],
        screen: [],
      };
      const body = JSON.stringify({
        productInfo: {
          brandId: Number(data.brand),
          categoryId: 1,
          productId: null,
          characteristicId: Number(data.characteristic),
          productCode: generateRandomString(10),
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
            ram: item?.ram,
            storageCapacity: item?.storageCapacity,
            color: item?.color,
            price: Number(item?.price),
            salePrice:
              (Number(item?.salePrice) > 0 && Number(item?.salePrice)) ||
              Number(item?.price),
            quantity: Number(item?.quantity),
            depotId: Number(item?.depot),
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

      const res = await dispatch(addSmartPhone(body));
      unwrapResult(res);
      const d = res?.payload?.data;
      if (d?.code !== 200) return toast.error(d?.message);
      await toast.success("Thêm sản phẩm thành công ");
      dispatch(
        getSmartPhones({
          body: bodySmartphone,
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
    setValue("files", []);
    reset();
    setIsValueMau(false);
    setImages([]);
  };
  const handleChangeFile = (file?: File[]) => {
    setFile(file);
  };

  const generateSampleData = () => {
    setIsValueMau(true);

    // setImages(smartPhoneDetail?.productInfo?.lstProductImageUrl);

    // const productInfo = smartPhoneDetail?.productInfo;

    // if (
    //   productInfo?.lstProductTypeAndPrice &&
    //   Array.isArray(productInfo.lstProductTypeAndPrice)
    // ) {
    //   // Define the fields you want to set dynamically
    //   const fields = [
    //     "ram",
    //     "storageCapacity",
    //     "color",
    //     "price",
    //     "salePrice",
    //     "quantity",
    //     "depot",
    //   ];

    //   // Loop through the array and set values dynamically
    //   productInfo.lstProductTypeAndPrice.forEach(
    //     (product: any, index: number) => {
    //       fields.forEach((field) => {
    //         const fieldName: any = `lstProductTypeAndPrice.${index}.${field}`;
    //         const fieldValue = product[field];

    //         // Check if the field value is defined before setting it
    //         if (fieldValue !== undefined) {
    //           setValue(fieldName, fieldValue);
    //         }
    //       });
    //     },
    //   );
    // }
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
  };
  return (
    <div className="bg-white shadow ">
      <h2 className="font-bold m-4 text-2xl">Thêm sản phẩm điện thoại</h2>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        style={{ maxWidth: 700, padding: 8 }}
        autoComplete="off"
        noValidate
        onSubmitCapture={onSubmit}
      >
        <Form.Item label="" className="ml-[70px] mb-2">
          <Button
            className="w-[150px] bg-blue-300"
            onClick={generateSampleData}
            type="dashed"
            color="red"
          >
            Tạo Dữ liệu mẫu
          </Button>
        </Form.Item>
        <Form.Item
          label="Hãng sản xuất"
          name="brand"
          rules={[{ required: true }]}
        >
          <SelectCustom
            className={" text-black  "}
            id="brand"
            placeholder="Chọn hãng sx"
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
            placeholder="Chọn đặc điểm "
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
        <Form.Item
          label="Khối lượng (Nhập số)"
          name="mass"
          rules={[{ required: true }]}
        >
          <Controller
            control={control}
            name="mass"
            render={({ field }) => {
              return (
                <InputNumber
                  type="text"
                  className="grow"
                  placeholder="380"
                  errorMessage={errors.mass?.message}
                  classNameInput="p-3 w-full text-black outline-none border border-gray-300 focus:border-gray-500 rounded focus:shadow-sm"
                  classNameError="hidden"
                  {...field}
                  onChange={(event) => {
                    field.onChange(event);
                  }}
                />
              );
            }}
          />
        </Form.Item>
        <Form.Item
          label="Năm ra mắt (Nhập số)"
          name="launchTime"
          rules={[{ required: true }]}
        >
          <Controller
            control={control}
            name="launchTime"
            render={({ field }) => {
              return (
                <InputNumber
                  type="text"
                  className="grow"
                  placeholder="2023"
                  classNameInput="p-3 w-full text-black outline-none border border-gray-300 focus:border-gray-500 rounded focus:shadow-sm"
                  classNameError="hidden"
                  errorMessage={errors.launchTime?.message}
                  {...field}
                  onChange={(event) => {
                    field.onChange(event);
                  }}
                />
              );
            }}
          />
          <div className="text-red-500">{errors.launchTime?.message}</div>
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
          {/* <ul>
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
          </ul> */}
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
                              trigger(`lstProductTypeAndPrice.${index}.price`);
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
                    label="Số lượng sản phẩm (Nhập số)"
                    name={`lstProductTypeAndPrice.${index}.quantity`}
                    rules={[{ required: true }]}
                  >
                    <Input
                      type="number"
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
      <Modal
        title="Thêm sản phẩm"
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

export default () => <NewPhone />;

