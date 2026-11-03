import axios from "axios";

// backend mounts the router at /api/product (singular)
const ProductApiInstance = axios.create({
  baseURL: "/api/product",
  withCredentials: true,
});

// Backend expects multipart/form-data: text fields + up to 7 files under "images".
// The seller is taken from the auth cookie on the server, so it is not sent.
export async function createProduct({ title, description, images = [], priceAmount, priceCurrency }) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("priceAmount", priceAmount);
  formData.append("priceCurrency", priceCurrency);
  images.forEach((file) => formData.append("images", file));

  const response = await ProductApiInstance.post("/", formData);
  return response.data;
}

export async function getSellerProducts() {
  const response = await ProductApiInstance.get("/seller");
  return response.data;
}
