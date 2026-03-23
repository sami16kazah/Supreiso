"use client";

import { useCart } from "@/app/context/CartContext";
import { useModal } from "@/app/context/ModalContext";
import { MdAddShoppingCart } from "react-icons/md";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const { showAlert } = useModal();

  const handleAdd = () => {
    addToCart(product);
    showAlert("Success", `${product.name} has been added to your cart!`);
  };

  return (
    <button 
      onClick={handleAdd}
      className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 p-2 rounded-full hover:bg-pink-500 hover:text-white transition-colors duration-300 shadow-sm"
    >
      <MdAddShoppingCart size={20} />
    </button>
  );
}
