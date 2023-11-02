import { PlusOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Form, Radio, RadioChangeEvent, Upload } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "src/components/Input";
import path from "src/constants/path";
import { useAppDispatch } from "src/hooks/useRedux";
import { addUser, getUser } from "src/store/user/userSlice";
import { ErrorResponse } from "src/types/utils.type";
import { isAxiosUnprocessableEntityError } from "src/utils/utils";
import SelectCustom from "src/components/Select";

import Textarea from "src/components/Textarea";
import { schemaSmartWatch } from "src/utils/rules";

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

interface FormData {
  loaiSp: string;
  model: string;
  mota: string;
  name: string;
  price: string;
  sale: string;
  upload: string;
  pin: string;
  face: string;
  healcare: string;
  sex: string;
}
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const FormDisabledDemo: React.FC = () => {
  const [componentDisabled, setComponentDisabled] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [value, setValueSex] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setValueSex(e.target.value);
  };
  const {
    handleSubmit,
    formState: { errors },
    setError,
    register,
    setValue,
  } = useForm({
    resolver: yupResolver(schemaSmartWatch),
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [file, setFile] = useState<File[]>();
  useEffect(() => {
    setValue("loaiSp", "");
    setValue("model", "");
    setValue("mota", "");
    setValue("name", "");
    setValue("price", "");
    setValue("sale", "");
    setValue("upload", "");
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    const body = JSON.stringify({});
    if (file) {
      const form = new FormData();
      form.append("file", file[0]);
      form.append("image", file[0]);
    } else {
      toast.warning("Cần chọn ảnh");
    }

    try {
      setIsSubmitting(true);
      const res = await dispatch(addUser(body));
      unwrapResult(res);
      const d = res?.payload?.data;
      if (d?.status !== 200) return toast.error(d?.message);
      await toast.success("Thêm thành công ");
      await dispatch(getUser(""));
      await navigate(path.users);
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
    setValue("loaiSp", "");
    setValue("model", "");
    setValue("mota", "");
    setValue("name", "");
    setValue("price", "");
    setValue("sale", "");
    setValue("upload", "");
  };

  return (
    <div className="bg-white shadow ">
      <h2 className="font-bold m-4 text-2xl">Thêm phụ kiện</h2>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 700, padding: 6 }}
        autoComplete="off"
        noValidate
        onSubmitCapture={onSubmit}
      >
        <Form.Item
          label="Loại sản phẩm"
          className="rounded-3xl"
          name="loaiSp"
          rules={[{ required: true }]}
        >
          <Input
            name="loaiSp"
            register={register}
            type="text"
            className=""
            errorMessage={errors.loaiSp?.message}
            value="Phụ kiện"
            disabled
            placeholder="Phụ kiện"
          />
        </Form.Item>
        {/* <Form.Item label="Giới tính" name="sex" rules={[{ required: true }]}>
          <Radio.Group onChange={onChange} value={value}>
            <Radio value={"Nam"}>Nam </Radio>
            <Radio value={"Nữ"}>Nữ</Radio>
          </Radio.Group>
          {errors.sex?.message}
        </Form.Item> */}

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
          label="Hãng sản xuất"
          name="model"
          rules={[{ required: true }]}
        >
          <SelectCustom
            className={"flex-1 text-black"}
            id="carBrand"
            // label="Hãng xe"
            placeholder="Vui lòng chọn"
            defaultValue={""}
            options={[
              "Apple",
              "Samsung",
              "Oppo",
              "Xiaomi",
              "Vivo",
              "Readmi",
              "Nokia",
              "Mastel",
            ]}
            register={register}
            isBrand={true}
          >
            {errors.loaiSp?.message}
          </SelectCustom>
        </Form.Item>
        {/* <Form.Item
          label="Mặt sản phẩm"
          name="face"
          rules={[{ required: true }]}
        >
          <Input
            name="face"
            register={register}
            type="text"
            className=""
            errorMessage={errors.face?.message}
          />
        </Form.Item> */}
        {/* <Form.Item
          label="Sức khỏe "
          name="healcare"
          rules={[{ required: true }]}
        >
          <Input
            name="healcare"
            register={register}
            type="text"
            className=""
            errorMessage={errors.healcare?.message}
          />
        </Form.Item> */}
        <Form.Item
          label="Giá sản phẩm"
          name="price"
          rules={[{ required: true }]}
        >
          <Input
            name="price"
            register={register}
            type="text"
            className=""
            errorMessage={errors.price?.message}
          />
        </Form.Item>
        <Form.Item label="Khuyến mãi" name="sale">
          <Input
            name="sale"
            register={register}
            type="text"
            className=""
            errorMessage={errors.sale?.message}
          />
        </Form.Item>
        <Form.Item label="Mô tả" name="mota" rules={[{ required: true }]}>
          <Textarea
            defaultValue="Mô tả sản phẩm"
            id="mota"
            isUpdate={false}
            register={register}
            setValue={() => {}}
            textAlign={"left"}
          />
        </Form.Item>
        <Form.Item
          name="file"
          rules={[{ required: true }]}
          label="Hình ảnh"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload action="/upload.do" listType="picture-card">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Hình ảnh</div>
            </div>
          </Upload>
        </Form.Item>
        <div className="flex justify-start">
          <Form.Item label="" className="ml-[115px] mb-2">
            <Button className="w-[100px]" onClick={onSubmit}>
              Lưu
            </Button>
          </Form.Item>
          <Form.Item label="" className="ml-[50px] mb-2">
            <Button className="w-[100px]" onClick={onClickHuy}>
              Đặt lại
            </Button>
          </Form.Item>
          <Form.Item label="" className="ml-[50px] mb-2">
            <Button
              className="w-[100px]"
              onClick={() => {
                navigate(path.users);
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

export default () => <FormDisabledDemo />;
