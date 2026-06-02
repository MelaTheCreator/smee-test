import express from "express";
import type { Request, Response, NextFunction } from "express";
import { Webhooks, createNodeMiddleware } from "@octokit/webhooks";

const secret = process.env.WEBHOOK_SECRET || null;
if (!secret) {
  console.error("secret is not defined.");
  process.exit(1);
}
const webhooks = new Webhooks({ secret });

// webhooks.on("push", async ({ id, name, payload }) => {
//   console.log(
//     `id: ${id}, name: ${name}, ref: ${payload.ref}, head: ${payload.head_commit.id}`
//   );
// });
//hallo
webhooks.onAny(async ({ name }) => {
  console.log(` name: ${name}, Event erhalten.`);
});

const app = express();
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});
const middleware = createNodeMiddleware(webhooks, {
  path: "/api/github/webhooks",
});
app.use(middleware);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
