import { yupResolver } from "@hookform/resolvers/yup";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Form, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "src/components/Input";
import path from "src/constants/path";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { ErrorResponse } from "src/types/utils.type";
import { schemaBrand } from "src/utils/rules";
import { getAvatarUrl, isAxiosUnprocessableEntityError } from "src/utils/utils";
import {
  addBrand,
  getBrands,
  getDetailbrand,
  updateBrand,
} from "src/store/brand/brandSlice";
import { uploadManyImagesProductSmartPhone } from "src/store/product/smartPhoneSlice";
import InputFile from "../ListUser/InputFile";
import { getCategorysSlug } from "src/store/category/categorySlice";

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

interface FormData {
  name: string;
  address: string;
}

const UpdateBrand: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brandDetail, setBrandDetail] = useState<any>();

  const {
    handleSubmit,
    formState: { errors },
    setError,
    register,
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schemaBrand),
  });
  const [valueSlug, setValueSlug] = useState<
    { value: string; label: string; disabled?: boolean }[]
  >([]);
  const [valueSelect, setValueSelect] = useState("");
  const { categorySlug } = useAppSelector((state) => state.category);

  // Tạo một mảng chứa các URL tạm thời cho ảnh
  useEffect(() => {
    dispatch(getCategorysSlug({ pageSize: 100 }));
  }, []);
  useEffect(() => {
    const transformedArray = categorySlug?.data?.map((item: string) => {
      // You can customize the label as needed
      const label =
        item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, " ");

      return { value: item, label: label, disabled: false }; // You can set disabled based on your conditions
    });

    setValueSlug(transformedArray);
  }, [categorySlug]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [file, setFile] = useState<File>();
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : "";
  }, [file]);
  // Tạo một mảng chứa các URL tạm thời cho ảnh
  useEffect(() => {
    dispatch(getDetailbrand(id))
      .then(unwrapResult)
      .then((res) => {
        setBrandDetail(res.data.data);
      });
  }, []);

  useEffect(() => {
    setValue("address", brandDetail?.address);
    setValue("slug", brandDetail?.slug);
    setValue("name", brandDetail?.name);
  }, [brandDetail]);
  const onSubmit = handleSubmit(async (data) => {
    let images;

    if (file) {
      const form = new FormData();
      form.append("files", file);
      const res = await dispatch(uploadManyImagesProductSmartPhone(form));
      unwrapResult(res);
      const d = res?.payload?.data?.data;
      images = d[0].fileUrl;
      setValue("imageUrl", d[0].fileUrl);
    }
    const body = JSON.stringify({
      name: data.name,
      address: data.address,
      imageUrl: images,
      slug: valueSelect || "",
    });

    try {
      setIsSubmitting(true);
      const res = await dispatch(updateBrand({ id, body }));
      unwrapResult(res);
      const d = res?.payload?.data;
      // if (d?.code !== 200) return toast.error(d?.message);
      await toast.success("Cập nhật thương hiệu thành công ");
      await dispatch(getBrands({ pageNumber: 1 }));
      await navigate(path.brand);
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
    reset();
  };
  const avatar = watch("imageUrl");
  const handleChangeFile = (file?: File) => {
    setFile(file);
  };
  const handleChange = (value: string) => {
    setValueSelect(value);
  };
  return (
    <div className="bg-white shadow ">
      <h2 className="font-bold m-4 text-2xl">Cập nhật thương hiệu</h2>
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
          label="Tên nhãn hiệu"
          name="name"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Apple"
            name="name"
            register={register}
            type="text"
            className=""
            errorMessage={errors.name?.message}
          />
        </Form.Item>
        <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
          <Select
            defaultValue={brandDetail?.slug}
            style={{ width: 120 }}
            onChange={handleChange}
            options={valueSlug}
          />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address" rules={[{ required: true }]}>
          <Input
            placeholder="..."
            name="address"
            register={register}
            type="text"
            className=""
            errorMessage={errors.address?.message}
          />
        </Form.Item>
        <Form.Item
          name="files"
          label="Hình ảnh"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <div className="flex flex-col items-start ">
            <div className="my-5 w-24 space-y-5 justify-between items-center">
              <img
                src={previewImage || getAvatarUrl(avatar)}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <InputFile onChange={handleChangeFile} />
            <div className="mt-3  flex flex-col items-center text-red-500">
              <div>Dụng lượng file tối đa 2 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </div>
            {/* {errors.images?.message} */}
          </div>
        </Form.Item>
        <div className="flex justify-start">
          <Form.Item label="" className="ml-[115px] mb-2">
            <Button className="w-[100px]" onClick={onSubmit}>
              {isSubmitting ? "Loading..." : "Lưu"}
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

export default () => <UpdateBrand />;

