import axios from "axios";
import { useEffect, useState } from "react";
import { PATHS } from "./paths";
import config from "src/constants/configApi";

const FETCH_TYPES = {
  CITIES: "FETCH_CITIES",
  DISTRICTS: "FETCH_DISTRICTS",
  WARDS: "FETCH_WARDS",
};

async function fetchLocationProvinceOptions(fetchType: string) {
  let url;
  let params;
  switch (fetchType) {
    case FETCH_TYPES.CITIES: {
      url = PATHS.CITIES;
      params = {};
      break;
    }
    default: {
      return [];
    }
  }

  const locations = (
    await axios.get(url, {
      params: params,
      headers: {
        "Content-Type": "application/json",
        token: config.tokenStore,
      },
    })
  ).data["data"];
  return locations.map(
    ({
      ProvinceID,
      ProvinceName,
    }: {
      ProvinceID: number;
      ProvinceName: string;
    }) => ({
      value: ProvinceID,
      label: ProvinceName,
    }),
  );
}
async function fetchLocationDistrictOptions(
  fetchType: string,
  locationId?: string,
) {
  let url;
  let params;
  switch (fetchType) {
    case FETCH_TYPES.CITIES: {
      url = PATHS.CITIES;
      params = {};
      break;
    }
    case FETCH_TYPES.DISTRICTS: {
      url = `${PATHS.DISTRICTS}`;
      params = { province_id: locationId };
      break;
    }
    case FETCH_TYPES.WARDS: {
      url = `${PATHS.WARDS}`;
      params = { district_id: locationId };
      break;
    }
    default: {
      return [];
    }
  }

  const locations = (
    await axios.get(url, {
      params: params,
      headers: {
        "Content-Type": "application/json",
        token: config.tokenStore,
      },
    })
  ).data["data"];
  return locations.map(
    ({
      DistrictID,
      DistrictName,
    }: {
      DistrictID: number;
      DistrictName: string;
    }) => ({
      value: DistrictID,
      label: DistrictName,
    }),
  );
}
async function fetchLocationWardOptions(
  fetchType: string,
  locationId?: string,
) {
  let url;
  let params;
  switch (fetchType) {
    case FETCH_TYPES.CITIES: {
      url = PATHS.CITIES;
      params = {};
      break;
    }
    case FETCH_TYPES.DISTRICTS: {
      url = `${PATHS.DISTRICTS}`;
      params = { province_id: locationId };
      break;
    }
    case FETCH_TYPES.WARDS: {
      url = `${PATHS.WARDS}`;
      params = { district_id: locationId };
      break;
    }
    default: {
      return [];
    }
  }

  const locations = (
    await axios.get(url, {
      params: params,
      headers: {
        "Content-Type": "application/json",
        token: config.tokenStore,
      },
    })
  ).data["data"];
  return locations.map(
    ({ WardCode, WardName }: { WardCode: number; WardName: string }) => ({
      value: WardCode,
      label: WardName,
    }),
  );
}

export async function fetchInitialData() {
  const { cityId, districtId, wardId } = (await axios.get(PATHS.LOCATION)).data;
  const [cities, districts, wards] = await Promise.all([
    fetchLocationProvinceOptions(FETCH_TYPES.CITIES),
    fetchLocationDistrictOptions(FETCH_TYPES.DISTRICTS, cityId),
    fetchLocationWardOptions(FETCH_TYPES.WARDS, districtId),
  ]);
  return {
    cityOptions: cities,
    districtOptions: districts,
    wardOptions: wards,
    selectedCity: cities.find((c: any) => c.value === cityId),
    selectedDistrict: districts.find((d: any) => d.value === districtId),
    selectedWard: wards.find((w: any) => w.value === wardId),
  };
}

function useLocationForm(shouldFetchInitialLocation: boolean) {
  const [state, setState] = useState<any>({
    cityOptions: [],
    districtOptions: [],
    wardOptions: [],
    selectedCity: null,
    selectedDistrict: null,
    selectedWard: null,
  });

  const { selectedCity, selectedDistrict }: any = state;

  useEffect(() => {
    (async function () {
      if (shouldFetchInitialLocation) {
        const initialData = await fetchInitialData();
        setState(initialData);
      } else {
        const options = await fetchLocationProvinceOptions(FETCH_TYPES.CITIES);
        setState({ ...state, cityOptions: options });
      }
    })();
  }, []);

  useEffect(() => {
    (async function () {
      if (!selectedCity) return;
      const options = await fetchLocationDistrictOptions(
        FETCH_TYPES.DISTRICTS,
        selectedCity.value,
      );
      setState({ ...state, districtOptions: options });
    })();
  }, [selectedCity]);

  useEffect(() => {
    (async function () {
      if (!selectedDistrict) return;
      const options = await fetchLocationWardOptions(
        FETCH_TYPES.WARDS,
        selectedDistrict.value,
      );
      setState({ ...state, wardOptions: options });
    })();
  }, [selectedDistrict]);

  function onCitySelect(option: any) {
    if (option !== selectedCity) {
      setState({
        ...state,
        districtOptions: [],
        wardOptions: [],
        selectedCity: option,
        selectedDistrict: null,
        selectedWard: null,
      });
    }
  }

  function onDistrictSelect(option: any) {
    if (option !== selectedDistrict) {
      setState({
        ...state,
        wardOptions: [],
        selectedDistrict: option,
        selectedWard: null,
      });
    }
  }

  function onWardSelect(option: any) {
    setState({ ...state, selectedWard: option });
  }

  function onSubmit(e: any) {
    e.preventDefault();
    const city = {
      name: state.selectedCity?.label,
      id: state.selectedCity?.value,
    };
    const district = {
      name: state.selectedDistrict?.label,
      id: state.selectedDistrict?.value,
    };
    const ward = {
      name: state.selectedWard?.label,
      id: state.selectedWard?.value,
    };
    localStorage.setItem("city", JSON.stringify(city));
    localStorage.setItem("district", JSON.stringify(district));
    localStorage.setItem("ward", JSON.stringify(ward));
  }

  return { state, onCitySelect, onDistrictSelect, onWardSelect, onSubmit };
}

export default useLocationForm;

