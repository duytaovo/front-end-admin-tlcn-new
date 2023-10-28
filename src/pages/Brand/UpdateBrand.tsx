import { PlusOutlined } from "@ant-design/icons";

import { yupResolver } from "@hookform/resolvers/yup";
import { unwrapResult } from "@reduxjs/toolkit";

import { Button, DatePicker, Form, Radio, TreeSelect, Upload } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "src/components/Input";
import path from "src/constants/path";
import { useAppDispatch } from "src/hooks/useRedux";
import { addUser, getUser } from "src/store/user/userSlice";
import { ErrorResponse } from "src/types/utils.type";
import { schemaAddUser, schemaProduct } from "src/utils/rules";
import { isAxiosUnprocessableEntityError } from "src/utils/utils";
import SelectCustom from "src/components/Select";
import { FormControl, MenuItem, Select } from "@mui/material";
import Textarea from "src/components/Textarea";
const { RangePicker } = DatePicker;

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
  const {
    handleSubmit,
    formState: { errors },
    setError,
    register,
    setValue,
  } = useForm({
    resolver: yupResolver(schemaProduct),
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
      <h2 className="font-bold m-4 text-2xl">Thêm thương hiệu</h2>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600, padding: 5 }}
      >
        <Form.Item label="Loại sản phẩm" className="rounded-3xl">
          {/* <TreeSelect
            treeData={[
              {
                title: "Laptop",
                value: "laptop",
                children: [{ title: "Bamboo", value: "bamboo" }],
              },
              {
                title: "Điện thoại",
                value: "phone",
                children: [{ title: "Bamboo", value: "bamboo" }],
              },
              {
                title: "Tablet",
                value: "tablet",
                children: [{ title: "Bamboo", value: "bamboo" }],
              },
            ]}
          /> */}
          <SelectCustom
            className={"flex-1 text-black"}
            id="carBrand"
            // label="Hãng xe"
            placeholder="Vui lòng chọn"
            defaultValue={""}
            options={["Điện thoại", "Laptop", "Tablet", "Phụ kiện"]}
            register={register}
            isBrand={true}
            // disabled={false}

            // onChange={handleOnChangeCarBrand}
          >
            {errors.loaiSp?.message}
          </SelectCustom>
        </Form.Item>

        <Form.Item label="Tên thương hiệu">
          <Input
            name="name"
            register={register}
            type="text"
            className=""
            errorMessage={errors.name?.message}
          />
        </Form.Item>
        {/* <Form.Item label="slug">
          <Input name="slug" />
        </Form.Item> */}
        {/* <Form.Item label="Hãng sản xuất">
          <Input
            name="model"
            register={register}
            type="text"
            className=""
            errorMessage={errors.model?.message}
          />
        </Form.Item> */}
        {/* <Form.Item label="Giá sản phẩm">
          <Input
            name="price"
            register={register}
            type="text"
            className=""
            errorMessage={errors.price?.message}
          />
        </Form.Item> */}
        {/* <Form.Item label="Khuyến mãi">
          <Input
            name="sale"
            register={register}
            type="text"
            className=""
            errorMessage={errors.sale?.message}
          />
        </Form.Item> */}
        <Form.Item label="Mô tả">
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
          label="Upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload action="/upload.do" listType="picture-card">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
        <div className="flex justify-start">
          <Form.Item label="" className="ml-[115px] mb-2">
            <Button className="w-[100px]" onClick={onSubmit}>
              Lưu
            </Button>
          </Form.Item>
          {/* <Form.Item label="" className="ml-[100px] mb-2">
            <Button className="w-[100px]" onClick={onClickHuy}>
              Đặt lại
            </Button>
          </Form.Item> */}
          <Form.Item label="" className="ml-[20px] mb-2">
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
