import { useDispatch } from "react-redux";
import { createProduct, getSellerProducts } from "../services/product.api";
import { setSellerProducts } from "../state/product.slice";

export const useProduct = () => {
  const dispatch = useDispatch();

  async function handleCreateProduct(payload) {
    const data = await createProduct(payload);
    return data.product;
  }

  async function handleGetSellerProducts() {
    const data = await getSellerProducts();
    dispatch(setSellerProducts(data.products));
    return data.products;
  }

  return { handleCreateProduct, handleGetSellerProducts };
};
