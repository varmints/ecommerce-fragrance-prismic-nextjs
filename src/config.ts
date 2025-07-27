import type Stripe from 'stripe';

// src/config.ts

// ============================================================================
// APP CONFIGURATION
// ============================================================================

/**
 * The currency to use for all transactions.
 * @see https://stripe.com/docs/currencies
 */
export const CURRENCY = 'pln';

/**
 * The list of countries to which shipping is allowed.
 * This is a list of ISO 3166-1 alpha-2 country codes.
 * @see https://en.wikipedia.org/wiki/List_of_ISO_3166-1_alpha-2_country_codes
 */
export const ALLOWED_SHIPPING_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] = [
  'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GR',
  'HR', 'HU', 'IE', 'IS', 'IT', 'LI', 'LT', 'LU', 'LV', 'MT', 'NL', 'NO', 'PL',
];

/**
 * The shipping options available for checkout.
 * Each option includes a display name, price, and estimated delivery time.
 */
export const SHIPPING_OPTIONS: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
  {
    shipping_rate_data: {
      display_name: 'Standard Shipping',
      type: 'fixed_amount',
      fixed_amount: { amount: 1500, currency: CURRENCY }, // 15 PLN
      delivery_estimate: {
        minimum: { unit: 'business_day', value: 2 },
        maximum: { unit: 'business_day', value: 5 },
      },
    },
  },
  {
    shipping_rate_data: {
      display_name: 'Express Shipping',
      type: 'fixed_amount',
      fixed_amount: { amount: 3000, currency: CURRENCY }, // 30 PLN
      delivery_estimate: {
        minimum: { unit: 'business_day', value: 1 },
        maximum: { unit: 'business_day', value: 2 },
      },
    },
  },
];
