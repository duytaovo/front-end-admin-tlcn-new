import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import FilterPhuKien from "./FilterPhuKien";
import ListPhuKien from "./ListPhuKien";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { getBrands } from "src/store/brand/brandSlice";
import { getCharacters } from "src/store/characteristic/characteristicSlice";
import { getSort } from "src/store/product/filterSlice";
import { Link, useLocation } from "react-router-dom";
import {
  getProductByProductSlug,
  getProductsFilterAccess,
} from "src/store/product/laptopSlice ";
import { handleFilterStore } from "src/store/product/smartPhoneSlice";
import { Button, Pagination } from "antd";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { DownloadOutlined } from "@ant-design/icons";
import "jspdf-autotable";
import jspdf from "jspdf";
const PhuKien = () => {
  const [choose, setChoose] = useState<any>();
  const location = useLocation();
  const [chooseBox, setChooseBox] = useState<any>();
  const [isOpen, setisOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const filter = useAppSelector((state) => state.smartPhone.filter.data); // Lấy tất cả
  const { brand } = useAppSelector((state) => state.brand);
  const { character } = useAppSelector((state) => state.character);
  const [dataFilterLocal, setDataFilterLocal] = useState<any>();
  const { smartPhone } = useAppSelector((state) => state.smartPhone);

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
      slug: location.pathname.substring(1),
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
    dispatch(
      getProductsFilterAccess({
        body: body,
        params: { pageNumber: currentPage, pageSize: 10, sort: chooseBox },
      }),
    );
  }, [
    Hãng,
    currentPage,
    NhuCau,
    minMaxPrices?.maxPrice,
    minMaxPrices?.minPrice,
    TinhNangDacBiet,
    chooseBox,
  ]);

  useEffect(() => {
    dispatch(getSort(""));
    dispatch(getBrands({ slug: location.pathname.substring(1) }));
    dispatch(
      getCharacters({
        categorySlug: location.pathname.substring(1),
      }),
    );
    dispatch(
      getProductByProductSlug({
        slug: location.pathname.substring(1),
      }),
    );
  }, [location.pathname.substring(1)]);
  const handle = (boolean: boolean) => {
    setisOpen(boolean);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSetChooseBox = (choose: any) => {
    setChooseBox(choose);
  };
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
  return (
    <div className="text-textWhiteMain">
      <Helmet>
        <title>Trang phụ kiện</title>
        <meta name="description" content="Trang điện thoại" />
      </Helmet>
      <div className="w-full text-[24px] text-gray-500 mb-[10px] flex items-center justify-between">
        <div>
          Quản lý sản phẩm
          <div>
            <Button
              onClick={() => exportToExcel(smartPhone?.data?.data)}
              type="primary"
              icon={<DownloadOutlined />}
              size="small"
              className="text-blue-500"
            >
              Xuất file excel
            </Button>
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
          to={`${location.pathname}New`}
          className="no-underline text-green-500 text-lg font-medium border-[1px] border-solid border-[green] p-3 rounded cursor-pointer"
        >
          Thêm mới
        </Link>
      </div>
      <FilterPhuKien handle={handle} brand={brand} characteristic={character} />

      <ListPhuKien
        category={location.pathname.substring(1)}
        handleSetChooseBox={handleSetChooseBox}
        choose={choose}
        setChooseBox={setChooseBox}
        isOpen={isOpen}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
      />
    </div>
  );
};
export default PhuKien;

