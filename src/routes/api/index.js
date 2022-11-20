const apiRoutes = async (app, options) => {
  app.get("/", async (request, reply) => {
    return {
      message: "API/v1 scope running..",
    };
  });
};

module.exports = apiRoutes;

