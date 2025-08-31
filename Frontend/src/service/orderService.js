import privateAxiosInstance, { publicAxiosInstance } from "./axiosInstance";

// Define the base URL for the orders API
const ORDER_URL = "/orders";

// A single function to handle all API calls with a centralized try/catch block
const apiCall = async (
  method,
  endpoint,
  data = {},
  params = {},
  isPublicEndPoint = false
) => {
  try {
    const axiosInstance = isPublicEndPoint
      ? publicAxiosInstance
      : privateAxiosInstance;

    const response = await axiosInstance.request({
      method: method,
      url: `${ORDER_URL}${endpoint}`,
      data: data,
      params: params,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`API call failed: ${error.message}`);
    // Handle specific error types and return a consistent format
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        success: false,
        message: error.response.data.message || "An unexpected error occurred.",
        statusCode: error.response.status,
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        success: false,
        message:
          "No response received from server. Please check your network connection.",
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        success: false,
        message: error.message || "An unexpected error occurred.",
      };
    }
  }
};

/**
 * Creates a new order.
 * @param {object} orderData - The data for the new order.
 * @returns {Promise<object>} - An object with success status and data.
 */
export const createOrder = async (orderData) => {
  return apiCall("post", "/", orderData);
};

/**
 * Retrieves an order by its ID.
 * @param {string} orderId - The ID of the order.
 * @returns {Promise<object>} - An object with success status and data.
 */
export const getOrderById = async (orderId) => {
  return apiCall("get", `/${orderId}`);
};

/**
 * Retrieves all orders for a specific customer.
 * @param {string} customerId - The ID of the customer.
 * @returns {Promise<object>} - An object with success status and data.
 */
export const getOrdersByCustomer = async () => {
  return apiCall("get", `/customer`);
};

/**
 * Retrieves all orders for a specific shop.
 * @param {string} shopId - The ID of the shop owner.
 * @returns {Promise<object>} - An object with success status and data.
 */
export const getOrdersByShop = async () => {
  return apiCall("get", `/shop`);
};

/**
 * Updates the status of an order.
 * @param {string} orderId - The ID of the order to update.
 * @param {string} status - The new status of the order.
 * @returns {Promise<object>} - An object with success status and data.
 */
export const updateOrderStatus = async (orderId, status) => {
  return apiCall("patch", `/${orderId}/status`, { status });
};

/**
 * Deletes an order by its ID.
 * @param {string} orderId - The ID of the order to delete.
 * @returns {Promise<object>} - An object with success status and data.
 */
export const deleteOrder = async (orderId) => {
  return apiCall("delete", `/${orderId}`);
};

/**
 * Updates the payment status of an order.
 * @param {string} orderId - The ID of the order.
 * @param {string} paymentStatus - The new payment status.
 * @returns {Promise<object>} - An object with success status and data.
 */
export const updatePaymentStatus = async (orderId, paymentStatus) => {
  return apiCall("put", `/${orderId}/payment-status`, { paymentStatus });
};

/**
 * Updates the delivery date and status of an order.
 * @param {string} orderId - The ID of the order.
 * @param {object} updateData - The delivery date and status to update.
 * @returns {Promise<object>} - An object with success status and data.
 */
export const updateDeliveryDateAndStatus = async (orderId, updateData) => {
  return apiCall("put", `/${orderId}/delivery-date-status`, updateData);
};


export const getAllOrders = async () => {
  return apiCall("get", "/");
};
