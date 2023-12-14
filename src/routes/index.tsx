import { lazy } from "react";
import path from "src/constants/path";
import NewAdapter from "src/pages/Product/Create/NewAdapter";
import NewBackup from "src/pages/Product/Create/NewBackup";
import NewComputerPower from "src/pages/Product/Create/NewComputerPower";
import NewMainboard from "src/pages/Product/Create/NewMainboard";
import NewMicrophone from "src/pages/Product/Create/NewMicrophone";
import NewMonitor from "src/pages/Product/Create/NewMonitor";
import AdapterDetail from "src/pages/Product/Detail/Adapter_Detail/Adapter_Detail";
import BackupChargerDetail from "src/pages/Product/Detail/BackupCharger_Detail/BackupCharger_Detail";
import CardGrabphicDetail from "src/pages/Product/Detail/CardGrabphic_Detail";
import ComputerPowerDetail from "src/pages/Product/Detail/ComputerPower_Detail/ComputerPower_Detail";
import Mainboard_Detail from "src/pages/Product/Detail/Mainboard_Detail";
import Microphone_Detail from "src/pages/Product/Detail/Microphone_Detail";
import MonitorDetail from "src/pages/Product/Detail/Monitor_Detail";
import ProcessorDetail from "src/pages/Product/Detail/Processor_Detail";
import RamDetail from "src/pages/Product/Detail/Ram_Detail";
import RomDetail from "src/pages/Product/Detail/Rom_Detail";
import ListAdapter from "src/pages/Product/List/Adapter/ListAdapter";
import ListBackupCharger from "src/pages/Product/List/BackupCharger/ListBackupCharger";
import ListComputerPower from "src/pages/Product/List/ComputerPower/ListComputerPower";
import ListMainboard from "src/pages/Product/List/Mainboard/ListMainboard";
import ListMicrophone from "src/pages/Product/List/Microphone/ListMicrophone";
import ListMonitor from "src/pages/Product/List/Monitor/ListMonitor";
import UpdateBackupCharger from "src/pages/Product/Update/UpdateBackupCharger";
import UpdateComputerPower from "src/pages/Product/Update/UpdateComputerPower";
import UpdateMainboard from "src/pages/Product/Update/UpdateMainboard";
import UpdateMicrophone from "src/pages/Product/Update/UpdateMicrophone";
import UpdateMonitor from "src/pages/Product/Update/UpdateMonitor";

const MouseDetail = lazy(() => import("src/pages/Product/Detail/Mouse_Detail"));
const KeyboardDetail = lazy(
  () => import("src/pages/Product/Detail/Keyboard_Detail"),
);
const UpdateKeyboard = lazy(
  () => import("src/pages/Product/Update/UpdateKeyboard"),
);

const ListKeyboard = lazy(
  () => import("src/pages/Product/List/Keyboard/ListKeyboard"),
);
const NewKeyboard = lazy(() => import("src/pages/Product/Create/NewKeyboard"));

const NewLoudSpeaker = lazy(
  () => import("src/pages/Product/Create/NewLoudSpeaker"),
);
const TableFeedback = lazy(() => import("src/pages/Feedback"));
const NewMouse = lazy(() => import("src/pages/Product/Create/NewMouse"));

const NewCardGraphic = lazy(
  () => import("src/pages/Product/Create/NewCardGraphic"),
);
const NewProcessor = lazy(
  () => import("src/pages/Product/Create/NewProcessor"),
);
const CardGraphic = lazy(
  () => import("src/pages/Product/List/CardGraphic/CardGraphic"),
);
const Processor = lazy(
  () => import("src/pages/Product/List/Processor/Processor"),
);
const UpdateLoudSpeaker = lazy(
  () => import("src/pages/Product/Update/UpdateLoudSpeaker"),
);
const LoudSpeakerDetail = lazy(
  () => import("src/pages/Product/Detail/LoudSpeaker_Detail"),
);
const UpdateMouse = lazy(() => import("src/pages/Product/Update/UpdateMouse"));
const ListLoudSpeaker = lazy(
  () => import("src/pages/Product/List/LoudSpeaker/ListLoudSpeaker"),
);
const ListMouse = lazy(() => import("src/pages/Product/List/Mouse/ListMouse"));
const Rom = lazy(() => import("src/pages/Product/List/Rom/Rom"));

