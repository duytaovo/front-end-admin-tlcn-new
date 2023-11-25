import { Helmet } from "react-helmet-async";
import TableMouse from "./TablesMouse";

export default function ListMouse() {
  return (
    <div>
      <Helmet>
        <title>{"Trang quản lý chuột máy tính"}</title>
        <meta name="description" />
      </Helmet>
      <TableMouse />
    </div>
  );
}
