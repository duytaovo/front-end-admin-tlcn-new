import { Helmet } from "react-helmet-async";
import TableMainboard from "./TablesMainboard";

export default function ListMainboard() {
  return (
    <div>
      <Helmet>
        <title>{"Trang quản lý main máy tính"}</title>
        <meta name="description" />
      </Helmet>
      <TableMainboard />
    </div>
  );
}

