import { PlusOutlined } from "@ant-design/icons";
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

import { getDetailRom, getRoms, updateRom } from "src/store/rom/romSlice";
import {
  getDetailProcessor,
  getProcessor,
  updateProcessor,
} from "src/store/processor/processorSlice";
import { uploadManyImagesProductSmartPhone } from "src/store/product/smartPhoneSlice";
import ProcessorDetail from "../Detail/Processor_Detail";

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

interface FormData {
  brand: string;
  name: string;
  description: string;
  design: string | undefined;
  dimension: string | undefined;
  mass: string | undefined;
  launchTime: string | undefined;
  accessories: string | undefined;
  productStatus: string | undefined;
  price: string;
  salePrice: string | undefined;
  monitor: string;
}

const UpdateProcessor: React.FC = () => {
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
    control,
    getValues,
    watch,
  } = useForm({
    resolver: yupResolver(schemaProductRam),
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { nameId } = useParams();
  const { processorDetail } = useAppSelector((state) => state.processor);
  const id = getIdFromNameId(nameId as string);
  const { depot } = useAppSelector((state) => state.depot);
  const { brand } = useAppSelector((state) => state.brand);
  useEffect(() => {
    dispatch(getCategorys({ pageSize: 100 }));
    dispatch(getCharacters({ pageSize: 100 }));
    dispatch(getBrands({ pageSize: 100 }));
    dispatch(getdepots({ pageSize: 100 }));
  }, []);

  useEffect(() => {
    dispatch(getDetailProcessor(id));
  }, [id]);
  const [file, setFile] = useState<File[]>();
  const imageArray = file || []; // Mảng chứa các đối tượng ảnh (File hoặc Blob)

  // Tạo một mảng chứa các URL tạm thời cho ảnh
  const [imageUrls, setImages] = useState<string[]>([]);

  for (const image of imageArray) {
    const imageUrl = URL.createObjectURL(image);
    imageUrls.push(imageUrl);
  }
  useEffect(() => {
    setImages(processorDetail.productInfo?.lstProductImageUrl);

    const productInfo = processorDetail?.productInfo;

    if (
      productInfo?.lstProductTypeAndPrice &&
      Array.isArray(productInfo.lstProductTypeAndPrice)
    ) {
      // Define the fields you want to set dynamically
      const fields = ["price", "salePrice", "quantity", "depot"];

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

    setValue("description", processorDetail?.productInfo?.description);
    // setValue("brand", processorDetail?.productInfo?.brandId.toString());
    setValue("name", processorDetail?.productInfo?.name);
    setValue(
      "salePrice",
      processorDetail?.productInfo?.lstProductTypeAndPrice[0].salePrice.toString(),
    );
    setValue(
      "price",
      processorDetail?.productInfo?.lstProductTypeAndPrice[0].price.toString(),
    );
    setValue("launchTime", "2023");
    setValue("imageUrl", processorDetail?.productInfo?.lstProductImageUrl);
    setValue("generation", processorDetail?.generation);
    setValue("generationName", processorDetail?.generationName);
    setValue("socket", processorDetail?.socket);
    setValue("multiplier", processorDetail?.multiplier);
    setValue("numberOfStreams", processorDetail?.numberOfStreams);
    setValue("maxSpeed", processorDetail?.maxSpeed);
    setValue("caching", processorDetail?.caching);
    setValue("memoryCapacity", processorDetail?.maxSpeed);
  }, [processorDetail]);
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes fprocessorprocessor useForm (optional: if you are using FormContext)
      name: "lstProductTypeAndPrice", // unique name for your Field Array
    },
  );
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
        categoryId: 14,
        productCode: processorDetail.productInfo.productCode,
        productId: Number(processorDetail.productInfo.productId),
        characteristicId: 12,
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
          price: Number(item?.price),
          salePrice: Number(item?.salePrice),
          quantity: Number(item?.quantity),
          depotId: Number(item?.depot),
        })),

        lstProductImageUrl: images || [],
      },
      cpuFor: true,
      generation: data.generation,
      generationName: data.generationName,
      socket: data.socket,
      cpuSpeed: data.cpuSpeed || "Không có",
      multiplier: Number(data.multiplier),
      numberOfStreams: Number(data.numberOfStreams),
      maxSpeed: data.maxSpeed,
      caching: data.caching,
      memoryCapacity: data.memoryCapacity,
    });

    try {
      setIsSubmitting(true);
      const res = await dispatch(updateProcessor({ id, body }));
      unwrapResult(res);
      const d = res?.payload?.data;
      // if (d?.code !== 201) return toast.error(d?.message);
      await toast.success("Cập nhật sản phẩm thành công ");
      await dispatch(getProcessor(""));
      await navigate(path.processor);
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
    setValue("description", processorDetail?.productInfo?.description);
    setValue("brand", processorDetail?.productInfo?.brandId.toString());
    setValue("name", processorDetail?.productInfo?.name);
    setValue(
      "salePrice",
      processorDetail?.productInfo?.lstProductTypeAndPrice[0].salePrice.toString(),
    );
    setValue(
      "price",
      processorDetail?.productInfo?.lstProductTypeAndPrice[0].price.toString(),
    );
    setValue("design", processorDetail?.productInfo?.design);
    setValue("dimension", processorDetail?.productInfo?.dimension);
    setValue("launchTime", "2023");
    setValue("imageUrl", processorDetail?.productInfo?.lstProductImageUrl);
    setValue("generation", processorDetail?.generation);
    setValue("generationName", processorDetail?.generationName);
    setValue("socket", processorDetail?.socket);
    setValue("multiplier", processorDetail?.multiplier);
    setValue("numberOfStreams", processorDetail?.numberOfStreams);
    setValue("maxSpeed", processorDetail?.maxSpeed);
    setValue("caching", processorDetail?.caching);
    setValue("memoryCapacity", processorDetail?.maxSpeed);
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
            {processorDetail?.productInfo?.lstProductTypeAndPrice?.map(
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

        <Form.Item label="Thế hệ" name="generation">
          <Input
            name="generation"
            register={register}
            type="text"
            className=""
            errorMessage={errors.generation?.message}
          />
        </Form.Item>
        <Form.Item label="Tên thế hệ" name="generationName">
          <Input
            name="generationName"
            register={register}
            type="text"
            className=""
            errorMessage={errors.generationName?.message}
          />
        </Form.Item>
        <Form.Item label="Ổ cắm" name="socket">
          <Input
            name="socket"
            register={register}
            type="text"
            className=""
            errorMessage={errors.socket?.message}
          />
        </Form.Item>
        <Form.Item label="Đa nhân" name="multiplier">
          <Input
            name="multiplier"
            register={register}
            type="text"
            className=""
            errorMessage={errors.multiplier?.message}
          />
        </Form.Item>
        <Form.Item label="Số của stream" name="numberOfStreams">
          <Input
            name="numberOfStreams"
            register={register}
            type="text"
            className=""
            errorMessage={errors.numberOfStreams?.message}
          />
        </Form.Item>
        <Form.Item label="Tốc độ cpu" name="cpuSpeed">
          <Input
            name="cpuSpeed"
            register={register}
            type="text"
            className=""
            errorMessage={errors.cpuSpeed?.message}
          />
        </Form.Item>
        <Form.Item label="Tốc độ tối đa" name="maxSpeed">
          <Input
            name="maxSpeed"
            register={register}
            type="text"
            className=""
            errorMessage={errors.maxSpeed?.message}
          />
        </Form.Item>
        <Form.Item label="Bộ nhớ đệm" name="caching">
          <Input
            name="caching"
            register={register}
            type="text"
            className=""
            errorMessage={errors.caching?.message}
          />
        </Form.Item>

        <Form.Item label="Bộ nhớ lưu trữ" name="memoryCapacity">
          <Input
            name="memoryCapacity"
            register={register}
            type="text"
            className=""
            errorMessage={errors.memoryCapacity?.message}
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
                navigate(path.processor);
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

export default () => <UpdateProcessor />;

