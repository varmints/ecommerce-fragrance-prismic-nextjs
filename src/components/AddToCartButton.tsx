"use client";

import { useState } from "react";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";
import { HiPlus } from "react-icons/hi";

type AddToCartButtonProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  label: string | null;
  className?: string;
  variant?: "default" | "short";
};

export const AddToCartButton = ({
  id,
  name,
  price,
  image,
  label,
  className,
  variant = "default",
}: AddToCartButtonProps) => {
  const { addToCart } = useCart();
  const [isPressed, setIsPressed] = useState(false);

  const handleAddToCart = () => {
    if (isPressed) return;
    setIsPressed(true);
    const itemToAdd = { id, name, price, image };
    addToCart(itemToAdd);
    setTimeout(() => setIsPressed(false), 200);
  };

  const isShort = variant === "short";

  return (
    <button
      onClick={handleAddToCart}
      disabled={isPressed}
      className={clsx(
        "cursor-pointer bg-white font-extrabold text-black uppercase transition-all duration-200 hover:bg-white/80 disabled:cursor-wait",
        isShort
          ? "inline-flex items-center justify-center px-12 py-4 text-center tracking-wider"
          : "w-full py-3",
        isPressed ? "scale-97" : "scale-100",
        className,
      )}
    >
      {isShort && <HiPlus className="mr-2" />}
      <span>{label || "Add to Bag"}</span>
    </button>
  );
};
