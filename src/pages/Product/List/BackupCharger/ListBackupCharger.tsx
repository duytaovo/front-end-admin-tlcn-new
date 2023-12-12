import { Helmet } from "react-helmet-async";
import TablesBackupCharger from "./TablesBackupCharger";

export default function ListBackupCharger() {
  return (
    <div>
      <Helmet>
        <title>{"Trang quản lý màn hình máy tính"}</title>
        <meta name="description" />
      </Helmet>
      <TablesBackupCharger />
    </div>
  );
}

