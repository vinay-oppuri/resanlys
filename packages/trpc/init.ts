import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import { db } from '@workspace/db';

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return {
    userId: 'user_123',
    db,
  };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.


export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

import { auth } from '@workspace/auth';
import { headers } from 'next/headers';

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" })
  }

  return next({ ctx: { ...ctx, auth: session } })
})