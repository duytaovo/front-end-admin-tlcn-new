const path = {
  home: "/",
  login: "/login",
  logout: "/logout",
  register: "/register",
  orders: "/orders",
  users: "/users",
  usersNew: "/users/new",
  usersDetail: "/user/detail/:id",
  products: "/products",
  smartPhone: "/smartPhone",
  smartPhoneDetail: "/smartPhone/detail/:nameId",
  smartPhoneUpdate: "/smartPhone/detail/update/:nameId",
  smartPhoneNew: "/smartPhoneNew",
  laptop: "/laptop",
  laptopDetail: "/laptop/detail/:nameId",
  laptopUpdate: "/laptop/detail/update/:nameId",
  laptopNew: "/laptopNew",
  categories: "/categories",
  category: "/category/detail",
  categoryNew: "/category/new",
  brand: "/brand",
  brandDetail: "/brand/detail/:id",
  brandNew: "/brand/new",
  ram: "/ram",
  ramDetail: "/ram/detail/:id",
  ramNew: "/ram/new",
  rom: "/rom",
  romDetail: "/rom/detail/:id",
  romNew: "/rom/new",
  processor: "/processor",
  processorDetail: "/processor/detail/:id",
  processorNew: "/processor/new",
  cardGrap: "/cardGraphic",
  cardGrapDetail: "/cardGraphic/detail/:id",
  cardGrapNew: "/cardGraphic/new",
} as const;

export default path;
