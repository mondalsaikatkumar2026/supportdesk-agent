import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const tickets = [
  {
    id: "TCK-001",
    customerId: "USR-101",
    orderId: "ORD-9012",
    message: "Where is my package #ORD-9012? It was supposed to arrive yesterday.",
  },
  {
    id: "TCK-002",
    customerId: "USR-204",
    orderId: null,
    message: "Can you upgrade my account to Enterprise tier?",
  },
  {
    id: "TCK-003",
    customerId: "USR-309",
    orderId: null,
    message: "How do I update my profile picture?",
  },
];

async function main() {
  for (const ticket of tickets) {
    await prisma.ticket.upsert({
      where: { id: ticket.id },
      update: {},
      create: ticket,
    });
  }
  console.log(`Seeded ${tickets.length} tickets`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());