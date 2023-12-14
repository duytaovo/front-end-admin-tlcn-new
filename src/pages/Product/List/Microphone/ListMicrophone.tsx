import { Helmet } from "react-helmet-async";
import TableMicrophone from "./TablesMicrophone";

export default function ListMicrophone() {
  return (
    <div>
      <Helmet>
        <title>{"Trang quản lý microphone"}</title>
        <meta name="description" />
      </Helmet>
      <TableMicrophone />
    </div>
  );
}

