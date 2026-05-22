import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Backend API - User Authentication",
      version: "1.0.0",
      description: "API documentation for user authentication and profile management",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Firebase ID Token",
        },
      },

      schemas: {
        User: {
          type: "object",
          properties: {
            uid: {
              type: "string",
              description: "Firebase UID",
            },
            names: {
              type: "string",
              description: "User first names",
            },
            lastNames: {
              type: "string",
              description: "User last names",
            },
            username: {
              type: "string",
              description: "Unique username",
            },
            email: {
              type: "string",
              description: "User email",
            },
            avatar: {
              type: "string",
              description: "Avatar URL",
            },
            provider: {
              type: "string",
              enum: ["manual", "google"],
              description: "Authentication provider",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation date",
            },
          },
        },

        RegisterRequest: {
          type: "object",
          required: ["names", "lastNames", "username", "avatar", "email", "password"],
          properties: {
            names: {
              type: "string",
              example: "Camilo",
            },
            lastNames: {
              type: "string",
              example: "Cordoba",
            },
            username: {
              type: "string",
              example: "camilo123",
            },
            avatar: {
              type: "string",
              example: "https://example.com/avatar.jpg",
            },
            email: {
              type: "string",
              example: "camilo@unicauca.edu.co",
            },
            password: {
              type: "string",
              example: "password123",
            },
          },
        },

        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              example: "camilo@unicauca.edu.co",
            },
            password: {
              type: "string",
              example: "password123",
            },
          },
        },
      },
    },

    tags: [
      {
        name: "Auth",
        description: "Authentication endpoints",
      },
      {
        name: "Users",
        description: "User profile endpoints",
      },
    ],
  },

  apis: ["./src/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
