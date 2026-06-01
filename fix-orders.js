const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixOrderIds() {
  const payments = await prisma.payment.findMany();
  for (const p of payments) {
    if (p.order_id && p.order_id.length > 50) {
      const newOrderId = p.order_id.slice(0, 50);
      await prisma.payment.update({
        where: { id: p.id },
        data: { order_id: newOrderId }
      });
      console.log('Fixed order ID:', newOrderId);
    }
  }
}
fixOrderIds()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
