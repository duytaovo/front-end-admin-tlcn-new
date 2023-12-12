import { Helmet } from "react-helmet-async";
import TablesComputerPower from "./TablesComputerPower";

export default function ListComputerPower() {
  return (
    <div>
      <Helmet>
        <title>{"Trang quản lý màn hình máy tính"}</title>
        <meta name="description" />
      </Helmet>
      <TablesComputerPower />
    </div>
  );
}

