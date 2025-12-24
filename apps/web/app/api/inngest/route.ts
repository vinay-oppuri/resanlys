import { serve } from "inngest/next";
import { inngest } from "@workspace/inngest/client";
import { functions } from "@workspace/inngest/functions";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions,
});
