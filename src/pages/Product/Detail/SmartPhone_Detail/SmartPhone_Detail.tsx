import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

import {
  formatCurrency,
  formatNumberToSocialStyle,
  getIdFromNameId,
  rateSale,
} from "src/utils/utils";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { convert } from "html-to-text";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import {
  getDetailPhone,
  getSmartPhones,
} from "src/store/product/smartPhoneSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Rate } from "antd";
import DOMPurify from "dompurify";

export default function SmartPhoneDetail() {
  // const { t } = useTranslation(["product"]);
  const [buyCount, setBuyCount] = useState(1);
  const { nameId } = useParams();
  const dispatch = useAppDispatch();
  const { smartPhoneDetail } = useAppSelector((state) => state.smartPhone);

  const id = getIdFromNameId(nameId as string);
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5]);
  const [activeImage, setActiveImage] = useState("");
  const imageRef = useRef<HTMLImageElement>(null);
  const currentImages = useMemo(
    () =>
      smartPhoneDetail?.productInfo?.lstProductImageUrl
        ? smartPhoneDetail?.productInfo?.lstProductImageUrl.slice(
            ...currentIndexImages
          )
        : [],
    [smartPhoneDetail, currentIndexImages]
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (
      smartPhoneDetail &&
      smartPhoneDetail?.productInfo?.lstProductImageUrl?.length > 0
    ) {
      setActiveImage(smartPhoneDetail?.productInfo?.lstProductImageUrl[0]);
    }
  }, [smartPhoneDetail]);

  useEffect(() => {
    dispatch(getDetailPhone(id));
  }, [id, dispatch]);
  const next = () => {
    if (
      currentIndexImages[1] <
      smartPhoneDetail?.productInfo.lstProductImageUrl.length
    ) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1]);
    }
  };

  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1]);
    }
  };

  const chooseActive = (img: string) => {
    setActiveImage(img);
  };

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const image = imageRef.current as HTMLImageElement;
    const { naturalHeight, naturalWidth } = image;

    const offsetX = event.pageX - (rect.x + window.scrollX);
    const offsetY = event.pageY - (rect.y + window.scrollY);

    const top = offsetY * (1 - naturalHeight / rect.height);
    const left = offsetX * (1 - naturalWidth / rect.width);
    image.style.width = naturalWidth + "px";
    image.style.height = naturalHeight + "px";
    image.style.maxWidth = "unset";
    image.style.top = top + "px";
    image.style.left = left + "px";
  };

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute("style");
  };

  if (!smartPhoneDetail) return null;
  return (
    <div className="bg-gray-200 py-6">
      <Helmet>
        <title>{smartPhoneDetail?.productInfo?.name}</title>
        <meta
          name="description"
          content={convert(smartPhoneDetail?.productInfo?.description, {
            limits: {
              maxInputLength: 1500,
            },
          })}
        />
      </Helmet>
      <div className="container">
        <div className="bg-white p-4 shadow">
          <div className="grid grid-cols-12 gap-9">
            <div className="col-span-5">
              <div
                className="relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow"
                onMouseMove={handleZoom}
                onMouseLeave={handleRemoveZoom}
              >
                <img
                  src={activeImage}
                  alt={smartPhoneDetail?.productInfo?.name}
                  className="absolute left-0 top-0 h-full w-full bg-white object-cover"
                  ref={imageRef}
                />
              </div>
              <div className="relative mt-4 grid grid-cols-5 gap-1">
                <button
                  className="absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white"
                  onClick={prev}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                {currentImages?.map((img: any) => {
                  const isActive = img === activeImage;
                  return (
                    <div
                      className="relative w-full pt-[100%]"
                      key={img}
                      onMouseEnter={() => chooseActive(img)}
                    >
                      <img
                        src={img}
                        alt={smartPhoneDetail?.productInfo?.name}
                        className="absolute left-0 top-0 h-full w-full cursor-pointer bg-white object-cover"
                      />
                      {isActive && (
                        <div className="absolute inset-0 border-2 border-orange" />
                      )}
                    </div>
                  );
                })}
                <button
                  className="absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white"
                  onClick={next}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="col-span-7">
              <h1 className="text-xl font-medium uppercase">
                {smartPhoneDetail?.productInfo?.name}
              </h1>
              <div className="mt-8 flex items-center">
                <div className="flex items-center">
                  <span className="mr-1 border-b border-b-orange text-orange">
                    {smartPhoneDetail?.productInfo?.star}
                  </span>
                  <Rate
                    allowHalf
                    defaultValue={smartPhoneDetail?.productInfo?.star || 4.5}
                    disabled
                  />
                  ;
                </div>
                <div className="mx-4 h-4 w-[1px] bg-gray-300"></div>
                <div>
                  <span>
                    {formatNumberToSocialStyle(
                      smartPhoneDetail?.productInfo?.totalReview || 1520
                    )}
                  </span>
                  <span className="ml-1 text-gray-500">Đã xem</span>
                </div>
              </div>
              <div className="mt-8 flex items-center bg-gray-50 px-5 py-4">
                <div className="text-gray-500 line-through">
                  ₫
                  {formatCurrency(
                    smartPhoneDetail?.productInfo?.lstProductTypeAndPrice[0]
                      .salePrice
                  )}
                </div>
                <div className="ml-3 text-3xl font-medium text-orange">
                  ₫
                  {formatCurrency(
                    smartPhoneDetail?.productInfo?.lstProductTypeAndPrice[0]
                      .price
                  )}
                </div>
                <div className="ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white">
                  {rateSale(
                    smartPhoneDetail?.productInfo?.star,
                    smartPhoneDetail?.productInfo?.lstProductTypeAndPrice?.price
                  )}{" "}
                  giảm
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="container">
          <div className=" bg-white p-4 shadow">
            <div className="rounded bg-gray-50 p-4 text-lg capitalize text-slate-700">
              Mô tả sản phẩm
            </div>
            <div className="mx-4 mb-4 mt-12 text-sm leading-loose">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    smartPhoneDetail?.productInfo?.description
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* <div className="mt-8">
        <div className="container">
          <div className="uppercase text-gray-400">CÓ THỂ BẠN CŨNG THÍCH</div>
          {productsData && (
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {productsData.data.data.products.map((product) => (
                <div className="col-span-1" key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
}
