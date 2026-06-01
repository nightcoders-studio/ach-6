/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "midtrans-client" {
  export class Snap {
    constructor(options: { isProduction: boolean; serverKey: string; clientKey: string });
    createTransaction(parameters: unknown): Promise<unknown>;
  }

  export class CoreApi {
    constructor(options: { isProduction: boolean; serverKey: string; clientKey: string });
    charge(parameters: unknown): Promise<unknown>;
    capture(parameters: unknown): Promise<unknown>;
    transaction: {
      status(orderId: string): Promise<unknown>;
      cancel(orderId: string): Promise<unknown>;
      expire(orderId: string): Promise<unknown>;
      refund(orderId: string, parameters: unknown): Promise<unknown>;
    };
  }
}
