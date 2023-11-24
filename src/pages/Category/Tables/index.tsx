import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import path from "src/constants/path";
import React, { useEffect, useState } from "react";
import { Button, Pagination, Space, Table } from "antd";
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
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const pageSize = 10; // Số phần tử trên mỗi trang
  const columns: ColumnsType<DataType> = [
    { title: "Tên danh mục", dataIndex: "name", key: "name" },
  ];
  const originData: DataType[] = [];
  for (let i = 0; i < category?.data?.length; i++) {
    originData.push({
      key: i.toString(),
      name: category?.data[i].name,
    });
  }

  useEffect(() => {
    dispatch(getCategorys({ pageNumber: currentPage }));
  }, [currentPage]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };
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

      <Table columns={columns} dataSource={originData} pagination={false} />
      <div className="bottom-14 fixed">
        <Pagination
          current={currentPage + 1}
          pageSize={pageSize}
          total={category?.data?.totalElements}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TableProduct;
