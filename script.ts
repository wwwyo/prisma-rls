import { forTenant, prisma } from './lib/prisma'

async function main() {
  const tenantPrisma = prisma.$extends(forTenant(2))
  const tenantUsers = await tenantPrisma.user.findMany()
  console.log(tenantUsers)

  const tenantPrisma2 = prisma.$extends(forTenant(3))
  const tenantUsers2 = await tenantPrisma2.user.findMany()
  console.log(tenantUsers2)
}

main()