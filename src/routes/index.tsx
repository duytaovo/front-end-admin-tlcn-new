import { lazy } from "react";
import path from "src/constants/path";
import NewCardGraphic from "src/pages/Product/Create/NewCardGraphic";
import NewProcessor from "src/pages/Product/Create/NewProcessor";
import NewRam from "src/pages/Product/Create/NewRam";
import NewRom from "src/pages/Product/Create/NewRom";
import CardGraphic from "src/pages/Product/List/CardGraphic/CardGraphic";
import Processor from "src/pages/Product/List/Processor/Processor";
import Ram from "src/pages/Product/List/Ram/Ram";
import Rom from "src/pages/Product/List/Rom/Rom";

const Home = lazy(() => import("src/pages/Home/Home"));
const TableProduct = lazy(() => import("src/pages/Product/Tables"));

const Orders = lazy(() => import("src/pages/Order"));
const NotFound = lazy(() => import("src/pages/NotFound/NotFound"));
const ListUser = lazy(() => import("src/pages/ListUser/ListUser"));
const AddUser = lazy(() => import("src/pages/ListUser/NewUser"));
const UpdateUser = lazy(() => import("src/pages/ListUser/UpdateUser"));
const Categorys = lazy(() => import("src/pages/Category"));
const Brands = lazy(() => import("src/pages/Brand"));

const UpdateBrand = lazy(() => import("src/pages/Brand/UpdateBrand"));
const UpdateCategory = lazy(() => import("src/pages/Category/UpdateCategory"));
const NewCategory = lazy(() => import("src/pages/Category/NewCategory"));
const NewBrand = lazy(() => import("src/pages/Brand/NewBrand"));

//Product
const ListPhone = lazy(
  () => import("src/pages/Product/List/SmartPhone/ListPhone")
);
const NewPhone = lazy(() => import("src/pages/Product/Create/NewPhone"));
const UpdatePhone = lazy(() => import("src/pages/Product/Update/UpdatePhone"));
const SmartPhoneDetail = lazy(
  () => import("src/pages/Product/Detail/SmartPhone_Detail")
);
const NewLaptop = lazy(() => import("src/pages/Product/Create/NewLaptop"));
const LaptopDetail = lazy(
  () => import("src/pages/Product/Detail/Laptop_Detail")
);
const ListLaptop = lazy(
  () => import("src/pages/Product/List/Laptop/ListLaptop")
);
const UpdateLaptop = lazy(
  () => import("src/pages/Product/Update/UpdateLaptop")
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
    path: path.laptop,
    Component: ListLaptop,
  },
  {
    path: path.laptopNew,
    Component: NewLaptop,
  },
  {
    path: path.laptopDetail,
    Component: LaptopDetail,
  },
  {
    path: path.laptopUpdate,
    Component: UpdateLaptop,
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
    path: path.ram,
    Component: Ram,
  },
  {
    path: path.ramDetail,
    Component: Ram,
  },
  {
    path: path.ramNew,
    Component: NewRam,
  },
  {
    path: path.rom,
    Component: Rom,
  },
  {
    path: path.romDetail,
    Component: Ram,
  },
  {
    path: path.romNew,
    Component: NewRom,
  },
  {
    path: path.processor,
    Component: Processor,
  },
  {
    path: path.processorDetail,
    Component: Processor,
  },
  {
    path: path.processorNew,
    Component: NewProcessor,
  },
  {
    path: path.cardGrap,
    Component: CardGraphic,
  },
  {
    path: path.processorDetail,
    Component: CardGraphic,
  },
  {
    path: path.cardGrapNew,
    Component: NewCardGraphic,
  },
  {
    path: "*",
    Component: NotFound,
  },
];
