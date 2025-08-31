import axiosInstance from "./axiosInstance";
const BASE_URL = import.meta.env.VITE_API_URL;


export const createAdvertisement = async (payload) => {
  try {
    const { data } = await axiosInstance.post(BASE_URL + '/advertisements/', payload);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
}

export const getAdvertisementsDetailsByShopId = async () => {
  try {
    const { data } = await axiosInstance.get(`${BASE_URL}/advertisements/shop/`);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
}

export const deleteAdvertisementById = async (adId) => {
  try {
    const { data } = await axiosInstance.delete(`${BASE_URL}/advertisements/${adId}`);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
}

export const getAllAdvertisements = async () => {
  try {
    const { data } = await axiosInstance.get(`${BASE_URL}/advertisements/`);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
}

export const updateAdvertisementById = async (adId, payload) => {
  try {
    const { data } = await axiosInstance.patch(`${BASE_URL}/advertisements/${adId}`, payload);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
}

export const getActiveAdvertisementByAdPosition = async (adPosition) => {
  try {
    const { data } = await axiosInstance.get(`${BASE_URL}/advertisements/active/${adPosition}`);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
}
