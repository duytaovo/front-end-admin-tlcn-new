import "./phone.scss";
import ListProduct from "src/components/ListProduct";
import { useAppSelector } from "src/hooks/useRedux";
export interface DataListPhone {
  id: number;
  title: string;
  link: string;
  type?: string;
}

interface Props {
  choose?: ConcatArray<never> | string | any;
  isOpen: boolean;
  handlePageChange: any;
  currentPage: number;
  chooseBox?: any;
  setChooseBox?: any;
  handleSetChooseBox: any;
  category: string;
}

const ListPhuKien = ({
  choose,
  isOpen,
  handlePageChange,
  currentPage,
  chooseBox,
  setChooseBox,
  handleSetChooseBox,
  category,
}: Props) => {
  const { smartPhone, filter } = useAppSelector<any>(
    (state) => state.smartPhone,
  );
  const { productBySlug } = useAppSelector<any>((state) => state.laptop);
  let dataAfter = smartPhone?.data;

  return (
    <>
      <div className="phone__content">
        <div className="">
          {isOpen === false ? (
            <ListProduct
              products={productBySlug?.data}
              isSlide={false}
              category={category}
              handlePageChange={handlePageChange}
              currentPage={currentPage}
            />
          ) : (
            <ListProduct
              products={dataAfter}
              category={category}
              isSlide={false}
              handlePageChange={handlePageChange}
              currentPage={currentPage}
            ></ListProduct>
          )}
        </div>
      </div>
    </>
  );
};
export default ListPhuKien;

