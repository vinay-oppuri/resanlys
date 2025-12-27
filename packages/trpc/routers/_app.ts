import { createTRPCRouter } from '../init';
import { helloRouter } from './hello';
import { resumeRouter } from './resume';
import { jobsRouter } from './jobs';

export const appRouter = createTRPCRouter({
  hello: helloRouter,
  resume: resumeRouter,
  jobs: jobsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;