export const successResponse = (res, code, customer) => res.status(code).json({
  customer: {
    customer_id: customer.customerId,
    name: customer.name,
    email: customer.email,
    address_1: customer.address1,
    address_2: customer.address2,
    city: customer.city,
    region: customer.region,
    postal_code: customer.postalCode,
    country: customer.country,
    shipping_region_id: customer.shippingRegionId,
    credit_card: customer.creditCard,
    day_phone: customer.dayPhone,
    eve_phone: customer.evePhone,
    mob_phone: customer.mobPhone,
  }
});

export const successResponseWithToken = (res, code, customer, token) => res.status(code).json({
  customer: {
    customer_id: customer.customerId,
    name: customer.name,
    email: customer.email,
    address_1: customer.address1,
    address_2: customer.address2,
    city: customer.city,
    region: customer.region,
    postal_code: customer.postalCode,
    country: customer.country,
    shipping_region_id: customer.shippingRegionId,
    credit_card: customer.creditCard,
    day_phone: customer.dayPhone,
    eve_phone: customer.evePhone,
    mob_phone: customer.mobPhone,
  },
  accessToken: `Bearer ${token}`,
  expires_in: '24h'
});

export const errorResponse = (res, statusCode, errorCode, errorMessage, field) => res.status(statusCode).json({
  error: {
    status: statusCode,
    code: errorCode,
    message: errorMessage,
    field
  }
});
