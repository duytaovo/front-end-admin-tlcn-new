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
import { schemaProductMouse } from "src/utils/rules";
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
  addMouse,
  getDetailMouse,
  getMouse,
  updateMouse,
} from "src/store/accessory/mouse";

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

const NewMouse: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    resolver: yupResolver(schemaProductMouse),
  });
  const { mouseDetail } = useAppSelector((state) => state.mouse);

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
  const { nameId } = useParams();

  const id = getIdFromNameId(nameId as string);
  useEffect(() => {
    dispatch(getDetailMouse(id));
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
    setImages(mouseDetail.productInfo.lstProductImageUrl);

    const productInfo = mouseDetail?.productInfo;

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
    setValue("accessories", mouseDetail?.productInfo?.accessories);
    setValue("compatible", mouseDetail?.compatible);
    setValue("resolution", mouseDetail?.resolution);
    setValue("connector", mouseDetail?.connector);
    setValue("mass", mouseDetail?.productInfo?.mass.toString());
    setValue(
      "color",
      mouseDetail?.productInfo.lstProductTypeAndPrice[0].color.toString(),
    );
    setValue("led", mouseDetail?.led);
    setValue("softwareSupport", mouseDetail?.softwareSupport);
    setValue("description", mouseDetail?.productInfo?.description);
    setValue("brand", mouseDetail?.productInfo?.brandId.toString());
    setValue(
      "characteristic",
      mouseDetail?.productInfo?.characteristicId.toString(),
    );
    setValue("name", mouseDetail?.productInfo?.name);
    setValue("batteryType", mouseDetail?.batteryType);
    setValue(
      "salePrice",
      mouseDetail?.productInfo?.lstProductTypeAndPrice[0].salePrice.toString(),
    );
    setValue("time", mouseDetail?.time);
    setValue(
      "price",
      mouseDetail?.productInfo?.lstProductTypeAndPrice[0].price.toString(),
    );
    setValue("chargingPort", mouseDetail?.chargingPort);
    setValue("design", mouseDetail?.productInfo?.design);
    setValue("dimension", mouseDetail?.productInfo?.dimension);
    setValue("category", mouseDetail?.productInfo?.categoryId.toString());
    setValue("launchTime", "2023");
    setValue("files", mouseDetail?.productInfo.lstProductImageUrl);
  }, [mouseDetail]);
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "lstProductTypeAndPrice", // unique name for your Field Array
    },
  );
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
    } else {
      toast.warning("Cần chọn ảnh");
      return;
    }
    const body = JSON.stringify({
      productInfo: {
        brandId: Number(data.brand) || 1,
        categoryId: 12,
        productId: null,
        characteristicId: Number(data.characteristic) || 1,
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
          salePrice: Number(item?.salePrice),
          quantity: Number(item?.quantity),
          depotId: Number(item?.depot),
        })),

        lstProductImageUrl: images || [],
      },
      mouseType: true,
      compatible: data.compatible,
      resolution: data.resolution,
      connector: data.connector,
      led: data.led,
      softwareSupport: data.softwareSupport,
      batteryType: data.batteryType,
      time: data.time,
      chargingPort: data.chargingPort,
    });

    try {
      setIsSubmitting(true);
      const res = await dispatch(updateMouse({ id, body }));
      unwrapResult(res);
      const d = res?.payload?.data;
      if (d?.code !== 200) return toast.error(d?.message);
      await toast.success("Thêm sản phẩm thành công ");
      await dispatch(getMouse(""));
      await navigate(path.mouse);
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
    setValue("ram", "");
    setValue("accessories", "");
    setValue("color", "");
    setValue("description", "");
    setValue("brand", "");
    setValue("name", "");
    setValue("salePrice", "");
    setValue("price", "");
    setValue("design", "");
    setValue("dimension", "");
    setValue("led", "");
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
      <h2 className="font-bold m-4 text-2xl">Thêm sản phẩm chuột máy tính</h2>
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
            className={"flex-1 text-black"}
            id="brand"
            defaultValue={""}
            options={brand?.data?.data}
            register={register}
            isBrand={true}
          >
            {errors.brand?.message}
          </SelectCustom>
        </Form.Item>

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
                    />
                  </Form.Item>
                  <Form.Item
                    label="Giá khuyến mãi"
                    name={`lstProductTypeAndPrice.${index}.salePrice`}
                  >
                    <Input
                      name={`lstProductTypeAndPrice.${index}.salePrice`}
                      key={item.id} // important to include key with field's id
                      register={register}
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

                    options={depot?.data?.data}
                    register={register}
                  ></SelectCustom>
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
          label="Tương thích"
          name="compatible"
          rules={[{ required: true }]}
        >
          <Input
            name="compatible"
            register={register}
            type="text"
            className=""
            errorMessage={errors.compatible?.message}
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
          label="Cổng kết nôi"
          name="connector"
          rules={[{ required: true }]}
        >
          <Input
            name="connector"
            register={register}
            type="text"
            className=""
            errorMessage={errors.connector?.message}
          />
        </Form.Item>
        <Form.Item label="Led" name="led" rules={[{ required: true }]}>
          <Input
            name="led"
            register={register}
            type="text"
            className=""
            errorMessage={errors.led?.message}
          />
        </Form.Item>
        <Form.Item
          label="Hỗ trợ phần mềm"
          name="softwareSupport"
          rules={[{ required: true }]}
        >
          <Input
            name="softwareSupport"
            register={register}
            type="text"
            className=""
            errorMessage={errors.softwareSupport?.message}
          />
        </Form.Item>
        <Form.Item
          label="Loại pin"
          name="batteryType"
          rules={[{ required: true }]}
        >
          <Input
            name="batteryType"
            register={register}
            type="text"
            className=""
            errorMessage={errors.batteryType?.message}
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
          label="Cổng sạc"
          name="chargingPort"
          rules={[{ required: true }]}
        >
          <Input
            name="chargingPort"
            register={register}
            type="text"
            className=""
            errorMessage={errors.chargingPort?.message}
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
                navigate(path.mouse);
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

export default () => <NewMouse />;

