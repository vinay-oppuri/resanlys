import { createTRPCRouter } from '../init';
import { helloRouter } from './hello';
import { resumeRouter } from './resume';

export const appRouter = createTRPCRouter({
  hello: helloRouter,
  resume: resumeRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;