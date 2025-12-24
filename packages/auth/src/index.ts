import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { account, db, jobs, matches, resumes, session, user, verification } from "@workspace/db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user,
            session,
            account,
            verification,
            resumes,
            jobs,
            matches,
        }
    }),
    emailAndPassword: {
        enabled: true
    },
});
