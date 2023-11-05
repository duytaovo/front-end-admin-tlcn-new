import { Link, useNavigate } from "react-router-dom";
import {
  formatCurrency,
  formatNumberToSocialStyle,
  generateNameId,
} from "src/utils/utils";
import { Rate } from "antd";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import { useAppDispatch } from "src/hooks/useRedux";
import { getSmartPhones } from "src/store/product/smartPhoneSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { deleteLaptop, getLaptop } from "src/store/product/laptopSlice ";
import { ListSmartPhone } from "src/types/allProductsType.interface";

interface Props {
  product: ListSmartPhone;
}
interface IBody {
  setEnable: React.Dispatch<React.SetStateAction<boolean>>;
}
interface IiOffset {
  w: number;
  h: number;
}

interface Iprops {
  id: string;
  tag: keyof JSX.IntrinsicElements;
  className?: string;
  content: string;
  style?: React.CSSProperties;
}

interface IProps {
  children: ReactNode;
  onClick?: () => void;
}

const OptionWrapper: React.FC<IProps> = ({ children }) => {
  return <div className="flex h-17 items-end py-1">{children}</div>;
};
export default function ProductLaptop({ product }: Props) {
  const iRef = useRef<HTMLTextAreaElement>(null);
  const cRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [iOffset, setIOffset] = useState<IiOffset>({
    w: 100,
    h: 100,
  });
  const dispatch = useAppDispatch();
  const [enable, setEnable] = useState<boolean>(false);
  const hidden = () => setEnable(false);
  useEffect(() => {
    const w = cRef?.current?.offsetWidth || 100;
    const h = cRef?.current?.offsetHeight || 100;
    setIOffset({ w, h });
  }, []);
  const editOptions = [
    {
      id: 1,
      title: "Sửa",
      callback: () => {
        navigate(
          `${"/laptop/detail/update"}/${generateNameId({
            name: product.name,
            id: product.id.toString(),
          })}`
        );

        hidden();
      },
      variant: "outlined",
    },
    {
      id: 3,
      title: "Xóa",
      callback: () => {
        const handleDelete = async () => {
          const res = await dispatch(deleteLaptop(product.id.toString()));
          unwrapResult(res);
          const d = res?.payload;
          if (d?.code !== 200) return toast.error(d?.message);
          await toast.success("Xóa sản phẩm thành công ");
          await dispatch(getLaptop(""));
        };
        handleDelete();
        hidden();
      },
      variant: "contained",
    },
  ];
  const handleMouseEnter = () => {
    setEnable(true);
  };

  const handleMouseLeave = () => {
    setEnable(false);
  };
  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link
        to={`${"/laptop/detail"}/${generateNameId({
          name: product.name,
          id: product.id.toString(),
        })}`}
      >
        <div className="overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.04rem] hover:shadow-md">
          <div className="relative w-full pt-[100%]">
            <img
              src={product.lstImageUrl[0]}
              alt={product.name}
              className="absolute top-0 left-0 h-full w-full bg-white object-cover"
            />
          </div>
          <div className="overflow-hidden p-2">
            <div className="min-h-[2rem] text-lg line-clamp-2">
              {product.name}
            </div>
            <div className="mt-3 flex items-center">
              <div className="max-w-[50%] truncate text-gray-500 line-through">
                <span className="text-xs">₫</span>
                <span className="text-sm">
                  {formatCurrency(product.lstProductTypeAndPrice[0].price)}
                </span>
              </div>
              <div className="ml-1 truncate text-orange">
                <span className="text-lg">₫</span>
                <span className="text-xl">
                  {formatCurrency(product.lstProductTypeAndPrice[0].salePrice)}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-start">
              <Rate
                allowHalf
                defaultValue={product.star}
                style={{
                  fontSize: "15px",
                }}
              />

              <div className="ml-2 text-sm">
                <span>{formatNumberToSocialStyle(product.totalReview)}</span>
                <span className="ml-1">Review</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      {enable ? (
        <OptionWrapper>
          {editOptions.map((option, index) => {
            const body: IBody = {
              setEnable,
            };

            return (
              <Button
                sx={{ marginLeft: "4px" }}
                variant={
                  option?.variant != "outlined" &&
                  option?.variant != "contained"
                    ? "outlined"
                    : option?.variant
                }
                key={index}
                onClick={() => option?.callback()}
              >
                {option?.title}
              </Button>
            );
          })}
        </OptionWrapper>
      ) : null}
    </div>
  );
}