const Ram = lazy(() => import("src/pages/Product/List/Ram/Ram"));
const NewRom = lazy(() => import("src/pages/Product/Create/NewRom"));
const NewRam = lazy(() => import("src/pages/Product/Create/NewRam"));
const Home = lazy(() => import("src/pages/home_new/Home"));
const TableProduct = lazy(() => import("src/pages/Product/Tables"));

const Orders = lazy(() => import("src/pages/Order"));
const NotFound = lazy(() => import("src/pages/NotFound/NotFound"));
const ListUser = lazy(() => import("src/pages/ListUser/ListUser"));
const AddUser = lazy(() => import("src/pages/ListUser/NewUser"));
const UpdateUser = lazy(() => import("src/pages/ListUser/UpdateUser"));
const Categorys = lazy(() => import("src/pages/Category"));
const Brands = lazy(() => import("src/pages/Brand"));

const ListTablet = lazy(
  () => import("src/pages/Product/List/Tablet/ListTablet"),
);
const UpdateTablet = lazy(
  () => import("src/pages/Product/Update/UpdateTablet"),
);
const NewTablet = lazy(() => import("src/pages/Product/Create/NewTablet"));
const TabletDetail = lazy(
  () => import("src/pages/Product/Detail/Tablet/Tablet_Detail"),
);

//Product
const ListPhone = lazy(
  () => import("src/pages/Product/List/SmartPhone/ListPhone"),
);
const NewPhone = lazy(() => import("src/pages/Product/Create/NewPhone"));
const UpdatePhone = lazy(() => import("src/pages/Product/Update/UpdatePhone"));
const SmartPhoneDetail = lazy(
  () => import("src/pages/Product/Detail/SmartPhone_Detail"),
);
const NewLaptop = lazy(() => import("src/pages/Product/Create/NewLaptop"));
const LaptopDetail = lazy(
  () => import("src/pages/Product/Detail/Laptop_Detail"),
);
const ListLaptop = lazy(
  () => import("src/pages/Product/List/Laptop/ListLaptop"),
);
const UpdateLaptop = lazy(
  () => import("src/pages/Product/Update/UpdateLaptop"),
);

const UpdateBrand = lazy(() => import("src/pages/Brand/UpdateBrand"));
const UpdateCategory = lazy(() => import("src/pages/Category/UpdateCategory"));
const NewCategory = lazy(() => import("src/pages/Category/NewCategory"));
const NewBrand = lazy(() => import("src/pages/Brand/NewBrand"));

