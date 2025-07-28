"use client";

import { useState } from "react";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";

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
  const [isPressed, setIsPressed] = useState(false);
  const handleAddToCart = () => {
    if (isPressed) return;
    setIsPressed(true);
    const itemToAdd = { uid, name, price, image };
    addToCart(itemToAdd);
    setTimeout(() => setIsPressed(false), 200); // animacja trwa 200ms
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isPressed}
      className={clsx(
        "w-full cursor-pointer bg-white py-3 font-extrabold text-black uppercase transition-all duration-200 hover:bg-neutral-200 disabled:cursor-wait disabled:bg-neutral-400",
        isPressed ? "scale-97" : "scale-100",
        className,
      )}
    >
      {label || "Add to Bag"}
    </button>
  );
};
