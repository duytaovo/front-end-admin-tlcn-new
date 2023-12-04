import { PlusOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { unwrapResult } from "@reduxjs/toolkit";
import InputFile from "src/components/InputFile";

import { Button, Form, Upload } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "src/components/Input";
import SelectCustom from "src/components/Select";
import path from "src/constants/path";
import { useAppDispatch } from "src/hooks/useRedux";
import { getDetailUser, getUsers, updateUser } from "src/store/user/userSlice";
import { ErrorResponse } from "src/types/utils.type";
import { schemaAddUser } from "src/utils/rules";
import { isAxiosUnprocessableEntityError } from "src/utils/utils";

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
interface FormData {
  gender: string | undefined;
  phoneNumber: string;
  name: string;
  email: string;
  password: string;
  fullName: string | undefined;
  address: string;
  imageUrl: string | undefined;
}
const FormDisabledDemo: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [file, setFile] = useState<File[]>();
  const imageArray = file || []; // Mảng chứa các đối tượng ảnh (File hoặc Blob)

  // Tạo một mảng chứa các URL tạm thời cho ảnh
  const imageUrls: string[] = [];

  for (const image of imageArray) {
    const imageUrl = URL.createObjectURL(image);
    imageUrls.push(imageUrl);
  }
  const { id } = useParams();
  const [userDetail, setUserDetail] = useState<any>();
  const {
    handleSubmit,
    formState: { errors },
    setError,
    register,
    setValue,
  } = useForm({
    resolver: yupResolver(schemaAddUser),
  });
  useEffect(() => {
    dispatch(getDetailUser(id))
      .then(unwrapResult)
      .then((res) => {
        setUserDetail(res.data.data);
      });
  }, []);

  useEffect(() => {
    setValue("address", userDetail?.address);
    setValue("email", userDetail?.email);
    setValue("imageUrl", userDetail?.avatar);
    setValue("fullName", userDetail?.fullName);
    setValue("phoneNumber", userDetail?.phoneNumber);
  }, [userDetail]);

  const onSubmit = handleSubmit(async (data) => {
    const body = JSON.stringify({
      email: data.email,
      address: data.address,
      password: data.password,
      name: data.name,
      phoneNumber: data.phoneNumber,
      fullname: data.fullName,
      gender: data.gender,
    });
    // if (file) {
    //   const form = new FormData();
    //   form.append("file", file[0]);
    //   form.append("image", file[0]);
    //   const res = await dispatch(uploadAvatar(uploadAvatar));
    //   unwrapResult(res);
    // } else {
    //   toast.warning("Cần chọn ảnh");
    // }

    try {
      setIsSubmitting(true);
      const res = await dispatch(updateUser({ id: id, body: body }));
      unwrapResult(res);
      const d = res?.payload;
      if (d?.code !== 200) return toast.error(d?.message);
      await toast.success("Cập nhật người dùng thành công ");
      await dispatch(getUsers(""));
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
    setValue("address", userDetail?.address);
    setValue("email", userDetail?.email);
    setValue("imageUrl", userDetail?.avatar);
    setValue("fullName", userDetail?.fullName);
    setValue("phoneNumber", userDetail?.phoneNumber);
  };
  const handleChangeFile = (file?: File[]) => {
    setFile(file);
  };
  return (
    <div className="bg-white shadow ">
      <h2 className="font-bold m-4 text-2xl">Cập nhật người dùng</h2>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600, padding: 5 }}
        autoComplete="off"
        noValidate
        onSubmitCapture={onSubmit}
      >
        <Form.Item label="Giới tính" name="gender" rules={[{ required: true }]}>
          <SelectCustom
            className={"flex-1 text-black"}
            id="gender"
            // label="Hãng xe"
            placeholder="Giới tính"
            defaultValue={""}
            options={[
              { id: 1, name: "Nam" },
              { id: 2, name: "Nữ" },
            ]}
            register={register}
            isBrand={true}
          >
            {errors.gender?.message}
          </SelectCustom>
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input
            name="email"
            register={register}
            type="text"
            className=""
            errorMessage={errors.email?.message}
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input
            name="password"
            register={register}
            type="text"
            className=""
            errorMessage={errors.password?.message}
          />
        </Form.Item>
        {/* <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
          <Input
            name="name"
            register={register}
            type="text"
            className=""
            errorMessage={errors.name?.message}
          />
        </Form.Item> */}
        <Form.Item
          name="fullname"
          label="Họ và Tên"
          rules={[{ required: true }]}
        >
          <Input
            name="fullName"
            register={register}
            type="text"
            className=""
            errorMessage={errors.fullName?.message}
          />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address">
          <Input
            name="address"
            register={register}
            type="text"
            className=""
            errorMessage={errors.address?.message}
          />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[{ required: true }]}
        >
          <Input
            name="phoneNumber"
            register={register}
            type="text"
            className=""
            errorMessage={errors.phoneNumber?.message}
          />
        </Form.Item>
        <Form.Item
          name="files"
          // rules={[{ required: true }]}
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
        <div className="flex justify-start">
          <Form.Item label="" className="ml-[100px] mb-2">
            <Button className="w-[100px]" onClick={onSubmit}>
              Lưu
            </Button>
          </Form.Item>
          <Form.Item label="" className="ml-[20px] mb-2">
            <Button className="w-[100px]" onClick={onClickHuy}>
              Đặt lại
            </Button>
          </Form.Item>
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