const NewSmartWatch = lazy(
  () => import("src/pages/Product/Create/NewSmartWatch"),
);
const SmartWatchDetail = lazy(
  () => import("src/pages/Product/Detail/SmartWatch/SmartWatch_Detail"),
);
const ListSmartWatch = lazy(
  () => import("src/pages/Product/List/SmartWatch/ListSmartWatch"),
);
const UpdateSmartWatch = lazy(
  () => import("src/pages/Product/Update/UpdateSmartWatch"),
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
    Component: RamDetail,
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
    Component: RomDetail,
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
    Component: ProcessorDetail,
  },
  {
    path: path.cardGrapDetail,
    Component: CardGrabphicDetail,
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
    Component: CardGrabphicDetail,
  },
  {
    path: path.cardGrapNew,
    Component: NewCardGraphic,
  },
  {
    path: path.tablet,
    Component: ListTablet,
  },
  {
    path: path.tabletNew,
    Component: NewTablet,
  },
  {
    path: path.tabletDetail,
    Component: TabletDetail,
  },
  {
    path: path.tabletUpdate,
    Component: UpdateTablet,
  },
  {
    path: path.tablet,
    Component: ListTablet,
  },
  {
    path: path.tabletNew,
    Component: NewTablet,
  },
  {
    path: path.tabletDetail,
    Component: TabletDetail,
  },
  {
    path: path.tabletUpdate,
    Component: UpdateTablet,
  },
  {
    path: path.smartWatch,
    Component: ListSmartWatch,
  },
  {
    path: path.smartWatchNew,
    Component: NewSmartWatch,
  },
  {
    path: path.smartWatchDetail,
    Component: SmartWatchDetail,
  },
  {
    path: path.smartWatchUpdate,
    Component: UpdateSmartWatch,
  },
  {
    path: path.mouse,
    Component: ListMouse,
  },
  {
    path: path.mouseNew,
    Component: NewMouse,
  },
  {
    path: path.mouseDetail,
    Component: MouseDetail,
  },
  {
    path: path.mouseUpdate,
    Component: UpdateMouse,
  },
  {
    path: path.loudSpeaker,
    Component: ListLoudSpeaker,
  },
  {
    path: path.loudSpeakerNew,
    Component: NewLoudSpeaker,
  },
  {
    path: path.loudSpeakerDetail,
    Component: LoudSpeakerDetail,
  },
  {
    path: path.loudSpeakerUpdate,
    Component: UpdateLoudSpeaker,
  },
  {
    path: path.keyboard,
    Component: ListKeyboard,
  },
  {
    path: path.keyboardNew,
    Component: NewKeyboard,
  },
  {
    path: path.keyboardDetail,
    Component: KeyboardDetail,
  },
  {
    path: path.keyboardUpdate,
    Component: UpdateKeyboard,
  },
  {
    path: path.feedback,
    Component: TableFeedback,
  },
  /////////////////
  {
    path: path.monitor,
    Component: ListMonitor,
  },
  {
    path: path.monitorNew,
    Component: NewMonitor,
  },
  {
    path: path.monitorDetail,
    Component: MonitorDetail,
  },
  {
    path: path.monitorUpdate,
    Component: UpdateMonitor,
  },
  {
    path: path.microPhone,
    Component: ListMicrophone,
  },
  {
    path: path.microPhoneNew,
    Component: NewMicrophone,
  },
  {
    path: path.microPhoneDetail,
    Component: Microphone_Detail,
  },
  {
    path: path.microPhoneUpdate,
    Component: UpdateMicrophone,
  },
  {
    path: path.mainBoard,
    Component: ListMainboard,
  },
  {
    path: path.mainBoardNew,
    Component: NewMainboard,
  },
  {
    path: path.mainBoardDetail,
    Component: Mainboard_Detail,
  },
  {
    path: path.mainBoardUpdate,
    Component: UpdateMainboard,
  },
  {
    path: path.backupCharger,
    Component: ListBackupCharger,
  },
  {
    path: path.backupChargerNew,
    Component: NewBackup,
  },
  {
    path: path.backupChargerDetail,
    Component: BackupChargerDetail,
  },
  {
    path: path.backupChargerUpdate,
    Component: UpdateBackupCharger,
  },
  {
    path: path.computerPower,
    Component: ListComputerPower,
  },
  {
    path: path.computerPowerNew,
    Component: NewComputerPower,
  },
  {
    path: path.computerPowerDetail,
    Component: ComputerPowerDetail,
  },
  {
    path: path.computerPowerUpdate,
    Component: UpdateComputerPower,
  },
  {
    path: path.adapter,
    Component: ListAdapter,
  },
  {
    path: path.adapterNew,
    Component: NewAdapter,
  },
  {
    path: path.adapterDetail,
    Component: AdapterDetail,
  },
  {
    path: path.adapterUpdate,
    Component: UpdateMonitor,
  },
  {
    path: "*",
    Component: NotFound,
  },
];

