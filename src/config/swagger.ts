import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Brand, Branch, Amenity, Company & User API',
      version: '1.0.0',
      description: 'A RESTful API with CRUD operations for Brands, Branches, Amenities, Companies, and Users with JWT Authentication',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        Brand: {
          type: 'object',
          required: ['name', 'email', 'branchId'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the brand',
            },
            name: {
              type: 'string',
              description: 'Brand name',
              example: 'Apple',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Brand email address',
              example: 'contact@apple.com',
            },
            phone: {
              type: 'string',
              nullable: true,
              description: 'Brand phone number',
              example: '+1-234-567-8900',
            },
            address: {
              type: 'string',
              nullable: true,
              description: 'Brand address',
              example: '123 Business Street, Suite 100',
            },
            branchId: {
              type: 'string',
              format: 'uuid',
              description: 'ID of the branch this brand belongs to',
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the brand is active',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Branch: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the branch',
            },
            name: {
              type: 'string',
              description: 'Branch name',
              example: 'Downtown Branch',
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Branch description',
              example: 'Main branch located in downtown area',
            },
            address: {
              type: 'string',
              nullable: true,
              description: 'Branch address',
              example: '123 Main Street',
            },
            phone: {
              type: 'string',
              nullable: true,
              description: 'Branch phone number',
              example: '+1-234-567-8900',
            },
            email: {
              type: 'string',
              nullable: true,
              description: 'Branch email address',
              example: 'downtown@example.com',
            },
            city: {
              type: 'string',
              nullable: true,
              description: 'Branch city',
              example: 'New York',
            },
            state: {
              type: 'string',
              nullable: true,
              description: 'Branch state',
              example: 'NY',
            },
            zipCode: {
              type: 'string',
              nullable: true,
              description: 'Branch zip code',
              example: '10001',
            },
            country: {
              type: 'string',
              nullable: true,
              description: 'Branch country',
              example: 'USA',
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the branch is active',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Amenity: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the amenity',
            },
            name: {
              type: 'string',
              description: 'Amenity name',
              example: 'Wi-Fi',
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Amenity description',
              example: 'Free high-speed internet access',
            },
            icon: {
              type: 'string',
              nullable: true,
              description: 'Icon URL or icon identifier',
              example: 'wifi-icon.svg',
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the amenity is active',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        PaginationInfo: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
              description: 'Total number of items',
              example: 100,
            },
            page: {
              type: 'number',
              description: 'Current page number',
              example: 1,
            },
            limit: {
              type: 'number',
              description: 'Number of items per page',
              example: 10,
            },
            totalPages: {
              type: 'number',
              description: 'Total number of pages',
              example: 10,
            },
          },
        },
        Company: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the company',
            },
            name: {
              type: 'string',
              description: 'Company name',
              example: 'Acme Corporation',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Company email address',
              example: 'contact@acme.com',
            },
            phone: {
              type: 'string',
              nullable: true,
              description: 'Company phone number',
              example: '+1-234-567-8900',
            },
            address: {
              type: 'string',
              nullable: true,
              description: 'Company address',
              example: '123 Business Street, Suite 100',
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the company is active',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        User: {
          type: 'object',
          required: ['email', 'name', 'password'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the user',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            name: {
              type: 'string',
              description: 'User name',
            },
            role: {
              type: 'string',
              enum: ['admin', 'user', 'manager'],
              description: 'User role',
            },
            companyId: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Associated company ID',
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the user is active',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        RoomType: {
          type: 'object',
          required: ['name', 'branchId'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the room type',
            },
            name: {
              type: 'string',
              description: 'Room type name',
              example: 'Single Room',
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Room type description',
              example: 'A single occupancy room',
            },
            branchId: {
              type: 'string',
              format: 'uuid',
              description: 'ID of the branch this room type belongs to',
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the room type is active',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Brands',
        description: 'Brand management endpoints',
      },
      {
        name: 'Branches',
        description: 'Branch management endpoints',
      },
      {
        name: 'Amenities',
        description: 'Amenity management endpoints with pagination and search',
      },
      {
        name: 'Companies',
        description: 'Company management endpoints',
      },
      {
        name: 'Room Types',
        description: 'Room type management endpoints with pagination and search',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);
