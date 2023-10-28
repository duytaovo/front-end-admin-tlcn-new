import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TableBrand from "./Tables";

export default function ListBrand() {
  const locationUrl = useLocation();
  const [data, setData] = useState([]);

  useEffect(() => {
    function getProducts() {
      //   ProductService.getProducts(1, 9999).then((res) => setData(res.data));
    }
    getProducts();
  }, []);
  return (
    <div>
      <div>
        {/* <Datatable
          rows={data}
          title=""
          productColumns={productColumns}
          type="products"
          reply
        /> */}
        <TableBrand />
      </div>
    </div>
  );
}
