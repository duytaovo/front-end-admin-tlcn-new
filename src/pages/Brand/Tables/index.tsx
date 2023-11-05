import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { SelectChangeEvent } from "@mui/material/Select";
import path from "src/constants/path";
import React, { useEffect, useState } from "react";
import { Button, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { deleteBrand, getBrands } from "src/store/brand/brandSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

interface DataType {
  key: React.Key;
  name: string;
  action?: any;
  address: string;
  category?: string;
}

// const originData: DataType[] = [];
// for (let i = 0; i < 100; i++) {
//   originData.push({
//     key: i.toString(),
//     name: `Edward ${i}`,
//     age: 32,
//     address: `London Park no. ${i}`,
//   });
// }

const TableBrand: React.FC = () => {
  const dispatch = useAppDispatch();
  const { brand } = useAppSelector((state) => state.brand);
  const columns: ColumnsType<DataType> = [
    // { title: "Loại sản phẩm", dataIndex: "category", key: "category" },
    { title: "Tên thương hiệu", dataIndex: "name", key: "name" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (params) => {
        const { key, id } = params;
        const handleDelete = async () => {
          const res = await dispatch(deleteBrand(id));
          unwrapResult(res);
          const d = res?.payload;
          if (d?.status !== 200) return toast.error(d?.message);
          await toast.success("Xóa nhãn hiệu thành công ");
          await dispatch(getBrands(""));
        };
        return (
          <Space>
            <Link to={`${path.brandDetail}/${id}`}>
              {" "}
              <IconButton className="text-mainColor">
                <EditIcon
                  className="text-mainColor"
                  sx={{
                    color: "",
                  }}
                />
              </IconButton>
            </Link>
            {/* <Link to={path.users}> */}
            <Tooltip title="Thay đổi trạng thái" className="disabled:bg-white">
              <IconButton onClick={handleDelete}>
                <DeleteIcon className="text-red-700" />
              </IconButton>
            </Tooltip>
            {/* </Link> */}
          </Space>
        );
      },
    },
  ];
  useEffect(() => {
    dispatch(getBrands(""));
  }, []);
  const originData: DataType[] = [];
  for (let i = 0; i < brand?.length; i++) {
    originData.push({
      key: i.toString(),
      name: brand[i].name,
      address: brand[i].address,
    });
  }

  return (
    <div className="mx-6">
      <div className="w-full text-[24px] text-gray-500 mb-[10px] flex items-center justify-between">
        Quản lý thương hiệu
        <Link
          to={path.brandNew}
          className="no-underline text-green-500 text-lg font-medium border-[1px] border-solid border-[green] p-3 rounded cursor-pointer"
        >
          Thêm mới
        </Link>
      </div>

      <Table columns={columns} dataSource={originData} />
    </div>
  );
};

export default TableBrand;
