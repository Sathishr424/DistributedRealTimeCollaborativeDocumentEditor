-- CreateTable
CREATE TABLE `Documents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `document_id` VARCHAR(191) NOT NULL,
    `is_write_access_public` BOOLEAN NOT NULL DEFAULT false,
    `is_read_access_public` BOOLEAN NOT NULL DEFAULT true,
    `owner` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DocumentAccess` (
    `document_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`document_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DocumentHistory` (
    `document_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `last_opened` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`document_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Documents` ADD CONSTRAINT `Documents_owner_fkey` FOREIGN KEY (`owner`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentAccess` ADD CONSTRAINT `DocumentAccess_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentAccess` ADD CONSTRAINT `DocumentAccess_document_id_fkey` FOREIGN KEY (`document_id`) REFERENCES `Documents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentHistory` ADD CONSTRAINT `DocumentHistory_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentHistory` ADD CONSTRAINT `DocumentHistory_document_id_fkey` FOREIGN KEY (`document_id`) REFERENCES `Documents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
