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
import { schemaProductLoudSpeaker, schemaProductRam } from "src/utils/rules";
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
import { uploadManyImagesProductSmartPhone } from "src/store/product/smartPhoneSlice";
import {
  getDetailloudSpeaker,
  getloudSpeaker,
  updateloudSpeaker,
} from "src/store/accessory/loudSpeaker";

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
}

const UpdateLoudSpeaker: React.FC = () => {
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
    watch,
    getValues,
  } = useForm({
    resolver: yupResolver(schemaProductLoudSpeaker),
  });
  const { nameId } = useParams();
  const id = getIdFromNameId(nameId as string);
  // const { brand } = useAppSelector((state) => state.brand);
  const { loudSpeakerDetail } = useAppSelector((state) => state.loudSpeaker);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { depot } = useAppSelector((state) => state.depot);
  const { brand } = useAppSelector((state) => state.brand);
  useEffect(() => {
    dispatch(getCategorys({ pageSize: 100 }));
    dispatch(getCharacters({ pageSize: 100 }));
    dispatch(getBrands({ pageSize: 100 }));
    dispatch(getdepots({ pageSize: 100 }));
  }, []);
  useEffect(() => {
    dispatch(getDetailloudSpeaker(id));
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
    setImages(loudSpeakerDetail.productInfo?.lstProductImageUrl);

    const productInfo = loudSpeakerDetail?.productInfo;

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
    setValue("totalCapacity", loudSpeakerDetail?.totalCapacity);
    setValue("time", loudSpeakerDetail?.time);
    setValue("connection", loudSpeakerDetail?.connection);

    setValue("utilities", loudSpeakerDetail?.utilities);
    setValue("control", loudSpeakerDetail?.control);
    setValue("description", loudSpeakerDetail?.productInfo?.description);
    setValue("brand", loudSpeakerDetail?.productInfo?.brandId.toString());
    setValue(
      "characteristic",
      loudSpeakerDetail?.productInfo?.characteristicId.toString(),
    );
    setValue("name", loudSpeakerDetail?.productInfo?.name);
    setValue(
      "salePrice",
      loudSpeakerDetail?.productInfo?.lstProductTypeAndPrice[0].salePrice.toString(),
    );
    setValue(
      "price",
      loudSpeakerDetail?.productInfo?.lstProductTypeAndPrice[0].price.toString(),
    );
    setValue("launchTime", "2023");
    setValue("files", loudSpeakerDetail?.productInfo?.lstProductImageUrl);
  }, [loudSpeakerDetail]);
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
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
        brandId: Number(data.brand),
        categoryId: 12,
        productId: Number(loudSpeakerDetail.productInfo.productId),
        characteristicId: Number(
          loudSpeakerDetail.productInfo.characteristicId,
        ),

        productCode: loudSpeakerDetail.productInfo.productCode,
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
          depotId: Number(item?.depot),
        })),

        lstProductImageUrl: images || [],
      },
      loudspeakerType: true,
      totalCapacity: data.totalCapacity,
      time: data.time,
      connection: data.connection,
      utilities: data.utilities,
      control: data.control,
    });

    try {
      setIsSubmitting(true);
      const res = await dispatch(updateloudSpeaker({ id, body }));
      unwrapResult(res);
      const d = res?.payload?.data;
      if (d?.code !== 200) return toast.error(d?.message);
      await toast.success("Cập nhật sản phẩm thành công ");
      await dispatch(getloudSpeaker(""));
      await navigate(path.loudSpeaker);
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
    setImages(loudSpeakerDetail.productInfo.lstProductImageUrl);

    const productInfo = loudSpeakerDetail?.productInfo;

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
    setValue("accessories", loudSpeakerDetail?.productInfo?.accessories);
    setValue("totalCapacity", loudSpeakerDetail?.totalCapacity);
    setValue("time", loudSpeakerDetail?.time);
    setValue("connection", loudSpeakerDetail?.connection);
    setValue("mass", loudSpeakerDetail?.productInfo?.mass.toString());

    setValue("utilities", loudSpeakerDetail?.utilities);
    setValue("control", loudSpeakerDetail?.control);
    setValue("description", loudSpeakerDetail?.productInfo?.description);
    setValue("brand", loudSpeakerDetail?.productInfo?.brandId.toString());
    setValue(
      "characteristic",
      loudSpeakerDetail?.productInfo?.characteristicId.toString(),
    );
    setValue("name", loudSpeakerDetail?.productInfo?.name);
    setValue(
      "salePrice",
      loudSpeakerDetail?.productInfo?.lstProductTypeAndPrice[0].salePrice.toString(),
    );
    setValue(
      "price",
      loudSpeakerDetail?.productInfo?.lstProductTypeAndPrice[0].price.toString(),
    );
    setValue("design", loudSpeakerDetail?.productInfo?.design);
    setValue("dimension", loudSpeakerDetail?.productInfo?.dimension);
    setValue("launchTime", "2023");
    setValue("files", loudSpeakerDetail?.productInfo.lstProductImageUrl);
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
      <h2 className="font-bold m-4 text-2xl">
        Cập nhật sản phẩm loa nghe nhạc
      </h2>
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
          />
        </Form.Item>
        <Form.Item
          label="Loại sản phẩm"
          name="lstProductTypeAndPrice"
          rules={[{ required: true }]}
        >
          <ul>
            {loudSpeakerDetail?.productInfo?.lstProductTypeAndPrice?.map(
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
          label="Tổng công suất"
          name="totalCapacity"
          rules={[{ required: true }]}
        >
          <Input
            name="totalCapacity"
            register={register}
            type="text"
            className=""
            errorMessage={errors.totalCapacity?.message}
          />
        </Form.Item>
        <Form.Item label="Thời gian" name="time" rules={[{ required: true }]}>
          <Input
            name="time"
            register={register}
            type="text"
            className=""
            errorMessage={errors.time?.message}
          />
        </Form.Item>
        <Form.Item
          label="Kết nối"
          name="connection"
          rules={[{ required: true }]}
        >
          <Input
            name="connection"
            register={register}
            type="text"
            className=""
            errorMessage={errors.connection?.message}
          />
        </Form.Item>
        <Form.Item
          label="Tiện ích"
          name="utilities"
          rules={[{ required: true }]}
        >
          <Input
            name="utilities"
            register={register}
            type="text"
            className=""
            errorMessage={errors.utilities?.message}
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
    </div>
  );
};

export default () => <UpdateLoudSpeaker />;

