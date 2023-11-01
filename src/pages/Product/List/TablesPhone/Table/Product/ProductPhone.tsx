import { Link } from "react-router-dom";
import path from "src/constants/path";
import {
  formatCurrency,
  formatNumberToSocialStyle,
  generateNameId,
} from "src/utils/utils";
import { SmartPhone } from "../..";
import { Rate } from "antd";

interface Props {
  product: SmartPhone;
}

export default function ProductPhone({ product }: Props) {
  return (
    <Link
      to={`${path.smartPhone}${generateNameId({
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
          <div className="min-h-[2rem] text-xs line-clamp-2">
            {product.name}
          </div>
          <div className="mt-3 flex items-center">
            <div className="max-w-[50%] truncate text-gray-500 line-through">
              <span className="text-xs">₫</span>
              <span className="text-sm">
                {formatCurrency(product.lstProductTypeAndPrice.price)}
              </span>
            </div>
            <div className="ml-1 truncate text-orange">
              <span className="text-xs">₫</span>
              <span className="text-sm">
                {formatCurrency(product.lstProductTypeAndPrice.salePrice)}
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-end">
            <Rate allowHalf defaultValue={product.star} />;
            <div className="ml-2 text-sm">
              <span>{formatNumberToSocialStyle(product.totalReview)}</span>
              <span className="ml-1">Review</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
