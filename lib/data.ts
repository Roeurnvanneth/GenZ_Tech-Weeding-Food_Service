import { prisma } from "@/lib/prisma";

export async function getCateringPackages() {
  return await prisma.cateringStandard.findMany({
    include: {
      caterings: {
        include: {
          items: {
            include: {
              menu: {
                include: {
                  pricings: { where: { status: "active" } }
                }
              }
            }
          }
        }
      }
    }
  });
}