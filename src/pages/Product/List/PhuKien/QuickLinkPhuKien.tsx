import QuickLink from "src/components/QuickLink/ButtonQuickLink";
import "./quicklinkphone-module.scss";
import { Link } from "react-router-dom";
import clsx from "clsx";

interface Data {
  id: number;
  type: string;
  link: string;
  demand?: string;
}
interface Data2 {
  demand?: string;
  id: number;
}
const data: Data[] = [
  {
    id: 1,
    type: "Apple",
    link: "//cdn.tgdd.vn/Brand/1/logo-iphone-220x48.png",
  },
  {
    id: 9,
    type: "Samsung",
    link: "//cdn.tgdd.vn/Brand/1/samsungnew-220x48-1.png",
  },
  {
    id: 10,
    type: "Oppo",
    link: "//cdn.tgdd.vn/Brand/1/OPPO42-b_5.jpg",
  },
  {
    id: 11,
    type: "Xiaomi",
    link: "//cdn.tgdd.vn/Brand/1/logo-xiaomi-220x48-5.png",
  },
  {
    id: 12,
    type: "Vivo",
    link: "//cdn.tgdd.vn/Brand/1/vivo-logo-220-220x48-3.png",
  },
  {
    id: 13,
    type: "Realme",
    link: "//cdn.tgdd.vn/Brand/1/Realme42-b_37.png",
  },
  {
    id: 14,
    type: "Nokia",
    link: "//cdn.tgdd.vn/Brand/1/Nokia42-b_21.jpg",
  },
  {
    id: 15,
    type: "Mobell",
    link: "//cdn.tgdd.vn/Brand/1/Mobell42-b_19.jpg",
  },
  {
    id: 16,
    type: "itel",
    link: "//cdn.tgdd.vn/Brand/1/Itel42-b_54.jpg",
  },
  {
    id: 17,
    type: "Masstel",
    link: "//cdn.tgdd.vn/Brand/1/Masstel42-b_0.png",
  },
];

const data2: Data2[] = [
  {
    id: 1,
    demand: "Chơi game/Cấu hình cao",
  },
  {
    id: 2,
    demand: "Chụp ảnh, quay phim",
  },
  {
    id: 6,
    demand: "Mỏng nhẹ",
  },
  {
    id: 7,
    demand: "Cao cấp, sang trọng",
  },
  {
    id: 8,
    demand: "Nhỏ gọn dễ cầm",
  },
];

interface Props {
  handleSetChoose: (text: any) => void;
  handleSetChooseCharac: (text: any) => void;
  choose: any;
  chooseCharac: any;
  brand: any;
  characteristic: any;
}
const QuickLinkPhuKien = ({
  handleSetChooseCharac,
  handleSetChoose,
  chooseCharac,
  choose,
  brand,
  characteristic,
}: Props) => {
  return (
    <>
      <div className="container__phone space-y-4 mt-4">
        <div className="">
          <div className="flex justify-between flex-wrap gap-3">
            {brand?.data?.data?.map((item: any, index: number) => {
              const active = item?.id === choose?.id;

              return (
                <div key={index}>
                  <QuickLink
                    active={active}
                    type={item.name}
                    id={item.id}
                    link={item.imageUrl.substring("https:".length)}
                    handleSetChoose={handleSetChoose}
                    isImg={true}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="container__quicklink-demand">
          <div className="">
            <div className=" space-y-4">
              <h4 className="text-[14px] ">Chọn điện thoại theo nhu cầu:</h4>
              <div className="flex justify-between items-center flex-wrap gap-3">
                {characteristic?.data?.map((item: any, index: number) => {
                  const active = item?.id === chooseCharac;
                  const className = clsx(
                    active && "border-[1px] rounded-xl border-blue-700  ",
                  );
                  return (
                    <div key={index}>
                      <Link
                        to={""}
                        onClick={() => handleSetChooseCharac(item.id)}
                        className={`rounded-xl border-solid border-[1px] m-[0px_8px_10px_0px] p-[6px_13px] ${className}`}
                      >
                        {item.name}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickLinkPhuKien;

