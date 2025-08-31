import axios from "axios";
import axiosInstance from "./axiosInstance";
const BASE_URL = import.meta.env.VITE_API_URL;

export const userLogin = async (payload) => {
  try {
    const { data } = await axios.post(BASE_URL + '/users/login', payload);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const registerUser = async (payload) => {
  try {
    const { data } = await axios.post(BASE_URL + '/users/register', payload);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
}

export const getAllUsers = async () => {
  try {
    const { data } = await axiosInstance.get('/users/all');
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateUserStatus = async (userId, isActive) => {
  try {
    const { data } = await axiosInstance.patch(`/users/update/${userId}`, isActive);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};
