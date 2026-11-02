-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('PENDING', 'PROCESSING', 'RESOLVED');

-- CreateEnum
CREATE TYPE "ResolutionTag" AS ENUM ('AUTO_RESOLVE', 'ESCALATE_TO_SALES');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderId" TEXT,
    "message" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TriageResult" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "triggeredById" TEXT NOT NULL,
    "customerDraft" TEXT NOT NULL,
    "resolutionTag" "ResolutionTag" NOT NULL,
    "reasoning" TEXT,
    "trace" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TriageResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Ticket_status_idx" ON "Ticket"("status");

-- CreateIndex
CREATE INDEX "TriageResult_ticketId_createdAt_idx" ON "TriageResult"("ticketId", "createdAt");

-- AddForeignKey
ALTER TABLE "TriageResult" ADD CONSTRAINT "TriageResult_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TriageResult" ADD CONSTRAINT "TriageResult_triggeredById_fkey" FOREIGN KEY ("triggeredById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
