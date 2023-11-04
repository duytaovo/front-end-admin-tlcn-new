import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { SelectChangeEvent } from "@mui/material/Select";
import React, { useEffect } from "react";
import { getSmartPhones } from "src/store/product/smartPhoneSlice";
import ProductPhone from "./Table/Product/ProductPhone";
import path from "src/constants/path";

const TablePhone: React.FC = () => {
  const dispatch = useAppDispatch();
  const { smartPhone } = useAppSelector((state) => state.smartPhone);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getSmartPhones(""));
  }, []);

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
                {/* <MenuItem value={30}></MenuItem> */}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-6 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {smartPhone?.map((_smartPhone: any) => (
          <div className="col-span-1" key={_smartPhone.id}>
            <ProductPhone product={_smartPhone} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablePhone;
