import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { SelectChangeEvent } from "@mui/material/Select";

import React, { useEffect, useState } from "react";
import { getSmartPhones } from "src/store/product/smartPhoneSlice";
import ProductPhone from "../List/SmartPhone/TablesPhone/Table/Product";
import { Pagination } from "antd";
import { Helmet } from "react-helmet-async";

const TableProduct: React.FC = () => {
  const navigate = useNavigate();

  const [product, setProduct] = React.useState("");

  const handleChangeProduct = (event: SelectChangeEvent) => {
    setProduct(event.target.value as string);
  };

  const onClick = (value: string) => {
    navigate(value);
  };
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
  const dispatch = useAppDispatch();
  const { smartPhone } = useAppSelector((state) => state.smartPhone);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const pageSize = 10; // Số phần tử trên mỗi trang

  useEffect(() => {
    const body = {
      slug: "smartphone",
      // brandId: [0],
      // characteristicId: [0],
      // priceFrom: 0,
      // priceTo: 0,
      // specialFeatures: [""],
      // smartphoneType: [""],
      // ram: [""],
      // storageCapacity: [""],
      // charging: [""],
      // screen: [""],
    };
    dispatch(
      getSmartPhones({
        body: body,
        params: { pageNumber: currentPage, pageSize: 12 },
      })
    );
  }, [currentPage]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };

  return (
    <div className="mx-6">
      <Helmet>
        <title>{"Trang quản lý sản phẩm"}</title>
        <meta name="description" />
      </Helmet>
      <div className="w-full text-[20px] text-gray-500 mb-[10px] flex items-center justify-between">
        <div>
          Quản lý sản phẩm
          <div>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Chọn sản phẩm
              </InputLabel>
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
                  onClick={() => onClick("/smartPhone")}
                >
                  Điện thoại
                </MenuItem>
                <MenuItem value={"Laptop"} onClick={() => onClick("/laptop")}>
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
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-6 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {smartPhone?.data?.data?.map((_smartPhone: any) => (
          <div className="col-span-1" key={_smartPhone.id}>
            <ProductPhone product={_smartPhone} />
          </div>
        ))}
      </div>
      <div className="fixed bottom-12 left-auto">
        <Pagination
          current={currentPage + 1}
          pageSize={pageSize}
          total={smartPhone?.data?.totalElements}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TableProduct;
