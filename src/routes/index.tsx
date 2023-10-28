import { lazy } from "react";
import path from "src/constants/path";
import TabsProducts from "src/pages/TabsProducts";

const Home = lazy(() => import("src/pages/Home/Home"));
const Orders = lazy(() => import("src/pages/Order"));
const NotFound = lazy(() => import("src/pages/NotFound/NotFound"));
const ListUser = lazy(() => import("src/pages/ListUser/ListUser"));
const AddUser = lazy(() => import("src/pages/ListUser/NewUser"));
const UpdateUser = lazy(() => import("src/pages/ListUser/UpdateUser"));
const Products = lazy(() => import("src/pages/Product"));
const Categorys = lazy(() => import("src/pages/Category"));
const Brands = lazy(() => import("src/pages/Brand"));
const NewProduct = lazy(() => import("src/pages/Product/NewPhone"));
const UpdateProduct = lazy(() => import("src/pages/Product/UpdateProduct"));
const UpdateBrand = lazy(() => import("src/pages/Brand/UpdateBrand"));
const UpdateCategory = lazy(() => import("src/pages/Category/UpdateCategory"));
const NewCategory = lazy(() => import("src/pages/Category/NewCategory"));
const NewBrand = lazy(() => import("src/pages/Brand/NewBrand"));

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
    path: path.usersDetail,
    Component: UpdateUser,
  },
  {
    path: path.usersNew,
    Component: AddUser,
  },
  {
    path: path.products,
    Component: Products,
  },
  {
    path: path.productNew,
    Component: TabsProducts,
  },
  {
    path: path.productsDetail,
    Component: UpdateProduct,
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
