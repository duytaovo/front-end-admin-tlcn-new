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
import { schemaComputerPower } from "src/utils/rules";
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
  getComputerPower,
  getDetailComputerPower,
  updateComputerPower,
} from "src/store/accessory/computerPower";

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

const UpdateComputerPower: React.FC = () => {
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
  } = useForm({
    resolver: yupResolver(schemaComputerPower),
  });
  const { nameId } = useParams();
  const id = getIdFromNameId(nameId as string);
  const { computerPowerDetail } = useAppSelector(
    (state) => state.computerPower,
  );
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
  const [imageUrls, setImages] = useState<string[]>([]);

  const [file, setFile] = useState<File[]>();
  const imageArray = file || []; // Mảng chứa các đối tượng ảnh (File hoặc Blob)

  // Tạo một mảng chứa các URL tạm thời cho ảnh

  for (const image of imageArray) {
    const imageUrl = URL.createObjectURL(image);
    imageUrls.push(imageUrl);
  }
  useEffect(() => {
    dispatch(getDetailComputerPower(id));
  }, [id]);
  useEffect(() => {
    setImages(computerPowerDetail.productInfo.lstProductImageUrl);
    const productInfo = computerPowerDetail?.productInfo;

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
    setValue(
      "ram",
      computerPowerDetail?.productInfo?.lstProductTypeAndPrice[0]?.ram,
    );
    setValue("accessories", computerPowerDetail?.productInfo?.accessories);
    setValue("model", computerPowerDetail?.model);
    setValue("pfc", computerPowerDetail?.pfc);
    setValue("efficiency", computerPowerDetail?.efficiency);
    setValue("mass", computerPowerDetail?.productInfo?.mass.toString());
    setValue(
      "color",
      computerPowerDetail?.productInfo.lstProductTypeAndPrice[0].color.toString(),
    );
    setValue("modular", computerPowerDetail?.modular);
    setValue("voltage", computerPowerDetail?.networkSupport);
    setValue("description", computerPowerDetail?.productInfo?.description);
    setValue("brand", computerPowerDetail?.productInfo?.brandId.toString());
    setValue(
      "characteristic",
      computerPowerDetail?.productInfo?.characteristicId.toString(),
    );
    setValue("name", computerPowerDetail?.productInfo?.name);
    setValue("outputPower", computerPowerDetail?.outputPower);
    setValue(
      "salePrice",
      computerPowerDetail?.productInfo?.lstProductTypeAndPrice[0].salePrice.toString(),
    );
    setValue("powerExcursion", computerPowerDetail?.powerExcursion);
    setValue(
      "price",
      computerPowerDetail?.productInfo?.lstProductTypeAndPrice[0].price.toString(),
    );
    setValue("frequency", computerPowerDetail?.frequency);
    setValue("fan", computerPowerDetail?.fan);
    setValue("design", computerPowerDetail?.productInfo?.design);
    setValue("dimension", computerPowerDetail?.productInfo?.dimension);
    setValue(
      "category",
      computerPowerDetail?.productInfo?.categoryId.toString(),
    );
    setValue("launchTime", "2023");
    setValue("files", computerPowerDetail?.productInfo.lstProductImageUrl);
  }, [computerPowerDetail]);
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
    try {
      const body = JSON.stringify({
        productInfo: {
          brandId: Number(data.brand) || 1,
          categoryId: 19,
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
          lstProductTypeAndPrice: data?.lstProductTypeAndPrice?.map(
            (item, index) => ({
              typeId: Number(
                computerPowerDetail?.productInfo?.lstProductTypeAndPrice[index]
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
        model: data.model,
        pfc: data.pfc,
        efficiency: data.efficiency,
        modular: data.modular,
        voltage: data.voltage,
        outputPower: data.outputPower,
        powerExcursion: data.powerExcursion,
        frequency: data.frequency,
        fan: data.fan,
        certifications: "",
      });
      setIsSubmitting(true);
      const res = await dispatch(updateComputerPower(body));
      unwrapResult(res);
      const d = res?.payload?.data;
      if (d?.code !== 200) return toast.error(d?.message);
      await toast.success("Cập nhật sản phẩm thành công ");
      dispatch(
        getComputerPower({
          // params: { pageNumber: 1, pageSize: 10 },
        }),
      );
      await navigate(path.computerPower);
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
    setImages(computerPowerDetail.productInfo.lstProductImageUrl);
    const productInfo = computerPowerDetail?.productInfo;

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
    setValue(
      "ram",
      computerPowerDetail?.productInfo?.lstProductTypeAndPrice[0]?.ram,
    );
    setValue("accessories", computerPowerDetail?.productInfo?.accessories);
    setValue("model", computerPowerDetail?.model);
    setValue("pfc", computerPowerDetail?.pfc);
    setValue("efficiency", computerPowerDetail?.efficiency);
    setValue("mass", computerPowerDetail?.productInfo?.mass.toString());
    setValue(
      "color",
      computerPowerDetail?.productInfo.lstProductTypeAndPrice[0].color.toString(),
    );
    setValue("modular", computerPowerDetail?.modular);
    setValue("voltage", computerPowerDetail?.networkSupport);
    setValue("description", computerPowerDetail?.productInfo?.description);
    setValue("brand", computerPowerDetail?.productInfo?.brandId.toString());
    setValue(
      "characteristic",
      computerPowerDetail?.productInfo?.characteristicId.toString(),
    );
    setValue("name", computerPowerDetail?.productInfo?.name);
    setValue("outputPower", computerPowerDetail?.outputPower);
    setValue(
      "salePrice",
      computerPowerDetail?.productInfo?.lstProductTypeAndPrice[0].salePrice.toString(),
    );
    setValue("powerExcursion", computerPowerDetail?.powerExcursion);
    setValue(
      "price",
      computerPowerDetail?.productInfo?.lstProductTypeAndPrice[0].price.toString(),
    );
    setValue("frequency", computerPowerDetail?.frequency);
    setValue("fan", computerPowerDetail?.fan);
    setValue("design", computerPowerDetail?.productInfo?.design);
    setValue("dimension", computerPowerDetail?.productInfo?.dimension);
    setValue(
      "category",
      computerPowerDetail?.productInfo?.categoryId.toString(),
    );
    setValue("launchTime", "2023");
    setValue("files", computerPowerDetail?.productInfo.lstProductImageUrl);
  };
  const handleChangeFile = (file?: File[]) => {
    setFile(file);
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

        <Form.Item label="Kiểu" name="model" rules={[{ required: true }]}>
          <Input
            name="model"
            register={register}
            type="text"
            className=""
            errorMessage={errors.model?.message}
            placeholder="6.7 - Tần số quét 120 Hz"
          />
        </Form.Item>

        <Form.Item label="Mô đun" name="modular" rules={[{ required: true }]}>
          <Input
            name="modular"
            register={register}
            type="text"
            className=""
            errorMessage={errors.modular?.message}
            placeholder="12 MP"
          />
        </Form.Item>
        <Form.Item
          label="Hiệu quả"
          name="efficiency"
          rules={[{ required: true }]}
        >
          <Input
            name="efficiency"
            register={register}
            type="text"
            className=""
            errorMessage={errors.efficiency?.message}
            placeholder="Chính 48 MP & Phụ 12 MP, 12 MP"
          />
        </Form.Item>
        <Form.Item label="Vôn" name="voltage" rules={[{ required: true }]}>
          <Input
            name="voltage"
            register={register}
            type="text"
            className=""
            errorMessage={errors.voltage?.message}
            placeholder=""
          />
        </Form.Item>
        <Form.Item
          label="Công suất ra"
          name="outputPower"
          rules={[{ required: true }]}
        >
          <Input
            name="outputPower"
            register={register}
            type="text"
            className=""
            errorMessage={errors.outputPower?.message}
            // placeholder="1 Nano SIM & 1 eSIM"
          />
        </Form.Item>
        <Form.Item
          label="Năng lượng"
          name="powerExcursion"
          rules={[{ required: true }]}
        >
          <Input
            name="powerExcursion"
            register={register}
            type="text"
            className=""
            errorMessage={errors.powerExcursion?.message}
            placeholder="4422 mAh"
          />
        </Form.Item>
        <Form.Item
          label="Tính thường xuyên"
          name="frequency"
          rules={[{ required: true }]}
        >
          <Input
            name="frequency"
            register={register}
            type="text"
            className=""
            errorMessage={errors.frequency?.message}
            placeholder="20 W"
          />
        </Form.Item>
        <Form.Item label="Quạt" name="fan" rules={[{ required: true }]}>
          <Input
            name="fan"
            register={register}
            type="text"
            className=""
            errorMessage={errors.fan?.message}
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
                navigate(path.computerPower);
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

export default () => <UpdateComputerPower />;

