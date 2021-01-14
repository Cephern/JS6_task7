const path = require("path");
const fs = require("fs");
const Koa = require("koa");
const Router = require("koa-router");
const Static = require("koa-static");
const app = new Koa();
const router = new Router();
const static = new Static(path.resolve(__dirname, "public"));

app
  .use(async (ctx, next) => {
    ctx.set("Content-Type", "text/html; charset=utf-8");
    try {
      await next();
      if (ctx.status === 404) ctx.body = "Пока нет!";
    } catch (e) {
      if (e.status) {
        ctx.body = `Ошибка пользователя: ${e.message}`;
        ctx.status = e.status;
      } else {
        ctx.body = `Ошибка приложения: ${e}`;
        ctx.status = 500;
        console.error(e.message, e.stack);
      }
    }
  })
  .use(router.routes())
  .use(static)
  .listen(process.env.PORT || 5500, () => console.log("http://localhost:5500"));

router.get("/demo", async (ctx, next) => {
  const stream = fs.createReadStream(path.resolve(__dirname, "server.js"));
  ctx.status = 200;
  ctx.response.set("Content-Type", "application/javascript; charset=utf-8");
  ctx.body = stream;
});
