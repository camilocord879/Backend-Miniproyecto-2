import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Backend API",
      version: "1.0.0",
      description: "Documentación API del Backend",
    },

    servers: [
      {
        url: "http://localhost:3000",
      },
    ],

    components: {

      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        User: {
          type: "object",

          properties: {
            firestoreId: {
              type: "string",
            },

            name: {
              type: "string",
            },

            email: {
              type: "string",
            },

            username: {
              type: "string",
            },
          },
        },
      },
    },
  },

  apis: ["./src/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);