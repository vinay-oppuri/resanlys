import { createTRPCRouter } from '../init';
import { helloRouter } from './hello';
import { resumeRouter } from './resume';
import { jobsRouter } from './jobs';
import { jobSearchRouter } from './job-search';

export const appRouter = createTRPCRouter({
  hello: helloRouter,
  resume: resumeRouter,
  jobs: jobsRouter,
  jobSearch: jobSearchRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;