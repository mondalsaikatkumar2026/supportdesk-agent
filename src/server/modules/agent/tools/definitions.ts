import { Type, type FunctionDeclaration } from "@google/genai";

export const toolDeclarations: FunctionDeclaration[] = [
  {
    name: "get_order_status",
    description:
      "Look up the shipping status and estimated delivery of a customer order. " +
      "Use only when the ticket mentions or references an order ID.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        order_id: {
          type: Type.STRING,
          description: "The order ID, for example ORD-9012",
        },
      },
      required: ["order_id"],
    },
  },
  {
    name: "get_user_tier",
    description:
      "Look up a customer's current subscription tier and whether they can upgrade. " +
      "Use when the ticket is about plans, tiers, upgrades or account level.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        user_id: {
          type: Type.STRING,
          description: "The customer's user ID, for example USR-204",
        },
      },
      required: ["user_id"],
    },
  },
];