import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import React, { useEffect, useState } from "react";
import ProductPhone from "./Table/Product/ProductAdapter";
import path from "src/constants/path";
import { Pagination } from "antd";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import { getAdapter } from "src/store/accessory/adapter";
import { handleFilterStore } from "src/store/product/smartPhoneSlice";
import { getSort } from "src/store/product/filterSlice";
import { getBrands } from "src/store/brand/brandSlice";
import { getCharacters } from "src/store/characteristic/characteristicSlice";

const TableAdapter: React.FC = () => {
  const { adapter } = useAppSelector((state) => state.adapter);
  const navigate = useNavigate();
  const pageSize = 10; // Số phần tử trên mỗi trang
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const filter = useAppSelector((state) => state.smartPhone.filter.data); // Lấy tất cả
  const { brand } = useAppSelector<any>((state) => state.brand);
  const { character } = useAppSelector<any>((state) => state.character);
  const [dataFilterLocal, setDataFilterLocal] = useState<any>();
  const [chooseBox, setChooseBox] = useState<any>();
  useEffect(() => {
    dispatch(getSort(""));
    dispatch(getBrands({ pageSize: 100 }));
    dispatch(getCharacters(""));
  }, []);
  const exportToExcel = async (products: any) => {
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

  // Gọi hàm tách mảng

  useEffect(() => {
    dispatch(getAdapter({ pageNumber: currentPage }));
  }, [currentPage]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };

  useEffect(() => {
    dispatch(handleFilterStore([]));
  }, []);
  // Hàm tách mảng
  useEffect(() => {
    const separateArrays = (data: any) => {
      const result: any = {};

      data.forEach((item: any) => {
        const key = Object.keys(item)[0]; // Lấy tên thuộc tính (ví dụ: 'Hãng', 'Giá', ...)

        if (!result[key]) {
          result[key] = [];
        }

        result[key].push(item[key]);
      });

      return result;
    };
    // Gọi hàm tách mảng
    const separatedArrays = separateArrays(filter);
    setDataFilterLocal(separatedArrays);
  }, [filter]);

  // Kết quả
  if (dataFilterLocal) {
    var {
      Hãng,
      "Nhu cầu": NhuCau,
      "Tính năng đặc biệt": TinhNangDacBiet,
      Giá: Gia,
    } = dataFilterLocal;
  }

  const getMinMaxPrices = () => {
    if (Gia === undefined || Gia.length === 0) {
      return null;
    }
    const numericRanges = Gia.map((priceString: any) => {
      const matches = priceString.match(/(\d+) - (\d+)/);
      let startPrice;
      let endPrice;
      if (
        priceString.search("Dưới") != -1 &&
        priceString.search("Trên") != -1
      ) {
        startPrice = 0;
        endPrice = 100;

        if (!isNaN(startPrice) && !isNaN(endPrice)) {
          return { startPrice, endPrice };
        }
      } else if (priceString.search("Dưới") != -1) {
        startPrice = 0;
        endPrice = 2;

        if (matches && matches.length === 3) {
          // startPrice = parseInt(matches[1], 10);
          endPrice = parseInt(matches[2], 10);
        }

        if (!isNaN(startPrice) && !isNaN(endPrice)) {
          return { startPrice, endPrice };
        }
      } else if (priceString.search("Trên") != -1) {
        startPrice = 20;
        endPrice = 100;
        if (matches && matches.length === 3) {
          startPrice = parseInt(matches[1], 10);
        }
        if (priceString.search("Dưới") != -1) {
          startPrice = 0;
        }
        if (!isNaN(startPrice) && !isNaN(endPrice)) {
          return { startPrice, endPrice };
        }
      } else if (matches && matches.length === 3) {
        startPrice = parseInt(matches[1], 10);
        endPrice = parseInt(matches[2], 10);

        if (!isNaN(startPrice) && !isNaN(endPrice)) {
          return { startPrice, endPrice };
        }
      }

      return null;
    });

    const validRanges = numericRanges.filter(
      (range: any) => range !== null,
    ) as {
      startPrice: number;
      endPrice: number;
    }[];

    if (validRanges.length === 0) {
      return null;
    }

    const minPrice = Math.min(...validRanges.map((range) => range.startPrice));
    const maxPrice = Math.max(...validRanges.map((range) => range.endPrice));

    return { minPrice: minPrice * 1000000, maxPrice: maxPrice * 1000000 };
  };

  const minMaxPrices = getMinMaxPrices();

  useEffect(() => {
    const body = {
      slug: "adapter",
      brandId: Hãng ? Hãng : [],
      characteristicId: NhuCau ? NhuCau : [],
      priceFrom: minMaxPrices?.minPrice
        ? minMaxPrices?.minPrice
        : minMaxPrices?.minPrice == 0
        ? 0
        : null,
      priceTo: minMaxPrices?.maxPrice ? minMaxPrices?.maxPrice : null,
      specialFeatures: TinhNangDacBiet ? TinhNangDacBiet : [],
      name: null,
    };
    // dispatch(
    //   getProductsFilterAccess({
    //     body: body,
    //     params: { pageNumber: currentPage, pageSize: 10, sort: chooseBox },
    //   }),
    // );
  }, [
    Hãng,
    currentPage,
    NhuCau,
    minMaxPrices?.maxPrice,
    minMaxPrices?.minPrice,
    TinhNangDacBiet,
    chooseBox,
  ]);
  const [isOpen, setisOpen] = useState<boolean>(false);
  const handle = (boolean: boolean) => {
    setisOpen(boolean);
  };

  return (
    <div className="mx-6">
      <div className="w-full text-[24px] text-gray-500 mb-[10px] flex items-center justify-between">
        <div>
          Quản lý sản phẩm
          <div></div>
          <div>
            {/* <Button
              onClick={() => exportToExcel(adapter?.data?.data)}
              type="primary"
              icon={<DownloadOutlined />}
              size="small"
              className="text-blue-500"
            >
              Xuất file excel
            </Button> */}
            {/* <Button
              onClick={() => exportToPDF(smartPhone?.data?.data)}
              type="link"
              icon={<DownloadOutlined />}
              size="small"
            >
              Xuất file PDF
            </Button> */}
          </div>
        </div>
        <Link
          to={path.adapterNew}
          className="no-underline text-green-500 text-lg font-medium border-[1px] border-solid border-[green] p-3 rounded cursor-pointer"
        >
          Thêm mới
        </Link>
      </div>
      {/* <FilterPhuKien handle={handle} brand={brand} characteristic={character} /> */}
      <div className="mt-6 grid grid-cols-5 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 h-[80%] mb-10">
        {adapter?.data?.data?.map((_smartPhone: any) => (
          <div className="col-span-1" key={_smartPhone.id}>
            <ProductPhone product={_smartPhone} />
          </div>
        ))}
      </div>
      <div className="fixed bottom-12 mt-12 ">
        <Pagination
          current={currentPage + 1}
          pageSize={pageSize}
          total={adapter?.data?.totalElements}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TableAdapter;

