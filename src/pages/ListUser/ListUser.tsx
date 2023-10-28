import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TableUser from "./Tables";

const ListUser = () => {
  const locationUrl = useLocation();
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    async function getUsers() {
      //   const res = await UserService.getUsers().then((res) => setData(res.data));
    }
    getUsers();
  }, []);
  return (
    <div className="">
      <TableUser />
    </div>
  );
};

export default ListUser;
