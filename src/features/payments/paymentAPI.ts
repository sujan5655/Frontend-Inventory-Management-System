import axiosInstance from "../../services/axios";

export interface EsewaPaymentData {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

export const initiateEsewaPaymentRequest = async (
  orderId: number,
): Promise<EsewaPaymentData> => {
  const response = await axiosInstance.post("/payments/esewa/initiate/", {
    order_id: orderId,
  });

  return response.data;
};
