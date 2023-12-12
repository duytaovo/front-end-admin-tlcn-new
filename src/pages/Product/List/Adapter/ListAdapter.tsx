import { Helmet } from "react-helmet-async";
import TableAdapter from "./TablesMonitor";

export default function ListAdapter() {
  return (
    <div>
      <Helmet>
        <title>{"Trang quản lý màn hình máy tính"}</title>
        <meta name="description" />
      </Helmet>
      <TableAdapter />
    </div>
  );
}

