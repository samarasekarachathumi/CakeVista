import privateAxiosInstance, {publicAxiosInstance} from "./axiosInstance";

// Define the base URL for the product API
const PRODUCT_URL = "/products";

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
      url: `${PRODUCT_URL}${endpoint}`,
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
 * Creates a new product.
 * @param {object} productData - The data for the new product.
 * @returns {Promise<object>} - An object with success status and data.
 */
export const createProduct = async (productData) => {
  return apiCall("post", "/create", productData);
};

/**
 * Retrieves all products for a specific shop owner.
 * @param {string} shopOwnerId - The ID of the shop owner.
 * @returns {Promise<object>} - An object with success status and data.
 */
export const getProductsByShopOwner = async () => {
  return apiCall("get", `/manage`);
};

/**
 * Retrieves a single product by its ID.
 * @param {string} productId - The ID of the product.
 * @returns {Promise<object>} - An object with success status and data.
 */
export const getProductById = async (productId) => {
  return apiCall("get", `/${productId}`,{}, {}, true);
};

/**
 * Updates a product by its ID.
 * @param {string} productId - The ID of the product to update.
 * @param {object} updateData - The data to update the product with.
 * @returns {Promise<object>} - An object with success status and data.
 */
export const updateProduct = async (productId, updateData) => {
  return apiCall("put", `/${productId}`, updateData);
};

/**
 * Deletes a product by its ID.
 * @param {string} productId - The ID of the product to delete.
 * @returns {Promise<object>} - An object with success status and data.
 */
export const deleteProduct = async (productId) => {
  return apiCall("delete", `/${productId}`);
};

/**
 * Retrieves all products.
 * @returns {Promise<object>} - An object with success status and data.
 */
export const getAllProducts = async () => {
  return apiCall("get", "/all", {}, {}, true);
};

export const getLatestProducts = async () => {
  return apiCall("get", "/least-added", {}, {}, true);
};
