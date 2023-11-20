import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { formatNumberToSocialStyle, getIdFromNameId } from "src/utils/utils";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { convert } from "html-to-text";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { getDetailPhone } from "src/store/product/smartPhoneSlice";
import { Button, Modal, Rate } from "antd";
import DOMPurify from "dompurify";
import RatingFeedback from "../../../../components/Rating";
import Tag from "../../../../components/Tag/Tag";

export default function SmartPhoneDetail() {
  // const { t } = useTranslation(["product"]);
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
  }, [id]);

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
              maxInputLength: 50000,
            },
          })}
        />
      </Helmet>
      <div className="px-20 py-5 rounded-md">
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
              <h1 className="text-4xl font-medium uppercase">
                {smartPhoneDetail?.productInfo?.name}
              </h1>
              <div className="mt-8 flex items-center">
                <div className="flex items-center">
                  <span className="mr-1 border-b border-b-orange text-orange">
                    {smartPhoneDetail?.productInfo?.star}
                  </span>
                  <Rate
                    allowHalf
                    defaultValue={Number(
                      smartPhoneDetail?.productInfo?.totalReview
                    )}
                    disabled
                  />
                  ;
                </div>
                <div className="mx-4 h-4 w-[1px] bg-gray-300"></div>
                <div>
                  <span>
                    {formatNumberToSocialStyle(
                      Number(smartPhoneDetail?.productInfo?.totalReview)
                    )}
                  </span>
                  <span className="ml-1 text-gray-500">Đã xem</span>
                </div>
              </div>
              <div className="space-x-3 mt-4 flex justify-start align-baseline">
                <Tag productData={smartPhoneDetail} />
              </div>
            </div>
          </div>
        </div>
        <Button type="link" onClick={showModal} className="bg-gray-300 mt-5">
          Xem thông số kỹ thuật
        </Button>
        <Modal
          title="Thông số kỹ thuật"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          centered
        >
          <div className="block space-y-2">
            <div className="flex justify-start align-baseline space-x-4">
              <h4 className="font-bold">Màn hình :</h4>
              <h5>{smartPhoneDetail?.monitor}</h5>
            </div>
            <div className="flex justify-start align-baseline space-x-4">
              <h4 className="font-bold">Hệ điều hành :</h4>
              <h5>{smartPhoneDetail?.operatingSystem}</h5>
            </div>
            <div className="flex justify-start align-baseline space-x-4">
              <h4 className="font-bold">Camera chính :</h4>
              <h5>{smartPhoneDetail?.rearCamera}</h5>
            </div>
            <div className="flex justify-start align-baseline space-x-4">
              <h4 className="font-bold">Camera trước :</h4>
              <h5>{smartPhoneDetail?.frontCamera}</h5>
            </div>
            <div className="flex justify-start align-baseline space-x-4">
              <h4 className="font-bold">Chip :</h4>
              <h5>{smartPhoneDetail?.chip}</h5>
            </div>
            <div className="flex justify-start align-baseline space-x-4">
              <h4 className="font-bold">Sim :</h4>
              <h5>{smartPhoneDetail?.sim}</h5>
            </div>
            <div className="flex justify-start align-baseline space-x-4">
              <h4 className="font-bold">Pin :</h4>
              <h5>{smartPhoneDetail?.monitor}</h5>
            </div>
            <div className="flex justify-start align-baseline space-x-4">
              <h4 className="font-bold">Sạc nhanh:</h4>
              <h5>{smartPhoneDetail?.charging}</h5>
            </div>
            <div className="flex justify-start align-baseline space-x-4">
              <h4 className="font-bold">Hỗ trợ mạng:</h4>
              <h5>{smartPhoneDetail?.networkSupport}</h5>
            </div>
            <div className="flex justify-start align-baseline space-x-4">
              <h4 className="font-bold">Phụ kiện:</h4>
              <h5>{smartPhoneDetail?.productInfo.accessories}</h5>
            </div>
            <div className="flex justify-start align-baseline space-x-4">
              <h4 className="font-bold">Năm ra mắt:</h4>
              <h5>{smartPhoneDetail?.productInfo.launchTime}</h5>
            </div>
            <div className="flex justify-start align-baseline space-x-4">
              <h4 className="font-bold">Thiết kế:</h4>
              <h5>{smartPhoneDetail?.productInfo.design}</h5>
            </div>
            <div className="flex justify-start align-baseline space-x-4">
              <h4 className="font-bold">Khối lượng:</h4>
              <h5>{smartPhoneDetail?.productInfo.mass}</h5>
            </div>
            <div className="flex justify-start align-baseline space-x-4">
              <h4 className="font-bold">Ram:</h4>
              <h5>
                {smartPhoneDetail?.productInfo.lstProductTypeAndPrice[0]?.ram}
              </h5>
            </div>
            <div className="flex justify-start align-baseline space-x-4">
              <h4 className="font-bold">Bộ nhớ trong:</h4>
              <h5>
                {
                  smartPhoneDetail?.productInfo.lstProductTypeAndPrice[0]
                    ?.storageCapacity
                }
              </h5>
            </div>
          </div>
        </Modal>
      </div>
      <div className="mt-8">
        <div className="px-20 py-5 rounded-md">
          <div className=" bg-white p-4 shadow">
            <div className="rounded bg-gray-50 p-4 text-lg capitalize text-slate-700">
              Mô tả sản phẩm
            </div>
            <div className="mx-4 mb-4 mt-12 text-lg leading-loose">
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
      <div className="px-20 py-10">
        <div className="">
          <div className="uppercase text-gray-400">Đánh giá sản phẩm</div>
          <RatingFeedback />
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
