import { yupResolver } from "@hookform/resolvers/yup";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Form, Modal } from "antd";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "src/components/Input";
import path from "src/constants/path";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { ErrorResponse } from "src/types/utils.type";
import { schemaMonitor } from "src/utils/rules";
import {
  getIdFromNameId,
  isAxiosUnprocessableEntityError,
} from "src/utils/utils";
import SelectCustom from "src/components/Select";

import Textarea from "src/components/Textarea";
import { getCategorys } from "src/store/category/categorySlice";
import { uploadManyImagesProductSmartPhone } from "src/store/product/smartPhoneSlice";
import InputFile from "src/components/InputFile";
import { PlusOutlined } from "@ant-design/icons";
import { getCharacters } from "src/store/characteristic/characteristicSlice";
import { getBrands } from "src/store/brand/brandSlice";
import { getdepots } from "src/store/depot/depotSlice";
import {
  getDetailMonitor,
  getMonitor,
  updateMonitor,
} from "src/store/accessory/monitor";

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

interface FormData {
  name: string;
  description: string;
  design: string | undefined;
  dimension: string | undefined;
  mass: string | undefined;
  launchTime: string | undefined;
  accessories: string | undefined;
  productStatus: number | undefined;

  price: string;
  salePrice: string | undefined;
}

