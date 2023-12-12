import { Helmet } from "react-helmet-async";
import TableMonitor from "./TablesMicrophone";

export default function ListMonitor() {
  return (
    <div>
      <Helmet>
        <title>{"Trang quản lý màn hình máy tính"}</title>
        <meta name="description" />
      </Helmet>
      <TableMonitor />
    </div>
  );
}

