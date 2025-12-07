import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '../generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`

export function bypassRLS() {
  return Prisma.defineExtension((prisma) => prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, model, operation, query }) {
          const [, result] = await prisma.$transaction([
            prisma.$executeRaw`SELECT set_config('app.bypass_rls', 'on'::text, TRUE)`,
            query(args),
          ])
          return result
        }
      }
    }
  }))
}

export function forTenant(tenantId: number) {
  return Prisma.defineExtension((prisma) => prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, model, operation, query }) {
          const [, result] = await prisma.$transaction([
            prisma.$executeRaw`SELECT set_config('app.current_tenant_id', ${tenantId}::text, TRUE)`,
            query(args),
          ])
          console.log("Current tenant id: ", tenantId)
          return result
        },
      },
    }
  }))
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter,errorFormat: 'pretty' })

export { prisma }