const UpdateMonitor: React.FC = () => {
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
    getValues,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(schemaMonitor),
  });
  const [imageUrls, setImages] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { nameId } = useParams();
  const id = getIdFromNameId(nameId as string);
  const { monitorDetail } = useAppSelector((state) => state.monitor);
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
    dispatch(getDetailMonitor(id));
  }, [id]);

  const [file, setFile] = useState<File[]>();
  const imageArray = file || []; // Mảng chứa các đối tượng ảnh (File hoặc Blob)

  // Tạo một mảng chứa các URL tạm thời cho ảnh

  for (const image of imageArray) {
    const imageUrl = URL.createObjectURL(image);
    imageUrls.push(imageUrl);
  }

  useEffect(() => {
    setImages(monitorDetail.productInfo?.lstProductImageUrl);

    const productInfo = monitorDetail?.productInfo;

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
    setValue("accessories", monitorDetail?.productInfo?.accessories);
    setValue("displaySize", monitorDetail?.displaySize);
    setValue("aspectRatio", monitorDetail?.aspectRatio);
    setValue("resolution", monitorDetail?.resolution);
    setValue("mass", monitorDetail?.productInfo?.mass.toString());

    setValue("panels", monitorDetail?.panels);
    setValue("scanFrequency", monitorDetail?.scanFrequency);
    setValue("description", monitorDetail?.productInfo?.description);
    setValue("brand", monitorDetail?.productInfo?.brandId.toString());

    setValue("name", monitorDetail?.productInfo?.name);
    setValue("responseTime", monitorDetail?.responseTime);
    setValue(
      "salePrice",
      monitorDetail?.productInfo?.lstProductTypeAndPrice[0].salePrice.toString(),
    );
    setValue("contract", monitorDetail?.contract);
    setValue(
      "price",
      monitorDetail?.productInfo?.lstProductTypeAndPrice[0].price.toString(),
    );
    setValue("segmentation", monitorDetail?.segmentation);
    setValue("brightness", monitorDetail?.brightness);
    setValue("connectors", monitorDetail?.connectors);
    setValue("design", monitorDetail?.productInfo?.design);
    setValue("dimension", monitorDetail?.productInfo?.dimension);
    setValue("launchTime", "2023");
    setValue("files", monitorDetail?.productInfo?.lstProductImageUrl);
  }, [monitorDetail]);
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
        brandId: 20,
        categoryId: 27,
        productId: Number(monitorDetail.productInfo.productId),
        characteristicId: Number(monitorDetail.productInfo.characteristicId),
        productCode: monitorDetail.productInfo.productCode,
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
              monitorDetail?.productInfo?.lstProductTypeAndPrice[index].typeId,
            ),
            ram: item?.ram,
            storageCapacity: item?.storageCapacity,
            color: item?.color,
            price: Number(item?.price),
            salePrice: Number(item?.salePrice),
            quantity: Number(item?.quantity),
            depotId: Number(item?.depot),
          }),
        ),

        lstProductImageUrl: images || [],
      },
      segmentation: data.segmentation,
      displaySize: data.displaySize || "32 inch",
      aspectRatio: data.aspectRatio,
      resolution: data.resolution,
      panels: data.panels,
      scanFrequency: data.scanFrequency,
      responseTime: data.responseTime,
      contract: data.contract,
      brightness: data.brightness,
      connectors: data.connectors,
    });

    try {
      const res = await dispatch(updateMonitor({ id, body }));
      unwrapResult(res);
      const d = res?.payload?.data;
      if (d?.code !== 200) return toast.error(d?.message);
      await toast.success("Chỉnh sửa thành công ");
      await dispatch(getMonitor(""));
      await navigate(path.monitor);
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
    setImages(monitorDetail.productInfo.lstProductImageUrl);

    setValue("accessories", monitorDetail?.productInfo?.accessories);
    setValue("displaySize", monitorDetail?.displaySize);
    setValue("aspectRatio", monitorDetail?.aspectRatio);
    setValue("resolution", monitorDetail?.resolution);
    setValue("mass", monitorDetail?.productInfo?.mass.toString());

    setValue("panels", monitorDetail?.panels);
    setValue("scanFrequency", monitorDetail?.scanFrequency);
    setValue("description", monitorDetail?.productInfo?.description);
    setValue("brand", monitorDetail?.productInfo?.brandId.toString());

    setValue("name", monitorDetail?.productInfo?.name);
    setValue("responseTime", monitorDetail?.responseTime);
    setValue(
      "salePrice",
      monitorDetail?.productInfo?.lstProductTypeAndPrice[0].salePrice.toString(),
    );
    setValue("contract", monitorDetail?.contract);
    setValue(
      "price",
      monitorDetail?.productInfo?.lstProductTypeAndPrice[0].price.toString(),
    );
    setValue("brightness", monitorDetail?.brightness);
    setValue("connectors", monitorDetail?.connectors);
    setValue("design", monitorDetail?.productInfo?.design);
    setValue("dimension", monitorDetail?.productInfo?.dimension);
    setValue("launchTime", "2023");
    setValue("files", monitorDetail?.productInfo.lstProductImageUrl);
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
          label="Loại sản phẩm"
          name="lstProductTypeAndPrice"
          rules={[{ required: true }]}
        >
          <ul>
            {monitorDetail?.productInfo?.lstProductTypeAndPrice?.map(
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
        <Form.Item
          label="Sự phân chia"
          name="segmentation"
          rules={[{ required: true }]}
        >
          <Input
            name="segmentation"
            register={register}
            type="text"
            className=""
            errorMessage={errors.segmentation?.message}
          />
        </Form.Item>

        <Form.Item
          label="Phát minh"
          name="resolution"
          rules={[{ required: true }]}
        >
          <Input
            name="resolution"
            register={register}
            type="text"
            className=""
            errorMessage={errors.resolution?.message}
          />
        </Form.Item>
        <Form.Item
          label="Diện mạo"
          name="aspectRatio"
          rules={[{ required: true }]}
        >
          <Input
            name="aspectRatio"
            register={register}
            type="text"
            className=""
            errorMessage={errors.aspectRatio?.message}
          />
        </Form.Item>
        <Form.Item label="Tấm" name="panels" rules={[{ required: true }]}>
          <Input
            name="panels"
            register={register}
            type="text"
            className=""
            errorMessage={errors.panels?.message}
          />
        </Form.Item>
        <Form.Item
          label="Tần số quét"
          name="scanFrequency"
          rules={[{ required: true }]}
        >
          <Input
            name="scanFrequency"
            register={register}
            type="text"
            className=""
            errorMessage={errors.scanFrequency?.message}
          />
        </Form.Item>
        <Form.Item
          label="Thời gian đáp ứng"
          name="responseTime"
          rules={[{ required: true }]}
        >
          <Input
            name="responseTime"
            register={register}
            type="text"
            className=""
            errorMessage={errors.responseTime?.message}
          />
        </Form.Item>
        <Form.Item
          label="Tương phản"
          name="contract"
          rules={[{ required: true }]}
        >
          <Input
            name="contract"
            register={register}
            type="text"
            className=""
            errorMessage={errors.contract?.message}
          />
        </Form.Item>
        <Form.Item
          label="Độ sáng"
          name="brightness"
          rules={[{ required: true }]}
        >
          <Input
            name="brightness"
            register={register}
            type="text"
            className=""
            errorMessage={errors.brightness?.message}
          />
        </Form.Item>
        <Form.Item
          label="Đầu nối"
          name="connectors"
          rules={[{ required: true }]}
        >
          <Input
            name="connectors"
            register={register}
            type="text"
            className=""
            errorMessage={errors.connectors?.message}
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
            <InputFile label="" onChange={handleChangeFile} id="images" />
            <div className="mt-3  flex flex-col items-center text-red-500">
              <div>Dụng lượng file tối đa 2 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </div>
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
                navigate(path.monitor);
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

export default () => <UpdateMonitor />;

