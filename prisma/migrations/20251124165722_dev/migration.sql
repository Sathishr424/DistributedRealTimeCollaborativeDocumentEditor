-- AlterTable
ALTER TABLE `documenthistory` ADD COLUMN `read_access` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `write_access` BOOLEAN NOT NULL DEFAULT true;
