export type LaptopDetail = {
  id: number;
  gateway: string;
  operatingSystem: string;
  monitor: string;
  special: string;
  maximumRam: number;
  maximumRom: number;
  processorId: number;
  processorName: string;
  ramId: number;
  ramName: string;
  romId: number;
  romName: string;
  graphicsCardId: number;
  graphicsCardName: string;
  productInfo: {
    brandId: number;
    categoryId: number;
    productId: number;
    characteristicId: number;
    productCode: string;
    name: string;
    description: string;
    design: string;
    dimension: string;
    mass: number;
    launchTime: number;
    accessories: string;
    productStatus: number;
    lstProductTypeAndPrice: {
      typeId: number;
      ram: string;
      storageCapacity: string;
      color: string;
      price: number;
      salePrice: number;
      depotId: number;
      quantity: number;
    }[];
    lstProductImageUrl: string[];
    totalReview: number;
    star: number;
    slug: string;
  };
};

export type SmartPhoneDetail = {
  id: number;
  monitor: string;
  operatingSystem: string;
  rearCamera: string;
  frontCamera: string;
  chip: string;
  sim: string;
  battery: string;
  charging: string;
  networkSupport: string;
  productInfo: {
    brandId: number;
    categoryId: number;
    productId: number;
    characteristicId: number;
    productCode: string;
    name: string;
    description: string;
    design: string;
    dimension: string;
    mass: number;
    launchTime: number | string;
    accessories: string;
    productStatus: number | string;
    description: string;
    lstProductTypeAndPrice: {
      typeId: number;
      ram: string;
      storageCapacity: string;
      color: string;
      price: number;
      salePrice: number;
      quantity: number;
      depotId: number;
    }[];
    lstProductImageUrl: string[];
    star: number;
    totalReview: number;
    slug: string;
  };
};

export type ListSmartPhone = {
  id: number;
  name: string;
  lstImageUrl: string[];
  lstProductTypeAndPrice: {
    typeId: number;
    ram: string;
    storageCapacity: string;
    color: string;
    price: number;
    salePrice: number;
  }[];
  star: number;
  totalReview: number;
};
