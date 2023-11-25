import { useEffect } from "react";
import { Table } from "flowbite-react";
import OrderDetail from "./OrderDetail";
import "./table.scss";
import clsx from "clsx";

import { useState } from "react";
import numberWithCommas from "src/utils/numberWithCommas";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import {
  getPurchases,
  updatePurchasesCancel,
  updatePurchasesConfirm,
  updatePurchasesDelivery,
  updatePurchasesSuccess,
} from "src/store/order/orderSlice";
import { Button, Pagination } from "antd";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

const Order = ({ title }: { title?: string }) => {
  const style = (text: string) => {
    switch (text) {
      case "Ordered":
        return "text-blue-400 uppercase text-xl font-bold";
      case "Delivering":
        return "text-blue-400";
      case "Cancelled":
        return "text-red-400 uppercase text-xl font-bold";
      case "Confirmed":
        return "text-green-400 font-bold uppercase text-xl";
      case "Delivered":
        return "text-yellow-400 font-bold uppercase text-xl";
    }
  };

  const stringStatus = (text: string) => {
    switch (text) {
      case "Ordered":
        return "Đã đặt hàng";
      case "Delivering":
        return "ĐANG GIAO HÀNG";
      case "Cancelled":
        return "Đã hủy";
      case "Confirmed":
        return "Đã xác nhận";
      case "Delivered":
        return "Đã giao hàng";
    }
  };
  const [orderDetail, setOrderDetail] = useState({ index: -1, id: null });
  const dispatch = useAppDispatch();

  const { order } = useAppSelector((state) => state.orders);

  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const pageSize = 10; // Số phần tử trên mỗi trang

  const handleAccept = async (id: number) => {
    if (confirm("Bạn có muốn Xác nhận đơn hàng không?")) {
      const res = await dispatch(updatePurchasesConfirm(id));

      if (res) {
        toast.success("Xác nhận thành công");
      }
      dispatch(getPurchases(""));
    }
  };

  const handleAcceptSuccess = async (id: number) => {
    if (confirm("Bạn có muốn Xác nhận đơn hàng thành công không?")) {
      const res = await dispatch(updatePurchasesSuccess(id));

      if (res) {
        toast.success("Giao hàng thành công");
      }
      dispatch(getPurchases(""));
    }
  };

  const handleAcceptDelivery = async (id: number) => {
    if (confirm("Bạn có muốn giao cho đơn vị vận chuyển không?")) {
      const res = await dispatch(updatePurchasesDelivery(id));

      if (res) {
        toast.success("Chuyển giao thành công");
      }
      dispatch(getPurchases(""));
    }
  };

  const handleCancel = async (id: number) => {
    if (confirm("Bạn có muốn Hủy đơn hàng không?")) {
      const res = await dispatch(updatePurchasesCancel(id));
      if (res) {
        toast.success("Hủy đơn thành công");
      }
      dispatch(getPurchases(""));
    }
  };

  useEffect(() => {
    dispatch(getPurchases({ pageNumber: currentPage }));
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };

  useEffect(() => {
    document.title = title || "";
  }, [title]);

  return (
    <div className="h-1/2">
      <Helmet>
        <title>{"Trang quản lý đơn hàng "}</title>
        <meta name="description" />
      </Helmet>
      <Table hoverable={true} className="bg-transparent">
        <Table.Head>
          <Table.HeadCell> Mã đơn hàng </Table.HeadCell>
          <Table.HeadCell>Sản phẩm</Table.HeadCell>
          <Table.HeadCell>Số lượng</Table.HeadCell>
          <Table.HeadCell>Giá</Table.HeadCell>
          <Table.HeadCell> Ngày đặt mua</Table.HeadCell>
          <Table.HeadCell>Trạng thái</Table.HeadCell>
          <Table.HeadCell>
            <span className="">Chỉnh sửa</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className=" ">
          {order?.data?.data.map((_order: any, index) => {
            const styleStatus = style(_order.orderStatusString);
            const displayDetail = index === orderDetail.index;
            const displayCancelBtn = _order.orderStatusString != "Ordered";
            const displayButtonDelivered = _order.orderStatus === 4;

            return (
              <>
                <Table.Row
                  key={_order.id}
                  className=" dark:border-gray-700 dark:bg-gray-800 overflow-hidden"
                >
                  <Table.Cell className="text-blue-400 text-2xl">
                    #{_order.id}
                  </Table.Cell>
                  <Table.Cell className="text-blue-400 hover:text-blue-700 select-none text-2xl">
                    <Button
                      type="link"
                      className="p-0"
                      onClick={() =>
                        setOrderDetail((current) => {
                          return current.index === index
                            ? {
                                index: -1,
                                id: _order.id,
                              }
                            : {
                                index,
                                id: _order.id,
                              };
                        })
                      }
                    >
                      Xem chi tiết
                    </Button>
                  </Table.Cell>
                  <Table.Cell className="text-2xl">
                    {_order?.orderDetails?.length}
                  </Table.Cell>
                  <Table.Cell className="text-red-400 text-2xl">
                    {numberWithCommas(_order?.finalPrice)}₫
                  </Table.Cell>
                  <Table.Cell className="text-2xl">
                    {" "}
                    <p className="">{_order?.buyDate.substring(0, 10)}</p>
                  </Table.Cell>

                  <Table.Cell className={styleStatus}>
                    <div className="flex flex-grow justify-between text-xl font-bold">
                      {stringStatus(_order.orderStatusString)}
                      {_order.paymentStatusString === "Payment success" ? (
                        <span className="text-white text-xl bg-green-500 p-2 rounded-lg">
                          Đã thanh toán
                        </span>
                      ) : (
                        <span className="text-white text-xl bg-gray-500 p-2 rounded-lg">
                          Chưa thanh toán
                        </span>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="space-x-3">
                    {_order.orderStatus === 2 ? (
                      <Button
                        type="link"
                        // disabled={displayCancelBtn}
                        id={_order.id}
                        onClick={() => handleAcceptDelivery(_order.id)}
                        className={clsx(
                          "bg-yellow-500 text-xl font-medium rounded-lg  text-white"
                        )}
                      >
                        Giao vận chuyển
                      </Button>
                    ) : _order.orderStatus === 3 ? (
                      <Button
                        type="link"
                        // disabled={displayCancelBtn}
                        id={_order.id}
                        onClick={() => handleAcceptSuccess(_order.id)}
                        className={clsx(
                          "bg-blue-500 text-xl font-medium rounded-lg  text-white"
                        )}
                      >
                        Giao thành công
                      </Button>
                    ) : _order.orderStatus === 4 ? (
                      <Button
                        type="link"
                        disabled={displayButtonDelivered}
                        id={_order.id}
                        onClick={() => handleAcceptSuccess(_order.id)}
                        className={clsx(
                          "bg-blue-500 text-xl font-medium rounded-lg  text-white",
                          displayButtonDelivered &&
                            "!bg-gray-100 !text-gray-700"
                        )}
                      >
                        Đã giao
                      </Button>
                    ) : (
                      <Button
                        type="link"
                        disabled={displayCancelBtn}
                        id={_order.id}
                        onClick={() => handleAccept(_order.id)}
                        className={clsx(
                          "bg-green-500 text-xl font-medium rounded-lg  text-white",
                          displayCancelBtn && "!bg-gray-100 !text-gray-700"
                        )}
                      >
                        Xác nhận
                      </Button>
                    )}

                    <Button
                      type="link"
                      disabled={displayCancelBtn}
                      id={_order.id}
                      onClick={() => handleCancel(_order.id)}
                      className={clsx(
                        "bg-red-500 text-xl font-medium rounded-lg  text-white",
                        displayCancelBtn && "!bg-gray-100 !text-gray-700"
                      )}
                    >
                      Hủy đơn
                    </Button>
                  </Table.Cell>
                </Table.Row>
                {displayDetail && (
                  <Table.Row>
                    <Table.Cell className="" colSpan={7}>
                      <OrderDetail
                        order={_order}
                        displayDetail={displayDetail}
                        setOrderDetail={setOrderDetail}
                        index={index}
                      />
                    </Table.Cell>
                  </Table.Row>
                )}
              </>
            );
          })}
        </Table.Body>
      </Table>
      <div className="fixed bottom-12 left-auto">
        <Pagination
          current={currentPage + 1}
          pageSize={pageSize}
          total={order?.data?.totalElements}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Order;
