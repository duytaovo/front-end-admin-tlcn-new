import { lazy } from "react";
import path from "src/constants/path";

const Home = lazy(() => import("src/pages/Home/Home"));
const TableProduct = lazy(() => import("src/pages/Product/Tables"));
const SmartPhoneDetail = lazy(
  () => import("src/pages/Product/Detail/SmartPhone_Detail")
);
const UpdatePhone = lazy(() => import("src/pages/Product/Update/UpdatePhone"));
const Orders = lazy(() => import("src/pages/Order"));
const NotFound = lazy(() => import("src/pages/NotFound/NotFound"));
const ListUser = lazy(() => import("src/pages/ListUser/ListUser"));
const AddUser = lazy(() => import("src/pages/ListUser/NewUser"));
const UpdateUser = lazy(() => import("src/pages/ListUser/UpdateUser"));
const Categorys = lazy(() => import("src/pages/Category"));
const Brands = lazy(() => import("src/pages/Brand"));
const NewPhone = lazy(() => import("src/pages/Product/Create/NewPhone"));
const UpdateProduct = lazy(
  () => import("src/pages/Product/Update/UpdatePhone")
);
const UpdateBrand = lazy(() => import("src/pages/Brand/UpdateBrand"));
const UpdateCategory = lazy(() => import("src/pages/Category/UpdateCategory"));
const NewCategory = lazy(() => import("src/pages/Category/NewCategory"));
const NewBrand = lazy(() => import("src/pages/Brand/NewBrand"));
const ListPhone = lazy(
  () => import("src/pages/Product/List/SmartPhone/ListPhone")
);

export const routeMain = [
  {
    path: path.home,
    Component: Home,
  },

  {
    path: path.orders,
    Component: Orders,
  },
  {
    path: path.users,
    Component: ListUser,
  },
  {
    path: path.products,
    Component: TableProduct,
  },
  {
    path: path.usersDetail,
    Component: UpdateUser,
  },
  {
    path: path.usersNew,
    Component: AddUser,
  },
  {
    path: path.smartPhone,
    Component: ListPhone,
  },
  {
    path: path.smartPhoneNew,
    Component: NewPhone,
  },
  {
    path: path.smartPhoneDetail,
    Component: SmartPhoneDetail,
  },
  {
    path: path.smartPhoneUpdate,
    Component: UpdatePhone,
  },
  {
    path: path.categories,
    Component: Categorys,
  },
  {
    path: path.category,
    Component: UpdateCategory,
  },
  {
    path: path.categoryNew,
    Component: NewCategory,
  },
  {
    path: path.brand,
    Component: Brands,
  },
  {
    path: path.brandDetail,
    Component: UpdateBrand,
  },
  {
    path: path.brandNew,
    Component: NewBrand,
  },
  {
    path: "*",
    Component: NotFound,
  },
];
