import React, { useEffect, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import DataTable from "src/components/Table";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import path from "src/constants/path";
import { Pagination, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { deleteUser, getUsers } from "src/store/user/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
interface DataType {
  key: number;
  id?: string;
  fullName: string;
  phoneNumber: string;
  password?: string;
  email: string;
  gender: string;
  address: string;
  imageUrl?: string;
  level?: number;
  levelString?: string;
}
const UserTable = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const pageSize = 10; // Số phần tử trên mỗi trang

  useEffect(() => {
    dispatch(getUsers({ pageNumber: currentPage }));
  }, [currentPage]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };

  const columns = [
    // { field: "id", headerName: "ID", width: 70 },
    { field: "stt", headerName: "STT", width: 70 },
    { field: "fullName", headerName: "Tài khoản", width: 200 },
    { field: "role", headerName: "Vai trò", width: 110 },
    { field: "gender", headerName: "Giới tính", width: 100 },
    { field: "phoneNumber", headerName: "Số điện thoại", width: 150 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "action",
      headerName: "Tùy chọn",
      width: 130,
      sortable: false,
      renderCell: (params: any) => {
        const { row } = params;

        const handleDelete = async () => {
          console.log(row.id);
          const res = await dispatch(deleteUser(row.id));
          console.log(res);
          unwrapResult(res);
          const d = res?.payload.data;
          if (d?.code !== 200) return toast.error(d?.message);
          await toast.success("Xóa người dùng thành công ");
          dispatch(getUsers({ pageNumber: currentPage }));
        };

        return (
          <Space>
            <Link to={`/user/detail/${row.id}`}>
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
            <Tooltip title="Thay đổi trạng thái" className="">
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

  const originData = [];
  for (let i = 0; i < user?.data?.data.length; i++) {
    originData.push({
      // key: user?.data?.data[i].id,
      id: user?.data?.data[i].id,
      stt: user?.data?.data[i].id,
      address: user?.data?.data[i].address,
      role: user?.data?.data[i].level === 5 ? "ADMIN" : "USER",
      email: user?.data?.data[i].email,
      fullName: user?.data?.data[i].fullName || "",
      gender: user?.data?.data[i].gender === 1 ? "Nam" : "Nữ",
      phoneNumber: user?.data?.data[i].phoneNumber,
    });
  }

  return (
    <div className="mx-6">
      <div className="w-full text-[24px] text-gray-500 mb-[10px] flex items-center justify-between">
        Quản lý người dùng
        <Link
          to={path.usersNew}
          className="no-underline text-green-500 text-lg font-medium border-[1px] border-solid border-[green] p-3 rounded cursor-pointer"
        >
          Thêm mới
        </Link>
      </div>
      <DataTable
        rows={originData}
        columns={columns}
        // totalPages={totalPages}
        totalItems={user?.data?.totalElements}
        handleOnChange={handlePageChange}
        current={currentPage + 1}
        pageSize={pageSize}
      />
    </div>
  );
};

export default UserTable;

