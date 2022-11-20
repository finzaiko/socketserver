const Fastify = require("fastify");
const qs = require("qs");
const path = require("path");
const appGateway = require("./src/gateway/app.gateway");

const NODE_ENV = "development";
const JWT_SECRET = "raHa$1a";
// const COOKIE_SECRET = "KueraHa$1a";

const logger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        ignore: 'pid,hostname',
      }
    }
  },
  production: {
    formatters: {
      level(level) {
        return { level };
      },
    },
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
  },
};

const app = async () => {
  const fastify = Fastify({
    bodyLimit: 1048576 * 2,
    logger: logger[NODE_ENV],
    querystringParser: (str) => qs.parse(str),
  });

  //   await fastify.register(require('./plugins/db'))

  await fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "public"),
  });

  await fastify.register(require("@fastify/jwt"), {
    secret: JWT_SECRET,
    messages: {
      badRequestErrorMessage: "Format is Authorization: Bearer [token]",
      noAuthorizationInHeaderMessage: "You are unauthorized to access this resource",
      authorizationTokenExpiredMessage: "Authorization token expired",
      authorizationTokenInvalid: (err) => {
        return `Authorization token is invalid: ${err.message}`;
      },
    },
  });

  await fastify.register(require('fastify-socket.io'), {
    // put your options here
  })


  /*
  await fastify.register(require('fastify-cookie'), {
    secret: COOKIE_SECRET
  })
  */

  // app.ready(err => {
  //   if (err) throw err

  //   app.io.on('connect', (socket) => console.info('Socket connected!', socket.id))
  // })

  // await fastify.io.on("connection", function (socket) {
  // //  console.log(">>>>>>>> Create socket connection");
  //     socket.on('chat-message', (msg) => {
  //       console.log(`msg>>>>>>>>>>>>>`, msg);
  //       socket.broadcast.emit('chat-message', msg)
  //   })

  //   socket.on('joined', (name) => {
  //       socket.broadcast.emit('joined', name)
  //   })

  //   socket.on('leaved', (name) => {
  //       socket.broadcast.emit('leaved', name)
  //   })

  //   socket.on('typing', (data) => {
  //       socket.broadcast.emit('typing', data)
  //   })
  //   socket.on('stoptyping', () => {
  //       socket.broadcast.emit('stoptyping')
  //   })
  // });

  appGateway.init(fastify.io);


 fastify.get("/", async (request, reply) => {
   // return {
     //   message: "Server running..",
     // };
    //  fastify.io.on("connection", function (socket) {
    //    fastify.io.emit('hello',{msg: "hi from server"})
    //    console.log(">>>>>>>> Made socket connection");
    //  });
    return reply.sendFile('index.html')
  });

  await fastify.register(require("@fastify/cors"), { origin: "*" });
  await fastify.register(require("./src/routes/api"), { prefix: "api/v1" });
  // await fastify.register(require("./src/hooks"));

  return fastify;
};

module.exports = {
  app,
};
