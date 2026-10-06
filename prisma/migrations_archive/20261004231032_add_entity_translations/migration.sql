-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "bioAr" TEXT,
ADD COLUMN     "bioEn" TEXT,
ADD COLUMN     "nameAr" TEXT,
ADD COLUMN     "nameEn" TEXT;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "nameAr" TEXT,
ADD COLUMN     "nameEn" TEXT;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "nameAr" TEXT,
ADD COLUMN     "nameEn" TEXT;
