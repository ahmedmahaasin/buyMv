import React, { useContext, useMemo } from "react";
import { ShopConstext } from "../context/ShopContext";
import Title from "./title";

const CartTotal = ({ methodName }) => {
  const { currency, getCartAmount, delivery_methods } = useContext(ShopConstext);

  const subtotal = getCartAmount();

  const deliveryFee = useMemo(() => {
    if (!methodName || subtotal === 0) return 0;

    // Find the delivery method by name
    const method = delivery_methods.find((m) => m.method_name === methodName);
    if (!method) return 0;

    let fee = Number(method.Delivery_charge) || 0;

    // Apply extra charge for minimum order if applicable
    if (method.apply_extra_charge_minimum && subtotal < (Number(method.minimum_order_amount) || 0)) {
      fee += Number(method.extra_charge_amount_minimum) || 0;
    }

    // Apply extra charge for maximum order if applicable
    if (
      method.apply_extra_charge_maximum &&
      method.maximum_order_limit > 0 &&
      subtotal > Number(method.maximum_order_limit)
    ) {
      fee += Number(method.extra_charge_amount_maximum) || 0;
    }

    return fee;
  }, [subtotal, methodName, delivery_methods]);

  const total = subtotal + deliveryFee;

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1="CART" text2="TOTAL" />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{currency} {subtotal.toFixed(2)}</span>
        </div>

        <hr />

        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>{currency} {deliveryFee.toFixed(2)}</span>
        </div>

        <hr />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{currency} {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
