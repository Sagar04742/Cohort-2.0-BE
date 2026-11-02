import axios from "axios";

const ProductApiInstance = axios.create({
  baseURL: "/api/products",
  withCredentials: true,
});


const async function createProduct(fromData){
    const response = await ProductApiInstance.post("/" , {title, description,images, price , seller})
    return response.data
}

const async function getSellerProducts() {
    const response = await ProductApiInstance.get("/seller")
    return response.data
}