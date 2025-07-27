"use client";

import { useCart } from "@/context/CartContext";
import clsx from "clsx";

type AddToCartButtonProps = {
  uid: string;
  name: string;
  price: number;
  image: string;
  label: string | null;
  className?: string;
};

export const AddToCartButton = ({
  uid,
  name,
  price,
  image,
  label,
  className,
}: AddToCartButtonProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Zawsze przekazujemy string (URL) do koszyka
    const itemToAdd = { uid, name, price, image };
    addToCart(itemToAdd);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={clsx(
        "w-full cursor-pointer bg-white py-3 font-extrabold text-black uppercase transition duration-200 hover:bg-neutral-200",
        className,
      )}
    >
      {label || "Add to Bag"}
    </button>
  );
};
