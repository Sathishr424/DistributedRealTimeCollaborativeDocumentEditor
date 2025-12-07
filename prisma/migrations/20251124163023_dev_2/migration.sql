/*
  Warnings:

  - You are about to drop the column `document_id` on the `documents` table. All the data in the column will be lost.
  - Added the required column `document_key` to the `Documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `documents` DROP COLUMN `document_id`,
    ADD COLUMN `document_key` VARCHAR(191) NOT NULL;
