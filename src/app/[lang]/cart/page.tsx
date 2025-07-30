"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatters";
import { HiOutlineTrash } from "react-icons/hi2";
import clsx from "clsx";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Bounded } from "@/components/Bounded";

import { useState, useEffect } from "react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } =
    useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const lang = params.lang as string;

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, lang }),
      });
      const { url, error } = await response.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Local state for quantities, derived from the cart context
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  // Update local state when cart changes (e.g. item removed)
  useEffect(() => {
    const newQuantities: Record<string, string> = {};
    cart.forEach((item) => {
      newQuantities[item.id] = String(item.quantity);
    });
    setQuantities(newQuantities);
  }, [cart]);

  // Handler for input change
  const handleQuantityChange = (id: string, value: string) => {
    // Only allow numbers and empty string
    if (/^\d*$/.test(value)) {
      setQuantities((prev) => ({ ...prev, [id]: value }));
      const parsed = parseInt(value, 10);
      // Let context handle clamping. If input is empty/invalid, default to 1.
      updateQuantity(id, Number.isNaN(parsed) ? 1 : parsed);
    }
  };

  return (
    <Bounded className="grid min-h-[70vh] place-items-center py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display mb-6 text-3xl">Your Bag ({totalItems})</h1>
        <div className="flex-1 overflow-y-auto p-0">
          {cart.length === 0 ? (
            <p className="text-center text-neutral-400">Your bag is empty.</p>
          ) : (
            <ul className="divide-y divide-neutral-800">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="grid grid-cols-1 gap-4 py-4 md:flex md:gap-0"
                >
                  <div className="relative flex h-40 w-full flex-shrink-0 justify-center overflow-hidden border border-neutral-700 p-1 md:w-40">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={160}
                      height={160}
                      className="w-auto"
                    />
                  </div>
                  <div className="flex flex-1 justify-between p-2 md:flex-col md:p-4">
                    <div>
                      <h3 className="text-lg font-bold md:text-base">
                        {item.name}
                      </h3>
                      <p className="text-sm text-neutral-400">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={`minus ${item.name}`}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className={clsx(
                            "cursor-pointer border border-neutral-700 px-2.5 py-1 text-lg text-white hover:bg-neutral-700",
                            item.quantity <= 1 && "opacity-0",
                          )}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          min="1"
                          max="99"
                          value={quantities[item.id] ?? ""}
                          onChange={(e) =>
                            handleQuantityChange(item.id, e.target.value)
                          }
                          aria-label={`Ilość dla ${item.name}`}
                          className="w-16 border border-neutral-700 p-1 text-center text-lg font-bold"
                        />
                        <button
                          type="button"
                          aria-label={`plus ${item.name}`}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className={clsx(
                            "cursor-pointer border border-neutral-700 px-2.5 py-1 text-lg text-white hover:bg-neutral-700",
                            item.quantity >= 99 && "opacity-0",
                          )}
                          disabled={item.quantity >= 99}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="cursor-pointer p-2 text-neutral-600 hover:text-red-500 md:p-4"
                    >
                      <HiOutlineTrash className="h-6 w-6 md:h-5 md:w-5" />
                    </button>
                    <p className="text-xl font-bold md:ml-4">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-6 border-t border-neutral-700 pt-6">
          <div className="flex justify-between font-bold">
            <span className="text-lg">Subtotal</span>
            <span className="text-2xl">{formatPrice(totalPrice)}</span>
          </div>
          <p className="mt-1 text-sm text-neutral-400">
            Shipping and taxes calculated at checkout.
          </p>
          {error && <p className="mt-4 text-center text-red-500">{error}</p>}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isLoading}
            className={clsx(
              "mt-6 inline-flex w-full cursor-pointer items-center justify-center px-12 py-4 text-center font-extrabold tracking-wider uppercase transition-colors duration-300",
              "bg-white text-black hover:bg-white/80",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {isLoading ? "Processing..." : "Checkout with Stripe"}
          </button>
        </div>
      </div>
    </Bounded>
  );
}
