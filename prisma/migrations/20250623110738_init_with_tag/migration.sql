-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "credit" DOUBLE PRECISION NOT NULL,
    "debit" DOUBLE PRECISION NOT NULL,
    "balance" DOUBLE PRECISION,
    "memo" TEXT,
    "tag" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
