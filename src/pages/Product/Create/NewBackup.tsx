import { PlusOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Form, Modal } from "antd";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "src/components/Input";
import path from "src/constants/path";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { ErrorResponse } from "src/types/utils.type";
import { schemaBackup } from "src/utils/rules";
import {
  generateRandomString,
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
  addBackupCharger,
  getBackupCharger,
} from "src/store/accessory/backupCharger";

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

const NewBackup: React.FC = () => {
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
    watch,
  } = useForm({
    resolver: yupResolver(schemaBackup),
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { category } = useAppSelector((state) => state.category);
  const { character } = useAppSelector((state) => state.character);
  const { depot } = useAppSelector((state) => state.depot);
  const { brand } = useAppSelector((state) => state.brand);
  useEffect(() => {
    dispatch(getCategorys({ pageSize: 100 }));
    dispatch(getCharacters({ pageSize: 100 }));
    dispatch(getBrands({ pageSize: 100 }));
    dispatch(getdepots({ pageSize: 100 }));
  }, []);

  const [file, setFile] = useState<File[]>();
  const imageArray = file || []; // Mảng chứa các đối tượng ảnh (File hoặc Blob)

  // Tạo một mảng chứa các URL tạm thời cho ảnh
  const imageUrls: string[] = [];

  for (const image of imageArray) {
    const imageUrl = URL.createObjectURL(image);
    imageUrls.push(imageUrl);
  }
  useEffect(() => {
    reset();
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
      const body = JSON.stringify({
        productInfo: {
          brandId: Number(data.brand) || 1,
          categoryId: 21,
          productId: null,
          characteristicId: Number(data.characteristic) || 1,
          productCode: generateRandomString(10),
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
            depotId: Number(item?.depotId),
          })),

          lstProductImageUrl: images || [],
        },
        chargingPerformance: data.chargingPerformance,
        batteryCapacity: data.batteryCapacity,
        batteryChargingTime: data.batteryChargingTime,
        input: data.input,
        output: data.output,
        batteryCore: data.batteryCore,
        technology: data.technology,
      });
      const res = await dispatch(addBackupCharger(body));
      unwrapResult(res);
      const d = res?.payload?.data;
      if (d?.code !== 200) return toast.error(d?.message);
      await toast.success("Thêm sản phẩm thành công ");
      dispatch(getBackupCharger({}));
      await navigate(path.backupCharger);
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
    reset();
  };
  const handleChangeFile = (file?: File[]) => {
    setFile(file);
  };

  return (
    <div className="bg-white shadow ">
      <h2 className="font-bold m-4 text-2xl">Thêm sản phẩm </h2>
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
          label="Dung lượng pin"
          name="batteryCapacity"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Điện thoại iPhone 15 Pro Max 1TB"
            name="batteryCapacity"
            register={register}
            type="text"
            className=""
            errorMessage={errors.batteryCapacity?.message}
          />
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
          label="Hiệu suất"
          name="chargingPerformance"
          rules={[{ required: true }]}
        >
          <Input
            name="chargingPerformance"
            register={register}
            type="text"
            className=""
            errorMessage={errors.chargingPerformance?.message}
            placeholder=""
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
          label="Camera sau"
          name="batteryChargingTime"
          rules={[{ required: true }]}
        >
          <Input
            name="batteryChargingTime"
            register={register}
            type="text"
            className=""
            errorMessage={errors.batteryChargingTime?.message}
            placeholder=""
          />
        </Form.Item>
        <Form.Item label="Đầu ra" name="output" rules={[{ required: true }]}>
          <Input
            name="output"
            register={register}
            type="text"
            className=""
            errorMessage={errors.output?.message}
            placeholder=""
          />
        </Form.Item>
        <Form.Item
          label="Lõi pin"
          name="batteryCore"
          rules={[{ required: true }]}
        >
          <Input
            name="batteryCore"
            register={register}
            type="text"
            className=""
            errorMessage={errors.batteryCore?.message}
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
      <Modal
        title="Thêm sản phẩm"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Đang xử lý, vui lòng đợi...</p>
      </Modal>
    </div>
  );
};

export default () => <NewBackup />;

