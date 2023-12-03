import { useEffect, useState } from "react";
import clsx from "clsx";
import { formatCurrency, rateSale } from "src/utils/utils";
import { Button } from "antd";

const Tag = ({ productData, onClick }: any) => {
  const [price, setPrice] = useState(
    productData?.productInfo?.lstProductTypeAndPrice[0].price,
  );

  const [salePrice, setSalePrice] = useState(
    productData?.productInfo?.lstProductTypeAndPrice[0].salePrice,
  );

  const [selectedRam, setSelectedRam] = useState<string | null>(null);
  const [selectedRom, setSelectedRom] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    if (selectedRam !== null) {
      // Lấy danh sách màu sắc tương ứng với loại RAM đã chọn
      const colorsForSelectedRam =
        productData?.productInfo?.lstProductTypeAndPrice
          .filter((item: any) => item.ram === selectedRam)
          .map((item: any) => item.color);

      // Nếu danh sách không rỗng, chọn màu đầu tiên làm màu mặc định
      if (colorsForSelectedRam && colorsForSelectedRam.length > 0) {
        setSelectedColor(colorsForSelectedRam[0]);
      }
    }
  }, [selectedRam, productData]);

  useEffect(() => {
    if (selectedRom !== null) {
      // Lấy danh sách màu sắc tương ứng với loại RAM đã chọn
      const colorsForSelectedRom =
        productData?.productInfo?.lstProductTypeAndPrice
          .filter((item: any) => item.storageCapacity === selectedRom)
          .map((item: any) => item.color);

      // Nếu danh sách không rỗng, chọn màu đầu tiên làm màu mặc định
      if (colorsForSelectedRom && colorsForSelectedRom.length > 0) {
        setSelectedColor(colorsForSelectedRom[0]);
      }
    }
  }, [selectedRom, productData]);

  useEffect(() => {
    // Lấy danh sách loại RAM unique từ dữ liệu sản phẩm
    const uniqueRams: any = [
      ...new Set(
        productData?.productInfo?.lstProductTypeAndPrice.map(
          (item: any) => item.ram,
        ),
      ),
    ];

    if (!selectedRam && uniqueRams.length > 0) {
      // Nếu chưa chọn RAM, chọn RAM đầu tiên làm RAM mặc định
      setSelectedRam(uniqueRams[0]);

      // Lấy danh sách màu sắc tương ứng với RAM đầu tiên
      const colorsForDefaultRam =
        productData?.productInfo?.lstProductTypeAndPrice
          .filter((item: any) => item.ram === uniqueRams[0])
          .map((item: any) => item.color);

      if (colorsForDefaultRam && colorsForDefaultRam.length > 0) {
        // Chọn màu sắc đầu tiên làm màu mặc định
        setSelectedColor(colorsForDefaultRam[0]);
      }
    }
  }, [selectedRam, productData]);

  useEffect(() => {
    // Lấy danh sách loại RAM unique từ dữ liệu sản phẩm
    const uniqueRoms: any = [
      ...new Set(
        productData?.productInfo?.lstProductTypeAndPrice.map(
          (item: any) => item.storageCapacity,
        ),
      ),
    ];

    if (!selectedRom && uniqueRoms.length > 0) {
      // Nếu chưa chọn RAM, chọn RAM đầu tiên làm RAM mặc định
      setSelectedRom(uniqueRoms[0]);

      // Lấy danh sách màu sắc tương ứng với RAM đầu tiên
      const colorsForDefaultRom =
        productData?.productInfo?.lstProductTypeAndPrice
          .filter((item: any) => item.storageCapacity === uniqueRoms[0])
          .map((item: any) => item.color);

      if (colorsForDefaultRom && colorsForDefaultRom.length > 0) {
        // Chọn màu sắc đầu tiên làm màu mặc định
        setSelectedColor(colorsForDefaultRom[0]);
      }
    }
  }, [selectedRom, productData]);

  useEffect(() => {
    if (selectedRam !== null && selectedColor !== null) {
      const selectedProduct =
        productData?.productInfo?.lstProductTypeAndPrice.find(
          (item: any) =>
            item.ram === selectedRam && item.color === selectedColor,
        );

      if (selectedProduct) {
        setPrice(selectedProduct.price);
        setSalePrice(selectedProduct.salePrice);
        onClick &&
          onClick({
            price: selectedProduct.price,
            salePrice: selectedProduct.salePrice,
          });
      }
    }
  }, [selectedRam, selectedColor, productData, onClick]);

  useEffect(() => {
    if (selectedRom !== null && selectedColor !== null) {
      const selectedProduct =
        productData?.productInfo?.lstProductTypeAndPrice.find(
          (item: any) =>
            item.storageCapacity === selectedRom &&
            item.color === selectedColor,
        );

      if (selectedProduct) {
        setPrice(selectedProduct.price);
        setSalePrice(selectedProduct.salePrice);
        onClick &&
          onClick({
            price: selectedProduct.price,
            salePrice: selectedProduct.salePrice,
          });
      }
    }
  }, [selectedRom, selectedColor, productData, onClick]);

  return (
    <div className="mb-4">
      <div className="mt-8 flex items-center bg-gray-50 px-5 py-4">
        <div className="text-gray-500 line-through">
          ₫{formatCurrency(price)}
        </div>
        <div className="ml-3 text-4xl font-medium text-mainColor">
          ₫{formatCurrency(salePrice)}
        </div>
        <div className="ml-4 rounded-sm bg-orange-300 px-1 py-[2px] text-lg font-semibold uppercase text-black">
          {rateSale(salePrice, price)} giảm
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        {[
          ...new Set(
            productData?.productInfo?.lstProductTypeAndPrice.map(
              (item: any) => item.ram,
            ),
          ),
        ].map((ram: any, index) => {
          const active = ram === selectedRam;
          const className = clsx(
            "border  px-10 py-4 text-xl rounded",
            active && "text-blue-400 border-blue-400 ",
          );

          return (
            <Button
              className={className}
              // type={active ? "primary" : "default"}
              key={index}
              onClick={() => {
                setSelectedRam(ram);
                setSelectedColor(null); // Đặt màu sắc về null khi chọn loại RAM mới
              }}
            >
              {ram}
            </Button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        {[
          ...new Set(
            productData?.productInfo?.lstProductTypeAndPrice.map(
              (item: any) => item.storageCapacity,
            ),
          ),
        ].map((rom: any, index) => {
          const active = rom === selectedRom;
          const className = clsx(
            "border  px-10 py-4 text-xl rounded",
            active && "text-blue-400 border-blue-400 ",
          );

          return (
            <Button
              className={className}
              // type={active ? "primary" : "default"}
              key={index}
              onClick={() => {
                setSelectedRom(rom);
                setSelectedColor(null); // Đặt màu sắc về null khi chọn loại RoM mới
              }}
            >
              {rom}
            </Button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 ">
        {productData?.productInfo?.lstProductTypeAndPrice
          .filter((item: any) => item.ram === selectedRam)
          .map((product: any, index: number) => {
            const active = product.color === selectedColor;
            const className = clsx(
              "border  px-10 py-4 text-xl rounded",
              active && "text-blue-400 border-blue-400 ",
            );

            return (
              <Button
                className={className}
                // type={active ? "primary" : "default"}
                key={index}
                onClick={() => {
                  setSelectedColor(product.color);
                }}
                disabled={product.quantity === 0} // Ví dụ: Disable nút nếu hết hàng
              >
                {product.color}
              </Button>
            );
          })}
      </div>
    </div>
  );
};

export default Tag;

