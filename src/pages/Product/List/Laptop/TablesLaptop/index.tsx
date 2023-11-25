import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { SelectChangeEvent } from "@mui/material/Select";
import path from "src/constants/path";
import React, { useEffect, useState } from "react";
import { getLaptop } from "src/store/product/laptopSlice ";
import ProductLaptop from "./Table/Product/ProductLaptop";
import { Pagination } from "antd";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 150,
    },
  },
};
const TableLaptop: React.FC = () => {
  const dispatch = useAppDispatch();
  const { laptop } = useAppSelector((state) => state.laptop);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const pageSize = 10; // Số phần tử trên mỗi trang

  useEffect(() => {
    dispatch(getLaptop({ pageNumber: currentPage }));
  }, [currentPage]);
  useEffect(() => {
    dispatch(getLaptop({ pageNumber: currentPage }));
  }, [currentPage]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };
  const [product, setProduct] = React.useState("");

  const handleChangeProduct = (event: SelectChangeEvent) => {
    setProduct(event.target.value as string);
  };

  const onClick = (value: string) => {
    navigate(value);
  };

  return (
    <div className="mx-6">
      <div className="w-full text-[24px] text-gray-500 mb-[10px] flex items-center justify-between">
        <div>
          Quản lý sản phẩm
          <div>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Product</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={product}
                label="Age"
                onChange={handleChangeProduct}
                MenuProps={MenuProps}
              >
                <MenuItem
                  value={"Điện thoại"}
                  onClick={() => onClick(path.smartPhone)}
                >
                  Điện thoại
                </MenuItem>
                <MenuItem value={"Laptop"} onClick={() => onClick(path.laptop)}>
                  Laptop
                </MenuItem>
                <MenuItem value={"Tablet"} onClick={() => onClick("/tablet")}>
                  Tablet
                </MenuItem>
                <MenuItem
                  value={"Phụ kiện"}
                  onClick={() => onClick("/accessory")}
                >
                  Phụ kiện
                </MenuItem>
                <MenuItem
                  value={"Đồng hồ thông minh"}
                  onClick={() => onClick("/smartwatch")}
                >
                  Đồng hồ thông minh
                </MenuItem>
                <MenuItem value={"Ram"} onClick={() => onClick("/ram")}>
                  Ram
                </MenuItem>
                <MenuItem value={"Rom"} onClick={() => onClick("/rom")}>
                  Rom
                </MenuItem>
                <MenuItem
                  value={"processor"}
                  onClick={() => onClick("/processor")}
                >
                  Processor
                </MenuItem>
                <MenuItem
                  value={"cardGraphic"}
                  onClick={() => onClick("/cardGraphic")}
                >
                  Card đồ họa
                </MenuItem>
                <MenuItem value={"mouse"} onClick={() => onClick("/mouse")}>
                  Chuột máy tính
                </MenuItem>
                <MenuItem
                  value={"loudSpeaker"}
                  onClick={() => onClick("/loudSpeaker")}
                >
                  Loa nghe nhạc
                </MenuItem>
                <MenuItem
                  value={"keyboard"}
                  onClick={() => onClick("/keyboard")}
                >
                  Bàn phím
                </MenuItem>
                {/* <MenuItem value={30}></MenuItem> */}
              </Select>
            </FormControl>
          </div>
        </div>
        <Link
          to={path.laptopNew}
          className="no-underline text-green-500 text-lg font-medium border-[1px] border-solid border-[green] p-3 rounded cursor-pointer"
        >
          Thêm mới
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-6 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {laptop?.data?.data?.map((_laptop: any) => (
          <div className="col-span-1" key={_laptop.id}>
            <ProductLaptop product={_laptop} />
          </div>
        ))}
      </div>
      <div className="fixed bottom-12 left-auto">
        <Pagination
          current={currentPage + 1}
          pageSize={pageSize}
          total={laptop?.data?.totalElements}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TableLaptop;
