import axiosInstance from "./axiosInstance";

export const getAllShops = async () => {
  try {
    const { data } = await axiosInstance.get(`/shops/all`);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateShopStatus = async (shopId, isActive) => {
  try {
    const { data } = await axiosInstance.patch(`/shops/status/${shopId}`, {
      isActive,
    });
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAllActiveShops = async () => {
  try {
    const { data } = await axiosInstance.get(`/shops/active`);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getShopByShopOwnerId = async () => {
  try {
    const { data } = await axiosInstance.get(`/shops/owner`);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateShopDetails = async (shopId, payload) => {
  try {
    const { data } = await axiosInstance.patch(
      `/shops/owner/${shopId}`,
      payload
    );
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getProductsByShopOwnerId = async (ownerId) => {
  try {
    const { data } = await axiosInstance.get(`/shops/owner/${ownerId}/products`);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};
