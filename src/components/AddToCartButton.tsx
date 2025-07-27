"use client";

import { useCart } from "@/context/CartContext";
import { useThrottle } from "@/hooks/useThrottle";
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

  const [handleAddToCart, isThrottled] = useThrottle(() => {
    // Zawsze przekazujemy string (URL) do koszyka
    const itemToAdd = { uid, name, price, image };
    addToCart(itemToAdd);
  }, 300); // Ignoruj kliknięcia przez 300ms po pierwszym

  return (
    <button
      onClick={handleAddToCart}
      disabled={isThrottled}
      className={clsx(
        "w-full cursor-pointer bg-white py-3 font-extrabold text-black uppercase transition-all duration-150 hover:bg-neutral-200 disabled:cursor-wait disabled:bg-neutral-400",
        isThrottled ? "scale-95" : "scale-100",
        className,
      )}
    >
      {label || "Add to Bag"}
    </button>
  );
};
