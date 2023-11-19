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
import { schemaLaptop } from "src/utils/rules";
import {
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
  monitor: string;
}

const NewLaptop: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setError,
    register,
    setValue,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(schemaLaptop),
  });
  const { nameId } = useParams();
  const id = getIdFromNameId(nameId as string);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { category } = useAppSelector((state) => state.category);
  const { cardGraphic } = useAppSelector((state) => state.cardGraphic);
  const { ram } = useAppSelector((state) => state.ram);
  const { depot } = useAppSelector((state) => state.depot);
  const { rom } = useAppSelector((state) => state.rom);
  const { processor } = useAppSelector((state) => state.processor);
  const { character } = useAppSelector((state) => state.character);
  const { brand } = useAppSelector((state) => state.brand);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "lstProductTypeAndPrice", // unique name for your Field Array
    }
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

  // Tạo một mảng chứa các URL tạm thời cho ảnh
  const imageUrls: string[] = [];

  for (const image of imageArray) {
    const imageUrl = URL.createObjectURL(image);
    imageUrls.push(imageUrl);
  }
  useEffect(() => {
    setValue("ram", laptopDetail?.productInfo?.lstProductTypeAndPrice[0]?.ram);
    setValue("accessories", laptopDetail?.productInfo?.accessories);
    setValue("mass", laptopDetail?.productInfo?.mass.toString());
    setValue(
      "color",
      laptopDetail?.productInfo?.lstProductTypeAndPrice[0]?.color.toString()
    );
    setValue("monitor", laptopDetail?.monitor);
    setValue("description", laptopDetail?.productInfo?.description);
    setValue("brand", laptopDetail?.productInfo?.brandId.toString());
    setValue(
      "characteristic",
      laptopDetail?.productInfo?.characteristicId.toString()
    );
    setValue("name", laptopDetail?.productInfo?.name);
    setValue(
      "salePrice",
      laptopDetail?.productInfo?.lstProductTypeAndPrice[0]?.salePrice.toString()
    );
    setValue(
      "price",
      laptopDetail?.productInfo?.lstProductTypeAndPrice[0].price.toString()
    );
    setValue("operatingSystem", laptopDetail?.operatingSystem);
    setValue("design", laptopDetail?.productInfo?.design);
    setValue("dimension", laptopDetail?.productInfo?.dimension);
    setValue("category", laptopDetail?.productInfo?.categoryId.toString());
    setValue("launchTime", "2023");
    setValue("gateway", laptopDetail?.gateway);
    setValue("imageUrl", laptopDetail?.productInfo?.lstProductImageUrl);
  }, [laptopDetail]);

  const onSubmit = handleSubmit(async (data) => {
    const body: any = JSON.stringify({
      gateway: data.gateway,
      special: data.special,
      maximumRam: Number(data.maximumRam),
      maximumRom: Number(data.maximumRom),
      processorId: Number(data.processor),
      ramId: Number(data.ramId),
      romId: Number(data.romId),
      graphicsCardId: Number(data.graphicsCard),
      productInfo: {
        brandId: Number(data.brand),
        categoryId: Number(data.category),
        productId: Number(laptopDetail?.productInfo?.productId),
        characteristicId: Number(data.characteristic),
        productCode: laptopDetail?.productInfo?.productCode,
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
            typeId:
              laptopDetail?.productInfo?.lstProductTypeAndPrice[index].typeId,
            ram: item?.ram,
            storageCapacity: item?.storageCapacity,
            color: item?.color,
            price: Number(item?.price),
            salePrice: Number(item?.salePrice),
            depotId: Number(item?.depotId) || 1,
            quantity: Number(item?.quantity),
          })
        ),
        lstProductImageUrl: data.imageUrl,
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
    // if (file) {
    //   const form = new FormData();
    //   form.append("file", file[0]);
    //   form.append("image", file[0]);
    // } else {
    //   toast.warning("Cần chọn ảnh");
    // }

    try {
      setIsSubmitting(true);
      const res = await dispatch(updateLaptop({ id, body }));
      unwrapResult(res);
      const d = res?.payload?.data;
      if (d?.code !== 200) return toast.error(d?.message);
      await toast.success("Cập nhật sp laptop thành công ");
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
    }
  });
  const onClickHuy = () => {
    setValue("ram", laptopDetail?.productInfo?.lstProductTypeAndPrice[0]?.ram);
    setValue("accessories", laptopDetail?.productInfo?.accessories);
    setValue("mass", laptopDetail?.productInfo?.mass.toString());
    setValue(
      "color",
      laptopDetail?.productInfo?.lstProductTypeAndPrice[0]?.color.toString()
    );
    setValue("monitor", laptopDetail?.monitor);
    setValue("description", laptopDetail?.productInfo?.description);
    setValue("accessories", laptopDetail?.productInfo?.accessories);
    setValue("brand", laptopDetail?.productInfo?.brandId.toString());
    setValue(
      "characteristic",
      laptopDetail?.productInfo?.characteristicId.toString()
    );
    setValue("name", laptopDetail?.productInfo?.name);
    setValue(
      "salePrice",
      laptopDetail?.productInfo?.lstProductTypeAndPrice[0].salePrice.toString()
    );
    setValue(
      "price",
      laptopDetail?.productInfo?.lstProductTypeAndPrice[0].price.toString()
    );
    setValue("operatingSystem", laptopDetail?.operatingSystem);
    setValue("design", laptopDetail?.productInfo?.design);
    setValue("dimension", laptopDetail?.productInfo?.dimension);
    setValue("category", laptopDetail?.productInfo?.categoryId.toString());
    setValue("launchTime", "2023");
    setValue("imageUrl", laptopDetail?.productInfo?.lstProductImageUrl);
  };
  const handleChangeFile = (file?: File[]) => {
    setFile(file);
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
          label="Danh mục sản phẩm"
          name=""
          rules={[{ required: true }]}
        >
          <SelectCustom
            className={"flex-1 text-black"}
            id="category"
            // label="Hãng xe"
            placeholder="Vui lòng chọn"
            defaultValue={laptopDetail?.productInfo.categoryId}
            options={category?.data}
            register={register}
          >
            {errors.category?.message}
          </SelectCustom>
        </Form.Item>
        <Form.Item
          label="Hãng sản xuất"
          name="brand"
          rules={[{ required: true }]}
        >
          <SelectCustom
            className={"flex-1 text-black"}
            id="brand"
            // label="Hãng xe"
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
          <SelectCustom
            className={"flex-1 text-black"}
            id="operatingSystem"
            // label="Hãng xe"
            placeholder="Vui lòng chọn"
            defaultValue={"macOs"}
            options={[
              { id: "macOs", name: "macOs" },
              { id: "Windows", name: "Windows" },
            ]}
            register={register}
          >
            {errors.operatingSystem?.message}
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
            placeholder="Vui lòng chọn"
            defaultValue={laptopDetail?.productInfo.characteristicId}
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
            defaultValue={laptopDetail?.productInfo.name}
            className=""
            errorMessage={errors.name?.message}
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
            defaultValue={laptopDetail?.productInfo.dimension}
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
            defaultValue={laptopDetail?.productInfo.mass}
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
            defaultValue={laptopDetail?.productInfo.launchTime}
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
            defaultValue={laptopDetail?.productInfo.accessories}
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
                        defaultValue={item.ram}
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
                        defaultValue={item.storageCapacity}
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
                        defaultValue={item.price}
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
                        defaultValue={item.salePrice}
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
                      placeholder="Vui lòng chọn"
                      defaultValue={item.depotId}
                      options={depot?.data?.data}
                      register={register}
                    >
                      {errors.depot?.message}
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
                        defaultValue={item.quantity}
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
                        defaultValue={item.color}
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
              )
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
            defaultValue={laptopDetail?.monitor}
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
            defaultValue={laptopDetail?.gateway}
          />
        </Form.Item>
        <Form.Item label="Tính năng đặc biệt" name="special">
          <Input
            name="special"
            register={register}
            type="text"
            className=""
            defaultValue={laptopDetail?.special}
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
            defaultValue={laptopDetail?.maximumRam}
            errorMessage={errors.maximumRam?.message}
            placeholder="16GB"
          />
        </Form.Item>
        <Form.Item label="Rom tối đa" name="maximumRom">
          <Input
            name="maximumRom"
            register={register}
            type="text"
            defaultValue={laptopDetail?.maximumRom}
            errorMessage={errors.maximumRom?.message}
            placeholder="512GB"
          />
        </Form.Item>
        <Form.Item label="Vi xử lý" name="processor">
          <SelectCustom
            className={"flex-1 text-black"}
            id="processor"
            // label="Hãng xe"
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
            // label="Hãng xe"
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
            // label="Hãng xe"
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
            // label="Hãng xe"
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
          //
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
              Lưu
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

export default () => <NewLaptop />;
