const { app: server } = require("./server");
const env = process.env;
const dotenv = require("dotenv");

dotenv.config();

server()
  .then((app) => {

    env;
    app.listen(
      { port: env.SERVER_PORT || 3000, host: "0.0.0.0" },
      (err, address) => {
        if (err) {
          fastify.log.error("Error starting server: ", err);
          process.exit(1);
        }
      }
    );
  })
  .catch((err) => console.log(err));
