import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { SelectChangeEvent } from "@mui/material/Select";
import path from "src/constants/path";
import React, { useEffect, useState } from "react";
import { Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getLaptop } from "src/store/product/laptopSlice ";
import ProductLaptop from "./Table/Product/ProductLaptop";

export type SmartPhone = {
  id: number;
  name: string;
  lstImageUrl: string[];
  lstProductTypeAndPrice: {
    typeId: number;
    ram: string;
    storageCapacity: string;
    color: string;
    price: number;
    salePrice: number;
  }[];
  star: number;
  totalReview: number;
};

const TableLaptop: React.FC = () => {
  const dispatch = useAppDispatch();
  const { laptop } = useAppSelector((state) => state.laptop);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getLaptop(""));
  }, []);
  const [status, setStatus] = React.useState<string>("");

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };
  console.log(laptop);
  laptop;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  const [product, setProduct] = React.useState("");

  const handleChangeProduct = (event: SelectChangeEvent) => {
    setProduct(event.target.value as string);
  };

  const onClick = (value: string) => {
    navigate(value);
  };
  const originData: any[] = [];
  for (let i = 0; i < laptop?.length; i++) {
    originData.push({
      id: laptop[i].id,
      name: laptop[i].name,
      lstImageUrl: laptop[i].lstImageUrl,
      ram: laptop[i].lstProductTypeAndPrice.ram,
      storageCapacity: laptop[i].lstProductTypeAndPrice.storageCapacity,
      color: laptop[i].lstProductTypeAndPrice.color,
      price: laptop[i].lstProductTypeAndPrice.price,
      salePrice: laptop[i].lstProductTypeAndPrice.salePrice,
      star: laptop[i].star,
      totalReview: laptop[i].totalReview,
    });
  }
  const columns: ColumnsType<any> = [
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Giá sản phẩm", dataIndex: "price", key: "price" },
    { title: "Khuyến mãi", dataIndex: "salePrice", key: "salePrice" },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   render: () => {
    //     // const handleChangeStatus = (e: any) => {};
    //     return (
    //       <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
    //         <InputLabel id="demo-select-small-label">Trạng thái</InputLabel>
    //         <Select
    //           labelId="demo-select-small-label"
    //           id="demo-select-small"
    //           value={status}
    //           label="Status"
    //           // onChange={handleChange}
    //         >
    //           <MenuItem value={0}>Not verify</MenuItem>
    //           <MenuItem value={1}>Verify</MenuItem>
    //           <MenuItem value={2}>Disable</MenuItem>
    //           <MenuItem value={3}>Enable</MenuItem>
    //         </Select>
    //       </FormControl>
    //     );
    //   },
    // },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: () => (
        <Space>
          <Link to={path.laptopDetail}>
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
          <Link to={path.users}>
            <Tooltip title="Thay đổi trạng thái " className="disabled:bg-white">
              <IconButton>
                <DeleteIcon className="text-red-700" />
              </IconButton>
            </Tooltip>
          </Link>
        </Space>
      ),
    },
  ];
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
                  onClick={() => onClick("/phone")}
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
                {/* <MenuItem value={30}></MenuItem> */}
              </Select>
            </FormControl>
            <span style={{ marginLeft: 8 }}>
              {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
            </span>
          </div>
        </div>
        <Link
          to={path.laptopNew}
          className="no-underline text-green-500 text-lg font-medium border-[1px] border-solid border-[green] p-3 rounded cursor-pointer"
        >
          Thêm mới
        </Link>
      </div>
      {/* <Table
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>{record?.description}</p>
          ),
          rowExpandable: (record) => record?.name !== "Not Expandable",
        }}
        dataSource={originData}
      /> */}
      <div className="mt-6 grid grid-cols-6 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {laptop?.map((_laptop: any) => (
          <div className="col-span-1" key={_laptop.id}>
            <ProductLaptop product={_laptop} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableLaptop;
