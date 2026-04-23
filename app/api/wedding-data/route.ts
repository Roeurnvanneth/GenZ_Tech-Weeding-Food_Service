import { prisma } from "@/lib/prisma";

export async function GET() {
  const [eventTypes, caterings, standards, menus, categories] = await Promise.all([
    prisma.eventType.findMany(),
    prisma.catering.findMany(),
    prisma.cateringStandard.findMany(),
    prisma.menu.findMany(),
    prisma.category.findMany()
  ]);
  return Response.json({ eventTypes, caterings, standards, menus, categories });
}