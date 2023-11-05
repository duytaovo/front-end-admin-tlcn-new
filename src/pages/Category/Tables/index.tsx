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
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getCategorys } from "src/store/category/categorySlice";

interface DataType {
  key: React.Key;
  name: string;
  status?: any;
  action?: any;
}

const TableProduct: React.FC = () => {
  const dispatch = useAppDispatch();
  const { category } = useAppSelector((state) => state.category);

  const columns: ColumnsType<DataType> = [
    { title: "Tên danh mục", dataIndex: "name", key: "name" },
    // {
    //   title: "Action",
    //   dataIndex: "",
    //   key: "x",
    //   render: () => (
    //     <Space>
    //       <Link to={path.category}>
    //         {" "}
    //         <IconButton className="text-mainColor">
    //           <EditIcon
    //             className="text-mainColor"
    //             sx={{
    //               color: "",
    //             }}
    //           />
    //         </IconButton>
    //       </Link>
    //       <Link to={path.users}>
    //         <Tooltip title="Thay đổi trạng thái " className="disabled:bg-white">
    //           <IconButton>
    //             <DeleteIcon className="text-red-700" />
    //           </IconButton>
    //         </Tooltip>
    //       </Link>
    //     </Space>
    //   ),
    // },
  ];
  const originData: DataType[] = [];
  for (let i = 0; i < category.length; i++) {
    originData.push({
      key: i.toString(),
      name: category[i].name,
    });
  }
  useEffect(() => {
    dispatch(getCategorys(""));
  }, []);
  console.log(category);
  return (
    <div className="mx-6">
      <div className="w-full text-[24px] text-gray-500 mb-[10px] flex items-center justify-between">
        Quản lý danh mục
        <Link
          to={path.categoryNew}
          className="no-underline text-green-500 text-lg font-medium border-[1px] border-solid border-[green] p-3 rounded cursor-pointer"
        >
          Thêm mới
        </Link>
      </div>

      <Table columns={columns} dataSource={originData} />
    </div>
  );
};

export default TableProduct;
