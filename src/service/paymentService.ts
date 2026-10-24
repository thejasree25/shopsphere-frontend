
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
).replace(/\/+$/, "");

const API_URL = `${API_BASE_URL}/api`;

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface CustomerDetails {
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
}

export interface ShopOrderResponse {
  id?: number;
  orderId?: number;
  customerName?: string;
  email?: string;
  subtotal?: number;
  shippingFee?: number;
  totalAmount?: number;
  status?: string;
}

export interface DemoPaymentResponse {
  paymentId: number;
  orderReferenceId: number;
  amount: number;
  currency: string;
  status: string;
  message: string;
}

async function readResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  let data: unknown;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `Invalid server response (${response.status}).`
    );
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : `Request failed (${response.status}).`;

    throw new Error(message);
  }

  return data as T;
}

export async function createShopOrder(
  items: OrderItemRequest[],
  customer: CustomerDetails
): Promise<number> {
  if (!items || items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  for (const item of items) {
    if (
      !Number.isInteger(item.productId) ||
      item.productId <= 0 ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      throw new Error("Invalid product ID or quantity.");
    }
  }

  if (
    !customer.customerName.trim() ||
    !customer.email.trim() ||
    !customer.phone.trim() ||
    !customer.shippingAddress.trim()
  ) {
    throw new Error("Please fill in all delivery details.");
  }

  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items,
      customerName: customer.customerName.trim(),
      email: customer.email.trim(),
      phone: customer.phone.trim(),
      shippingAddress: customer.shippingAddress.trim(),
    }),
  });

  const order = await readResponse<ShopOrderResponse>(response);
  const orderId = order.id ?? order.orderId;

  if (
    typeof orderId !== "number" ||
    !Number.isInteger(orderId) ||
    orderId <= 0
  ) {
    throw new Error("The server did not return a valid order ID.");
  }

  return orderId;
}

export async function makeDemoPayment(
  orderReferenceId: number
): Promise<DemoPaymentResponse> {
  if (
    !Number.isInteger(orderReferenceId) ||
    orderReferenceId <= 0
  ) {
    throw new Error("Invalid order ID.");
  }

  const response = await fetch(`${API_URL}/payments/demo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderReferenceId,
    }),
  });

  const payment =
    await readResponse<DemoPaymentResponse>(response);

  if (payment.status !== "SUCCESS") {
    throw new Error(payment.message || "Demo payment failed.");
  }

  return payment;
}
