import { IconButton, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import path from "src/constants/path";
import React, { useEffect, useState } from "react";
import { Pagination, Space } from "antd";
import { deleteBrand, getBrands } from "src/store/brand/brandSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import DataTable from "src/components/Table";

interface DataType {
  key: React.Key;
  name: string;
  action?: any;
  address: string;
  category?: string;
}

const TableBrand: React.FC = () => {
  const dispatch = useAppDispatch();
  const { brand } = useAppSelector((state) => state.brand);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const pageSize = 10; // Số phần tử trên mỗi trang

  const columns = [
    // { field: "id", headerName: "ID", width: 70 },
    { field: "stt", headerName: "STT", width: 70 },
    { field: "name", headerName: "Tên thương hiệu", width: 200 },
    { field: "address", headerName: "Địa chỉ", width: 110 },
    {
      field: "action",
      headerName: "Tùy chọn",
      width: 130,
      sortable: false,
      renderCell: (params: any) => {
        const { row } = params;

        const handleDelete = async () => {
          const res = await dispatch(deleteBrand(row.id));
          unwrapResult(res);
          const d = res?.payload;
          if (d?.status !== 200) return toast.error(d?.message);
          await toast.success("Xóa nhãn hiệu thành công ");
          await dispatch(getBrands(""));
        };

        return (
          <Space>
            <Link to={`${path.brandDetail}/${row.id}`}>
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
    dispatch(getBrands({ pageNumber: currentPage }));
  }, [currentPage]);
  const originData = [];

  for (let i = 0; i < brand?.data?.data?.length; i++) {
    originData.push({
      stt: brand?.data?.data[i].id,
      name: brand?.data?.data[i]?.name,
      address: brand?.data?.data[i]?.address,
    });
  }
  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };
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
      <DataTable
        rows={originData}
        columns={columns}
        // totalPages={totalPages}
        totalItems={brand?.data?.totalElements}
        handleOnChange={handlePageChange}
        current={currentPage + 1}
        pageSize={pageSize}
      />

      {/* <div className="fixed bottom-12 mt-12 ">
        <Pagination
          current={currentPage + 1}
          pageSize={pageSize}
          total={brand?.data?.totalElements}
          onChange={handlePageChange}
        />
      </div> */}
    </div>
  );
};

export default TableBrand;

