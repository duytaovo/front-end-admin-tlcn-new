import { Helmet } from "react-helmet-async";
import TablesBackupCharger from "./TablesBackupCharger";

export default function ListBackupCharger() {
  return (
    <div>
      <Helmet>
        <title>{"Trang quản lý sạc dự phòng"}</title>
        <meta name="description" />
      </Helmet>
      <TablesBackupCharger />
    </div>
  );
}

