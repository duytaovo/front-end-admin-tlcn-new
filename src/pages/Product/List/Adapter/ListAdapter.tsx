import { Helmet } from "react-helmet-async";
import TableAdapter from "./TablesAdapter";

export default function ListAdapter() {
  return (
    <div>
      <Helmet>
        <title>{"Trang quản lý cục sạc"}</title>
        <meta name="description" />
      </Helmet>
      <TableAdapter />
    </div>
  );
}

