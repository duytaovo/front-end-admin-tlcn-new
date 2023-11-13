import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import laptopApi from "src/api/product/laptop/laptop-api";
import { LaptopDetail } from "src/types/allProductsType.interface";
import { payloadCreator } from "src/utils/utils";

export const getLaptop = createAsyncThunk(
  "laptop/getLaptop",
  payloadCreator(laptopApi.getLaptops)
);

export const getDetailLaptop = createAsyncThunk(
  "laptop/getDetailLaptop",
  payloadCreator(laptopApi.getDetailLaptop)
);
export const addLaptop = createAsyncThunk(
  "laptop/addLaptop",
  payloadCreator(laptopApi.addLaptop)
);
// export const uploadImageProduct = createAsyncThunk(
//   "smartPhone/uploadImageProduct",
//   payloadCreator(laptopApi.)
// );
// export const uploadImagesProduct = createAsyncThunk(
//   "smartPhone/uploadImagesProduct",
//   payloadCreator(laptopApi.uploadImagesProduct)
// );
export const updateLaptop = createAsyncThunk(
  "laptop/updateLaptop",
  payloadCreator(laptopApi.updateLaptop)
);

export const deleteLaptop = createAsyncThunk(
  "laptop/deleteLaptop",
  payloadCreator(laptopApi.deleteLaptop)
);

