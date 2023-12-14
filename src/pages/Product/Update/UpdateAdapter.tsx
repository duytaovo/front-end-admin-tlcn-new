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
import { schemaAdapter } from "src/utils/rules";
import {
  generateRandomString,
  getIdFromNameId,
  isAxiosUnprocessableEntityError,
} from "src/utils/utils";
import SelectCustom from "src/components/Select";
import Textarea from "src/components/Textarea";
import { getCategorys } from "src/store/category/categorySlice";
import { uploadManyImagesProductSmartPhone } from "src/store/product/smartPhoneSlice";
import InputFile from "src/components/InputFile";
import { getCharacters } from "src/store/characteristic/characteristicSlice";
import { getBrands } from "src/store/brand/brandSlice";
import { getdepots } from "src/store/depot/depotSlice";
import {
  getAdapter,
  getDetailAdapter,
  updateAdapter,
} from "src/store/accessory/adapter";

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
}

const UpdateAdapter: React.FC = () => {
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
    getValues,
    control,
  } = useForm({
    resolver: yupResolver(schemaAdapter),
  });
  const { nameId } = useParams();

  const id = getIdFromNameId(nameId as string);
  // const { brand } = useAppSelector((state) => state.brand);
  const { adapterDetail } = useAppSelector((state) => state.adapter);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { character } = useAppSelector((state) => state.character);
  const { depot } = useAppSelector((state) => state.depot);
  const { brand } = useAppSelector((state) => state.brand);
  useEffect(() => {
    dispatch(getCategorys({ pageSize: 100 }));
    dispatch(getCharacters({ pageSize: 100 }));
    dispatch(getBrands({ pageSize: 100 }));
    dispatch(getdepots({ pageSize: 100 }));
  }, []);
  const [imageUrls, setImages] = useState<string[]>([]);
  const [file, setFile] = useState<File[]>();
  const imageArray = file || []; // Mảng chứa các đối tượng ảnh (File hoặc Blob)
  useEffect(() => {
    dispatch(getDetailAdapter(id));
  }, [id]);
  // Tạo một mảng chứa các URL tạm thời cho ảnh

  for (const image of imageArray) {
    const imageUrl = URL.createObjectURL(image);
    imageUrls.push(imageUrl);
  }

  useEffect(() => {
    setImages(adapterDetail.productInfo.lstProductImageUrl);

    const productInfo = adapterDetail?.productInfo;

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
    setValue("accessories", adapterDetail?.productInfo?.accessories);
    setValue("adapterType", adapterDetail?.adapterType);
    setValue("model", adapterDetail?.model);
    setValue("input", adapterDetail?.input);
    setValue("mass", adapterDetail?.productInfo?.mass.toString());
    setValue(
      "color",
      adapterDetail?.productInfo.lstProductTypeAndPrice[0].color.toString(),
    );
    setValue("output", adapterDetail?.output);
    setValue("maximumCapacity", adapterDetail?.maximumCapacity);
    setValue("description", adapterDetail?.productInfo?.description);
    setValue("brand", adapterDetail?.productInfo?.brandId.toString());
    setValue(
      "characteristic",
      adapterDetail?.productInfo?.characteristicId.toString(),
    );
    setValue("name", adapterDetail?.productInfo?.name);
    setValue("technology", adapterDetail?.technology);
    setValue(
      "salePrice",
      adapterDetail?.productInfo?.lstProductTypeAndPrice[0].salePrice.toString(),
    );

    setValue("design", adapterDetail?.productInfo?.design);
    setValue("dimension", adapterDetail?.productInfo?.dimension);
    setValue("category", adapterDetail?.productInfo?.categoryId.toString());
    setValue("launchTime", "2023");
  }, [adapterDetail]);

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
    } else {
      toast.warning("Cần chọn ảnh");
      return;
    }
    try {
      const body = JSON.stringify({
        productInfo: {
          brandId: Number(data.brand) || 1,
          categoryId: 20,
          productId: null,
          characteristicId: Number(data.characteristic) || 1,
          productCode: generateRandomString(10),
          name: data.name,
          description: data?.description,
          design: data?.design,
          dimension: data?.dimension,
          mass: Number(data?.mass),
          launchTime: data.launchTime,
          accessories: data?.accessories,
          productStatus: 100,
          lstProductTypeAndPrice: data?.lstProductTypeAndPrice?.map(
            (item, index) => ({
              typeId: Number(
                adapterDetail?.productInfo?.lstProductTypeAndPrice[index]
                  ?.typeId,
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
        adapterType: data.adapterType,
        model: data.model,
        input: data.input,
        output: data.output,
        maximumCapacity: data.maximumCapacity,
        technology: data.technology,
      });
      const res = await dispatch(updateAdapter(body));
      unwrapResult(res);
      const d = res?.payload?.data;
      if (d?.code !== 200) return toast.error(d?.message);
      await toast.success("Cập nhật sản phẩm thành công ");
      dispatch(getAdapter({}));
      await navigate(path.adapter);
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

  const handleChangeFile = (file?: File[]) => {
    setFile(file);
  };
  const onClickHuy = () => {
    setImages(adapterDetail.productInfo.lstProductImageUrl);

    const productInfo = adapterDetail?.productInfo;

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
    setValue("accessories", adapterDetail?.productInfo?.accessories);
    setValue("adapterType", adapterDetail?.adapterType);
    setValue("model", adapterDetail?.model);
    setValue("input", adapterDetail?.input);
    setValue("mass", adapterDetail?.productInfo?.mass.toString());
    setValue(
      "color",
      adapterDetail?.productInfo.lstProductTypeAndPrice[0].color.toString(),
    );
    setValue("output", adapterDetail?.output);
    setValue("maximumCapacity", adapterDetail?.maximumCapacity);
    setValue("description", adapterDetail?.productInfo?.description);
    setValue("brand", adapterDetail?.productInfo?.brandId.toString());
    setValue(
      "characteristic",
      adapterDetail?.productInfo?.characteristicId.toString(),
    );
    setValue("name", adapterDetail?.productInfo?.name);
    setValue("technology", adapterDetail?.technology);
    setValue(
      "salePrice",
      adapterDetail?.productInfo?.lstProductTypeAndPrice[0].salePrice.toString(),
    );

    setValue("design", adapterDetail?.productInfo?.design);
    setValue("dimension", adapterDetail?.productInfo?.dimension);
    setValue("category", adapterDetail?.productInfo?.categoryId.toString());
    setValue("launchTime", "2023");
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
          label="Loại bộ chuyển"
          name="model"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Type c"
            name="model"
            register={register}
            type="text"
            className=""
            errorMessage={errors.model?.message}
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
          label="Loại bộ chuyển"
          name="adapterType"
          rules={[{ required: true }]}
        >
          <Input
            name="adapterType"
            register={register}
            type="text"
            className=""
            errorMessage={errors.adapterType?.message}
            placeholder="6.7 - Tần số quét 120 Hz"
          />
        </Form.Item>

        <Form.Item label="Đầu ra" name="output" rules={[{ required: true }]}>
          <Input
            name="output"
            register={register}
            type="text"
            className=""
            errorMessage={errors.output?.message}
            placeholder="12 MP"
          />
        </Form.Item>
        <Form.Item label="Đầu vào" name="input" rules={[{ required: true }]}>
          <Input
            name="input"
            register={register}
            type="text"
            className=""
            errorMessage={errors.input?.message}
            placeholder=""
          />
        </Form.Item>
        <Form.Item
          label="Công suất tối đa"
          name="maximumCapacity"
          rules={[{ required: true }]}
        >
          <Input
            name="maximumCapacity"
            register={register}
            type="text"
            className=""
            errorMessage={errors.maximumCapacity?.message}
            placeholder="Apple A17 Pro 6 nhân"
          />
        </Form.Item>
        <Form.Item
          label="Công nghệ"
          name="technology"
          rules={[{ required: true }]}
        >
          <Input
            name="technology"
            register={register}
            type="text"
            className=""
            errorMessage={errors.technology?.message}
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
                navigate(path.adapter);
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
      >
        <p>Đang xử lý, vui lòng đợi...</p>
      </Modal>
    </div>
  );
};

export default () => <UpdateAdapter />;

