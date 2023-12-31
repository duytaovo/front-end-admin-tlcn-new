const handleData = (_data: any, filter: any) => {
  let data = _data.data;
  let gia: any = 0;
  let price: any = 0;
  // Lọc qua từng product trong mảng
  const dataAfter = data?.data?.filter((ele: any) => {
    if (ele.parameter) {
      // Lọc qua từng cặp key value trong parameter
      for (const [key, value] of Object?.entries(ele?.parameter)) {
        // Lọc qua từng phần tử trong
        const checkTitle = filter?.data.some((element: any) => {
          let keyM = Object.keys(element);
          let valueM: number[] = Object.values(element);

          if (keyM[0] == "Giá") {
            gia = valueM[0];

            let temp = [0, 1000000000];

            if (gia.search("Dưới") != -1) {
              let split_str = gia.match(/[0-9]+/)[0];
              temp[1] = Number(split_str + "000000");
            } else if (gia.search("Trên") != -1) {
              let split_str = gia.match(/[0-9]+/)[0];
              temp[0] = Number(split_str + "000000");
            } else if (gia.search("Từ") != -1) {
              let split_str = gia.match(/[0-9]+/)[0];
              temp[0] = Number(split_str + "000000");

              const res = gia.match(/\d+/g)?.[1];
              temp[1] = Number(res + "000000");
            }

            return ele.price >= temp[0] && ele.price <= temp[1];
          }
          if (keyM[0] == "Hãng") {
            return ele.brand === valueM[0];
          }
          if (keyM[0] == "price") {
            price = valueM[0];
          }
          if (keyM[0] === key) {
            if (typeof valueM[0] === "string" && valueM[0] === value)
              return true;
            else {
              // if (value.includes(valueM[0])) return true;
            }
          }
          return false;
        });

        if (price != 0) {
          let temp = [0, 1000000000];

          let split_str = price.match(/[0-9]+/)[0];
          temp[0] = Number(split_str + "000");

          const res = price.match(/\d+/g)?.[1];
          temp[1] = Number(res + "000");

          return ele.price >= temp[0] && ele.price <= temp[1];
        }

        if (gia != 0 && checkTitle) {
          return ele;
        }
        if (checkTitle) return ele;
      }
    }
  });

  return dataAfter;
};

export default handleData;
