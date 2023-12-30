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
import { schemaLaptop } from "src/utils/rules";
import {
  generateRandomString,
  getIdFromNameId,
  isAxiosUnprocessableEntityError,
} from "src/utils/utils";
import SelectCustom from "src/components/Select";
import Textarea from "src/components/Textarea";
import { getCategorys } from "src/store/category/categorySlice";
import { getBrands } from "src/store/brand/brandSlice";

import InputFile from "src/components/InputFile";
import { getCardGraphic } from "src/store/cardGrap/cardGraphicSlice";
import { getRams } from "src/store/ram/ramSlice";
import { getRoms } from "src/store/rom/romSlice";
import { getProcessor } from "src/store/processor/processorSlice";
import { getCharacters } from "src/store/characteristic/characteristicSlice";
import {
  getDetailLaptop,
  getLaptop,
  updateLaptop,
} from "src/store/product/laptopSlice ";
import { PlusOutlined } from "@ant-design/icons";
import { getdepots } from "src/store/depot/depotSlice";
import { uploadManyImagesProductSmartPhone } from "src/store/product/smartPhoneSlice";

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

const UpdateLaptop: React.FC = () => {
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
  } = useForm({
    resolver: yupResolver(schemaLaptop),
  });
  const { nameId } = useParams();
  const id = getIdFromNameId(nameId as string);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cardGraphic } = useAppSelector((state) => state.cardGraphic);
  const { ram } = useAppSelector((state) => state.ram);
  const { depot } = useAppSelector((state) => state.depot);
  const { rom } = useAppSelector((state) => state.rom);
  const { processor } = useAppSelector((state) => state.processor);
  const { character } = useAppSelector((state) => state.character);
  const { brand } = useAppSelector((state) => state.brand);
  console.log(depot);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "lstProductTypeAndPrice", // unique name for your Field Array
    },
  );
  const { laptopDetail } = useAppSelector((state) => state.laptop);

  useEffect(() => {
    dispatch(getCategorys({ pageSize: 100 }));
    dispatch(getCharacters({ pageSize: 100 }));
    dispatch(getBrands({ pageSize: 100 }));
    dispatch(getdepots({ pageSize: 100 }));
    dispatch(getCardGraphic({ pageSize: 100 }));
    dispatch(getRams({ pageSize: 100 }));
    dispatch(getRoms({ pageSize: 100 }));
    dispatch(getProcessor({ pageSize: 100 }));
    dispatch(getDetailLaptop(id));
  }, []);

  const [file, setFile] = useState<File[]>();
  const imageArray = file || []; // Mảng chứa các đối tượng ảnh (File hoặc Blob)
  const [imageUrls, setImages] = useState<string[]>([]);

  // Tạo một mảng chứa các URL tạm thời cho ảnh

  for (const image of imageArray) {
    const imageUrl = URL.createObjectURL(image);
    // imageUrls.push(imageUrl);
  }

  useEffect(() => {
    setImages(laptopDetail.productInfo.lstProductImageUrl);
    const productInfo = laptopDetail?.productInfo;

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
    setValue("maximumRom", laptopDetail?.maximumRom.toString());
    setValue("maximumRam", laptopDetail?.maximumRam.toString());
    setValue("monitor", laptopDetail?.monitor.toString());
    setValue("special", laptopDetail?.special.toString());
    setValue("mass", laptopDetail?.productInfo?.mass.toString());
    setValue("design", laptopDetail?.productInfo?.design?.toString());
    setValue("name", laptopDetail?.productInfo?.name.toString());
    setValue("accessories", laptopDetail?.productInfo?.accessories);
    setValue("operatingSystem", laptopDetail?.operatingSystem);
    // setValue("design", laptopDetail?.productInfo?.design);
    setValue("dimension", laptopDetail?.productInfo?.dimension);
    setValue("launchTime", 2023);
    setValue("gateway", laptopDetail?.gateway);
    setValue("ramId", String(laptopDetail?.ramId));

    setValue("files", laptopDetail?.productInfo.lstProductImageUrl);
  }, [laptopDetail]);

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
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
      gateway: data.gateway,
      special: data.special,
      maximumRam: Number(data.maximumRam),
      maximumRom: Number(data.maximumRom),
      processorId: Number(data.processor),
      ramId: Number(data.ramId),
      romId: Number(data.romId),
      graphicsCardId: Number(data.graphicsCard),
      monitor: data.monitor,
      operatingSystem: data.operatingSystem,
      productInfo: {
        brandId: Number(data.brand),
        categoryId: 2,
        productId: Number(laptopDetail.productInfo.productId),
        characteristicId: Number(data.characteristic),
        productCode: laptopDetail.productInfo.productCode,
        name: data.name,
        description: data.description,
        design: data.design,
        dimension: data.dimension,
        mass: Number(data.mass),
        launchTime: Number(data.launchTime),
        accessories: data.accessories,
        productStatus: 100,
        lstProductTypeAndPrice: data?.lstProductTypeAndPrice?.map(
          (item, index) => ({
            typeId: Number(
              laptopDetail?.productInfo?.lstProductTypeAndPrice[index]?.typeId,
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
    });

    try {
      setIsSubmitting(true);
      const res = await dispatch(updateLaptop({ id, body }));
      unwrapResult(res);
      // const d = res?.payload?.data;
      // if (d?.code !== 200) return toast.error(d?.message);
      await toast.success("Chỉnh sửa thành công ");
      await dispatch(getLaptop(""));
      await navigate(path.laptop);
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
    const productInfo = laptopDetail?.productInfo;

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
    setValue("maximumRom", laptopDetail?.maximumRom.toString());
    setValue("maximumRam", laptopDetail?.maximumRam.toString());
    setValue("monitor", laptopDetail?.monitor.toString());
    setValue("special", laptopDetail?.special.toString());
    setValue("mass", laptopDetail?.productInfo?.mass.toString());
    setValue("design", laptopDetail?.productInfo?.design?.toString());
    setValue("name", laptopDetail?.productInfo?.name.toString());
    setValue("accessories", laptopDetail?.productInfo?.accessories);
    setValue("operatingSystem", laptopDetail?.operatingSystem);
    setValue("design", laptopDetail?.productInfo?.design);
    setValue("dimension", laptopDetail?.productInfo?.dimension);
    setValue("launchTime", 2023);
    setValue("gateway", laptopDetail?.gateway);
    setValue("ram", String(laptopDetail?.ramId));
    setValue(
      "color",
      laptopDetail?.productInfo.lstProductTypeAndPrice[0].color.toString(),
    );
    setValue("files", laptopDetail?.productInfo.lstProductImageUrl);
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
      <h2 className="font-bold m-4 text-2xl">Cập nhật sản phẩm laptop</h2>
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
            placeholder="Vui lòng chọn"
            defaultValue={laptopDetail?.productInfo?.brandId}
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
            placeholder=" macOs "
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
            placeholder="Vui lòng chọn"
            defaultValue={laptopDetail?.productInfo?.characteristicId}
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
            placeholder="MacBook Air 15 inch M2 2023"
            name="name"
            register={register}
            type="text"
            className=""
            errorMessage={errors.name?.message}
          />
        </Form.Item>
        {/* <Form.Item label="Thiết kế" name="design" rules={[{ required: true }]}>
          <Input
            name="design"
            register={register}
            type="text"
            className=""
            errorMessage={errors.design?.message}
            placeholder="Nguyên khối"
          />
        </Form.Item> */}
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
            placeholder=" 1.51 "
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
            {laptopDetail?.productInfo?.lstProductTypeAndPrice?.map(
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
              ),
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
            placeholder="15.3 inch"
          />
        </Form.Item>

        <Form.Item label="Cổng kết nối" name="gateway">
          <Input
            name="gateway"
            register={register}
            type="text"
            className=""
            errorMessage={errors.gateway?.message}
            placeholder="MagSafe 3"
          />
        </Form.Item>
        <Form.Item label="Tính năng đặc biệt" name="special">
          <Input
            name="special"
            register={register}
            type="text"
            className=""
            errorMessage={errors.special?.message}
            placeholder="Bảo mật vân tay"
          />
        </Form.Item>
        <Form.Item label="Ram tối đa" name="maximumRam">
          <Input
            name="maximumRam"
            register={register}
            type="text"
            className=""
            errorMessage={errors.maximumRam?.message}
            placeholder="16GB"
          />
        </Form.Item>
        <Form.Item label="Rom tối đa" name="maximumRom">
          <Input
            name="maximumRom"
            register={register}
            type="text"
            errorMessage={errors.maximumRom?.message}
            placeholder="512GB"
          />
        </Form.Item>
        <Form.Item label="Vi xử lý" name="processor">
          <SelectCustom
            className={"flex-1 text-black"}
            id="processor"
            placeholder="Vui lòng chọn"
            defaultValue={laptopDetail?.processorId}
            options={processor?.data?.data}
            register={register}
          >
            {errors.processor?.message}
          </SelectCustom>
        </Form.Item>
        <Form.Item label="Loại ram" name="ramId">
          <SelectCustom
            className={"flex-1 text-black"}
            id="ramId"
            placeholder="Vui lòng chọn"
            defaultValue={laptopDetail?.ramId}
            options={ram?.data?.data}
            register={register}
          >
            {errors.ramId?.message}
          </SelectCustom>
        </Form.Item>
        <Form.Item label="Loại ổ cứng" name="romId">
          <SelectCustom
            className={"flex-1 text-black"}
            id="romId"
            placeholder="Vui lòng chọn"
            defaultValue={laptopDetail?.romId}
            options={rom?.data?.data}
            register={register}
          >
            {errors.romId?.message}
          </SelectCustom>
        </Form.Item>
        <Form.Item label="Card đồ họa" name="graphicsCard">
          <SelectCustom
            className={"flex-1 text-black"}
            id="graphicsCard"
            placeholder="Vui lòng chọn"
            defaultValue={laptopDetail?.graphicsCardId}
            options={cardGraphic?.data?.data}
            register={register}
          >
            {errors.graphicsCard?.message}
          </SelectCustom>
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
            defaultValue={laptopDetail?.productInfo?.description}
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
                navigate(path.laptop);
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

export default () => <UpdateLaptop />;

