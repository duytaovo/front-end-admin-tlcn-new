import React from "react";
import ListCategory from "./ListCategory";
import { Helmet } from "react-helmet-async";

type Props = {};

const Categorys = (props: Props) => {
  return (
    <div>
      <Helmet>
        <title>{"Trang danh mục"}</title>
        <meta name="description" />
      </Helmet>
      <ListCategory />
    </div>
  );
};

export default Categorys;