interface IProudct {
  laptop: any;
  laptopDetail: LaptopDetail;
}
const data = {
  id: 2,
  gateway: "",
  operatingSystem: "macOs",
  monitor: "15.3 inch",
  special: " Bảo mật vân tay",
  maximumRam: 0,
  maximumRom: 0,
  processorId: 1,
  processorName: "Không có",
  ramId: 1,
  ramName: "Không có",
  romId: 1,
  romName: "Không có",
  graphicsCardId: 1,
  graphicsCardName: "Không có",
  productInfo: {
    brandId: 1,
    categoryId: 2,
    productId: 16,
    characteristicId: 3,
    productCode: "kymff2qsXC",
    name: "Laptop MacBook Air 15 inch M2 2023 8CPU/8GB/256GB/10GPU",
    description:
      '<h3><a href="https://www.thegioididong.com/laptop/apple-macbook-air-m2-2023" rel="noopener noreferrer" target="_blank" style="color: rgb(47, 128, 237);"><strong>MacBook Air 15 inch M2 2023</strong></a><strong>&nbsp;đã có phiên bản cải tiến vừa được nhà Apple cho ra mắt,&nbsp;thêm không gian cho những điều bạn yêu với màn hình Liquid Retina 15 inch ấn tượng. Với người dùng yêu&nbsp;thích hiệu năng "nhanh như chớp" trong một thiết kế siêu gọn nhẹ của dòng Air thì đây chắc chắn là một sản phẩm bạn không nên bỏ qua.</strong></h3><h3><strong>Màn hình&nbsp;Retina 15 inch lớn ấn tượng&nbsp;</strong></h3><p>Với phiên bản 2023,&nbsp;<a href="https://www.thegioididong.com/laptop-apple-macbook-air" rel="noopener noreferrer" target="_blank" style="color: rgb(47, 128, 237);">Macbook Air</a>&nbsp;được nâng cấp màn hình lên&nbsp;<strong>15.3 inch</strong>, được trang bị tấm nền&nbsp;<strong>IPS</strong>&nbsp;cùng độ phân giải&nbsp;<strong>Liquid Retina (2880 x 1864)</strong>&nbsp;giúp những khung hình được tái hiện hoàn hảo, có độ sắc nét cao cùng không gian trải nghiệm nội dung rộng lớn. Độ phủ màu rộng&nbsp;<strong>P3</strong>&nbsp;cùng mức hiển thị&nbsp;<strong>1 tỷ màu</strong>&nbsp;hỗ trợ các tác vụ đồ họa với khả năng xuất hình ảnh chuẩn xác.</p><p>Hơn nữa, độ sáng<strong>&nbsp;500 nits</strong>&nbsp;cùng công nghệ&nbsp;<strong>True Tone Technology</strong>&nbsp;giúp tăng cường khả năng hiển thị của bạn, dễ dàng điều chỉnh linh hoạt, tương thích tự động độ sáng với điều kiện môi trường để cho trình xem hoàn hảo nhất.</p><p><br></p><p><a href="https://cdn.tgdd.vn/Products/Images/44/309016/apple-macbook-air-m2-2023-six.jpg" rel="noopener noreferrer" target="_blank" style="color: rgb(47, 128, 237);"><img src="https://cdn.tgdd.vn/Products/Images/44/309016/apple-macbook-air-m2-2023-six.jpg" alt="MacBook Air 15 inch M2 2023 - Màn hình"></a></p><p><br></p><p>Hệ thống âm thanh vòm đa chiều<strong>&nbsp;Dolby Atmos</strong>,&nbsp;<strong>Spatial Audio</strong>&nbsp;kết hợp cùng&nbsp;<strong>6 loa</strong>&nbsp;mang đến trọn vẹn những trải nghiệm giải trí chân thực với chất âm sống động, âm bass to rõ, độ khuếch đại âm thanh lớn cho phép bạn đắm chìm trong những bản nhạc hay bộ phim yêu thích.&nbsp;</p><p><br></p><p><a href="https://cdn.tgdd.vn/Products/Images/44/309016/apple-macbook-air-m2-2023-070623-044421.jpg" rel="noopener noreferrer" target="_blank" style="color: rgb(47, 128, 237);"><img src="https://cdn.tgdd.vn/Products/Images/44/309016/apple-macbook-air-m2-2023-070623-044421.jpg" alt="MacBook Air 15 inch M2 2023 - Âm thanh"></a></p><p><br></p><h3><strong>Hiệu năng vượt trội, cân mọi tác vụ</strong></h3><p>MacBook Air 15 inch sở hữu hiệu năng mạnh mẽ đến từ bộ vi xử lý&nbsp;<strong>Apple M2</strong>&nbsp;sử dụng kiến ​​trúc&nbsp;<strong>Apple ARM</strong>&nbsp;và hiện được sản xuất trên tiến trình<strong>&nbsp;5 nm&nbsp;</strong>hoàn chỉnh với&nbsp;<strong>20 tỷ bóng bán dẫn</strong>&nbsp;mang đến hiệu năng mạnh mẽ và ổn định được duy trì từ phiên bản 13 inch trước đó. Với tốc độ băng thông bộ nhớ&nbsp;<strong>100 GB/s&nbsp;</strong>được cải tiến vượt trội, máy cho khả năng vận hành hoàn hảo mọi tác vụ học tập, làm việc hay giải trí.</p><p>Khả năng xử lý đồ họa, chinh phục các tác vụ thiết kế nhanh chóng và hiệu quả card tích hợp&nbsp;<strong>10 nhân GPU</strong>. Chiếc&nbsp;<a href="https://www.thegioididong.com/laptop-apple-macbook" rel="noopener noreferrer" target="_blank" style="color: rgb(47, 128, 237);">Macbook</a>&nbsp;Apple này&nbsp;cho phép bạn thao tác mượt mà các ứng dụng đồ họa như Adobe Illustrator, Premiere,.... thực hiện thiết kế, sáng tạo cùng với trình phát video nâng cao đều không thành vấn đề.</p><p><br></p><p><a href="https://cdn.tgdd.vn/Products/Images/44/309016/apple-macbook-air-m2-2023-one.jpg" rel="noopener noreferrer" target="_blank" style="color: rgb(47, 128, 237);"><img src="https://cdn.tgdd.vn/Products/Images/44/309016/apple-macbook-air-m2-2023-one.jpg" alt="MacBook Air 15 inch M2 2023 - Hiệu năng"></a></p><p><br></p><p>Bộ nhớ&nbsp;<strong>RAM 8 GB</strong>&nbsp;mang đến khả năng đa nhiệm mượt mà, thực hiện xử lý công việc với nhiều layer đồ họa cùng lúc ứng dụng khác như Spotify hay Youtube mà không gặp hiện tượng giật lag. Với ổ cứng&nbsp;<strong>SSD&nbsp;256 GB&nbsp;</strong>cung cấp một không gian lưu trữ vừa đủ cho các tệp tin, ứng dụng và trò chơi.</p><p>Hệ điều hành&nbsp;<strong>Mac OS</strong>&nbsp;vừa mang đến kho ứng dụng đồ sộ đáp ứng đầy đủ mọi nhu cầu làm việc và giải trí của người dùng, vừa nâng cao trình bảo mật và tính năng quản lý của máy, bảo vệ tốt cho dữ liệu và thông tin.</p><p><br></p><p><a href="https://cdn.tgdd.vn/Products/Images/44/309016/apple-macbook-air-m2-2023-070623-043656.jpg" rel="noopener noreferrer" target="_blank" style="color: rgb(47, 128, 237);"><img src="https://cdn.tgdd.vn/Products/Images/44/309016/apple-macbook-air-m2-2023-070623-043656.jpg" alt="MacBook Air 15 inch M2 2023 - MacOS"></a></p><p><br></p><h3><strong>Thiết kế linh hoạt, mỏng không tưởng</strong></h3><p>Macbook luôn là điển hình của&nbsp;<a href="https://www.thegioididong.com/laptop?g=cao-cap-sang-trong" rel="noopener noreferrer" target="_blank" style="color: rgb(47, 128, 237);">laptop cao cấp- sang trọng</a>&nbsp;với lối thiết kế sang trọng và thanh lịch cũng không ngoại lệ với phiên bản&nbsp;MacBook Air 15 inch lần này. Sở hữu thiết kế tai thỏ tương tự phiên bản Mac Air M2 13 inch, tuy nhiên với kích thước lớn hơn nên tạo cảm giác nhìn thích mắt và tinh tế hơn đôi phần.</p><p><a href="https://www.thegioididong.com/laptop" rel="noopener noreferrer" target="_blank" style="color: rgb(47, 128, 237);">Laptop</a>&nbsp;với khối lượng&nbsp;<strong>1.51 kg</strong>&nbsp;cùng độ dày chỉ vỏn vẹn&nbsp;<strong>11.5 mm&nbsp;</strong>kết hợp với chất liệu<strong>&nbsp;nhôm tái chế 100%</strong>, không những thân thiện với môi trường mà còn sang trọng, gọn nhẹ&nbsp;thuận tiện cho người dùng mang theo phục vụ công việc mọi lúc mọi nơi.&nbsp;</p><p><br></p><p><a href="https://cdn.tgdd.vn/Products/Images/44/309016/apple-macbook-air-m2-2023-070623-043653.jpg" rel="noopener noreferrer" target="_blank" style="color: rgb(47, 128, 237);"><img src="https://cdn.tgdd.vn/Products/Images/44/309016/apple-macbook-air-m2-2023-070623-043653.jpg" alt="MacBook Air 15 inch M2 2023 - Thiết kế"></a></p><p><br></p><p><strong>Magic Keyboard</strong>&nbsp;với hàng phím chức năng có chiều cao tiêu chuẩn, tạo cảm giác êm ái có độ tĩnh lặng khi thao tác gõ, phù hợp với đối tượng người dùng làm văn phòng, yêu cầu có sự yên lặng để tập trung cao độ khi làm việc. Bên cạnh đó,&nbsp;<strong>đèn nền bàn phím</strong>&nbsp;còn giúp ích rất nhiều khi làm việc trong môi trường tối.</p><p><strong>Touch ID</strong>&nbsp;hỗ trợ các thao tác truy cập vào máy hay mở khóa các ứng dụng và trang web nhanh chóng, dễ dàng với một chạm đơn giản.</p>',
    design: "",
    dimension: "",
    mass: 1.51,
    launchTime: 2028,
    accessories: "",
    productStatus: 100,
    lstProductTypeAndPrice: [
      {
        typeId: 6,
        ram: "",
        storageCapacity: "",
        color: "",
        price: 0.0,
        salePrice: 0.0,
        depotId: 0,
        quantity: 0,
      },
    ],
    lstProductImageUrl: [],
    totalReview: 0,
    star: 0,
    slug: "",
  },
};
const initialState: IProudct = {
  laptop: [],
  laptopDetail: data,
};
const Laptoplice = createSlice({
  name: "laptop",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLaptop.fulfilled, (state, { payload }) => {
      state.laptop = payload.data;
    });
    builder.addCase(getDetailLaptop.fulfilled, (state, { payload }) => {
      state.laptopDetail = payload.data.data;
    });
  },
});

const laptopReducer = Laptoplice.reducer;
export default laptopReducer;
