import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { SelectChangeEvent } from "@mui/material/Select";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import { getSmartPhones } from "src/store/product/smartPhoneSlice";
import ProductPhone from "../List/SmartPhone/TablesPhone/Table/Product";
import { Button, Pagination } from "antd";
import { Helmet } from "react-helmet-async";
import { DownloadOutlined } from "@ant-design/icons";
import * as jsPDF from "jspdf";
import "jspdf-autotable";

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
      brandId: null,
      characteristicId: null,
      priceFrom: null,
      priceTo: null,
      specialFeatures: [],
      smartphoneType: [],
      ram: [],
      storageCapacity: [],
      charging: [],
      screen: [],
    };
    dispatch(
      getSmartPhones({
        body: body,
        params: { pageNumber: currentPage, pageSize: 10 },
      }),
    );
  }, [currentPage]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };
  const exportToExcel = async (products: any) => {
    console.log(products);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Products");

    // Add header row
    worksheet.addRow([
      "ID",
      "Name",
      "Ram",
      "Rom",
      "Color",
      "Quantity",
      "Price",
      "SalePrice",
      "Images",
    ]);

    // // Add data rows
    // products.forEach((product: any) => {
    //   worksheet.addRow([
    //     product.id,
    //     product.name,
    //     product.lstProductTypeAndPrice[0].ram,
    //     product.lstProductTypeAndPrice[0].storageCapacity,
    //     product.lstProductTypeAndPrice[0].color,
    //     product.lstProductTypeAndPrice[0].quantity,
    //     product.lstProductTypeAndPrice[0].price,
    //     product.lstProductTypeAndPrice[0].salePrice,
    //   ]);
    // });

    products.forEach((product: any) => {
      product.lstProductTypeAndPrice.forEach((typeAndPrice: any) => {
        worksheet.addRow([
          product.id,
          product.name,
          typeAndPrice.ram,
          typeAndPrice.storageCapacity,
          typeAndPrice.color,
          typeAndPrice.quantity,
          typeAndPrice.price,
          typeAndPrice.salePrice,
          // Combine image URLs into a single string separated by commas
          product.lstImageUrl.join(","),
        ]);
      });
    });
    // Create a blob from the Excel workbook
    const blob = await workbook.xlsx.writeBuffer();

    // Save the blob as a file using file-saver
    saveAs(
      new Blob([blob], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "products.xlsx",
    );
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
              <InputLabel
                id="demo-simple-select-label"
                className="text-mainColor"
                sx={{
                  color: "green",
                }}
              >
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
          <Button
            onClick={() => exportToExcel(smartPhone?.data?.data)}
            type="primary"
            icon={<DownloadOutlined />}
            size="small"
            className="text-blue-500"
          >
            Xuất file excel
          </Button>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-5 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-12 h-[80%]">
        {smartPhone?.data?.data?.map((_smartPhone: any) => (
          <div className="col-span-1" key={_smartPhone.id}>
            <ProductPhone product={_smartPhone} />
          </div>
        ))}
      </div>
      <div className="fixed bottom-12 mt-12 right-4">
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

