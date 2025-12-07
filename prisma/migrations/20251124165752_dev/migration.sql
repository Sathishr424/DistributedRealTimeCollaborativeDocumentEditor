/*
  Warnings:

  - You are about to drop the column `read_access` on the `documenthistory` table. All the data in the column will be lost.
  - You are about to drop the column `write_access` on the `documenthistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `documentaccess` ADD COLUMN `read_access` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `write_access` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `documenthistory` DROP COLUMN `read_access`,
    DROP COLUMN `write_access`;
