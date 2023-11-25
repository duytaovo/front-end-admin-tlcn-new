import { Helmet } from "react-helmet-async";
import TableLaptop from "./TablesLaptop";

export default function ListLaptop() {
  return (
    <div>
      <Helmet>
        <title>{"Trang quản lý laptop"}</title>
        <meta name="description" />
      </Helmet>
      <TableLaptop />
    </div>
  );
}
