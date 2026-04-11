# Brand API - Node.js with PostgreSQL

A modern RESTful API built with Node.js, Express, TypeScript, and PostgreSQL using TypeORM. This project includes complete CRUD operations for managing brands with Swagger/OpenAPI documentation.

## Features

- ✅ RESTful API with Express.js
- ✅ PostgreSQL database with TypeORM
- ✅ TypeScript support
- ✅ Swagger/OpenAPI documentation
- ✅ CRUD operations for brands
- ✅ Search functionality
- ✅ Error handling
- ✅ CORS enabled
- ✅ Environment configuration
- ✅ Postman collection included

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Database configuration
│   │   └── swagger.ts            # Swagger documentation setup
│   ├── controllers/
│   │   └── brandController.ts    # Brand business logic
│   ├── entities/
│   │   └── Brand.ts              # Brand entity/model
│   ├── routes/
│   │   └── brandRoutes.ts        # Brand API routes
│   └── index.ts                  # Application entry point
├── .env                          # Environment variables
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Project dependencies
└── Brand_API_Collection.postman_collection.json  # Postman collection
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (v10 or higher)

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   Edit the `.env` file with your PostgreSQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=hello_db
   NODE_ENV=development
   PORT=3000
   ```

3. **Create Database**
   
   Create a PostgreSQL database:
   ```bash
   createdb hello_db
   ```

## Running the Application

### Development Mode (with hot reload)
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Production Mode
```bash
npm start
```

The server will be available at `http://localhost:3000`

## API Endpoints

### Hello API
- **GET** `/api/hello` - Welcome endpoint

### Health Check
- **GET** `/api/health` - Server health status

### Brands Endpoints
- **GET** `/api/brands` - Get all brands
- **POST** `/api/brands` - Create a new brand
- **GET** `/api/brands/:id` - Get brand by ID
- **PUT** `/api/brands/:id` - Update a brand
- **DELETE** `/api/brands/:id` - Delete a brand
- **GET** `/api/brands/search?query=xyz` - Search brands

## Swagger Documentation

Access the interactive API documentation at:
```
http://localhost:3000/api-docs
```

## API Request Examples

### Create a Brand
```bash
curl -X POST http://localhost:3000/api/brands \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apple",
    "description": "A technology company",
    "logo": "https://example.com/logo.png",
    "website": "https://www.apple.com"
  }'
```

### Get All Brands
```bash
curl http://localhost:3000/api/brands
```

### Get Brand by ID
```bash
curl http://localhost:3000/api/brands/{id}
```

### Update a Brand
```bash
curl -X PUT http://localhost:3000/api/brands/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apple Inc.",
    "isActive": true
  }'
```

### Delete a Brand
```bash
curl -X DELETE http://localhost:3000/api/brands/{id}
```

### Search Brands
```bash
curl "http://localhost:3000/api/brands/search?query=Apple"
```

## Postman Collection

A Postman collection file (`Brand_API_Collection.postman_collection.json`) is included for easy API testing:

1. Open Postman
2. Click `Import`
3. Select `Brand_API_Collection.postman_collection.json`
4. Replace `{{brand_id}}` with actual brand IDs
5. Start testing the endpoints

## Brand Entity Schema

```typescript
{
  id: string (UUID);               // Unique identifier
  name: string;                     // Brand name (required, unique)
  description?: string;             // Brand description
  logo?: string;                    // Logo URL
  website?: string;                 // Website URL
  isActive: boolean;               // Active status (default: true)
  createdAt: Date;                 // Creation timestamp
  updatedAt: Date;                 // Last update timestamp
}
```

## Response Format

All endpoints return a consistent JSON response format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "total": 0
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_USERNAME` | PostgreSQL username | postgres |
| `DB_PASSWORD` | PostgreSQL password | password |
| `DB_NAME` | Database name | hello_db |
| `NODE_ENV` | Environment | development |
| `PORT` | API port | 3000 |

## Error Handling

The API includes comprehensive error handling:
- Validation errors (400)
- Not found errors (404)
- Server errors (500)
- All errors include descriptive messages

## Development Tips

1. **TypeScript Compilation**: Auto-compiled in dev mode
2. **Database Synchronization**: Automatic schema sync in development
3. **CORS**: Enabled for all origins by default
4. **Logging**: Console logs for database and server events

## Technologies Used

- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **TypeORM** - ORM for database operations
- **PostgreSQL** - Relational database
- **Swagger/OpenAPI** - API documentation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

## License

MIT

## Support

For issues or questions, please contact support@example.com
