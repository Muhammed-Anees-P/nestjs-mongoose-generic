# NestJS Mongoose Generic

A generic, reusable boilerplate for building RESTful APIs using [NestJS](https://nestjs.com/) and [Mongoose](https://mongoosejs.com/). This repository offers a scalable structure for rapid development of CRUD endpoints and robust data modeling with MongoDB. By abstracting common CRUD operations and controller logic, it lets you focus on domain-specific business logic.

## Features

- Generic service and controller scaffolding for CRUD operations.
- Strong TypeScript support with generics for maximum type safety.
- Easy integration and extension for custom business requirements.
- Built-in validation with class-validator.
- Leverages dependency injection, middleware, and lifecycle events of NestJS.
- Clean structure for modularity and scalability.
- Swagger (OpenAPI) integration for interactive API documentation.
- Customizable error handling and response formatting.

## Requirements

- Node.js (v14 or newer recommended)
- npm or yarn
- MongoDB instance (local or remote)
- NestJS CLI (for development conveniences)

## Installation

Follow these steps to get started:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Muhammed-Anees-P/nestjs-mongoose-generic.git
   cd nestjs-mongoose-generic
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   Or using yarn:
   ```bash
   yarn install
   ```

3. **Set up environment variables:**
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` with your MongoDB connection string and other settings.

4. **Run the application:**
   ```bash
   npm run start:dev
   ```
   Or using yarn:
   ```bash
   yarn start:dev
   ```

## Usage

This boilerplate streamlines the creation of new resources (models, controllers, services) by offering a generic service/controller pattern. To add a new resource:

1. **Define a Mongoose Schema and DTO:**
   - Create a schema file in the `schemas` directory.
   - Define a DTO (data transfer object) for validation in the `dto` directory.

2. **Register Model in the Module:**
   - Import the schema into the relevant module.
   - Use `MongooseModule.forFeature([{ name: ModelName, schema: ModelSchema }])`.

3. **Extend the Generic Service and Controller:**
   - Create a new service extending the `GenericService`.
   - Create a controller extending the `GenericController`.

4. **Configure Routes and Providers:**
   - Register the new controller and service in the module’s `controllers` and `providers` arrays.

### Example: Creating a `Book` Resource

1. **Define Schema and DTO:**
   ```ts
   // schemas/book.schema.ts
   import { Schema } from 'mongoose';

   export const BookSchema = new Schema({
     title: String,
     author: String,
     publishedDate: Date,
   });

   // dto/create-book.dto.ts
   import { IsString, IsDate } from 'class-validator';

   export class CreateBookDto {
     @IsString()
     title: string;

     @IsString()
     author: string;

     @IsDate()
     publishedDate: Date;
   }
   ```

2. **Extend Generic Service and Controller:**
   ```ts
   // services/book.service.ts
   import { Injectable } from '@nestjs/common';
   import { InjectModel } from '@nestjs/mongoose';
   import { Model } from 'mongoose';
   import { GenericService } from '../generic/generic.service';
   import { Book } from '../interfaces/book.interface';

   @Injectable()
   export class BookService extends GenericService<Book> {
     constructor(@InjectModel('Book') private readonly bookModel: Model<Book>) {
       super(bookModel);
     }
   }

   // controllers/book.controller.ts
   import { Controller } from '@nestjs/common';
   import { GenericController } from '../generic/generic.controller';
   import { BookService } from '../services/book.service';
   import { Book } from '../interfaces/book.interface';

   @Controller('books')
   export class BookController extends GenericController<Book> {
     constructor(private readonly bookService: BookService) {
       super(bookService);
     }
   }
   ```

### REST API Endpoints

All generic resources expose the following endpoints:

- `GET /[resource]`: List all items.
- `GET /[resource]/:id`: Get a single item.
- `POST /[resource]`: Create a new item.
- `PUT /[resource]/:id`: Update an item.
- `DELETE /[resource]/:id`: Delete an item.

For example, to get all books:

```bash
curl http://localhost:3000/books
```

## Configuration

You can configure the application via the `.env` file:

- `MONGO_URI`: MongoDB connection string.
- `PORT`: Port for the NestJS application.

Additional configuration options can be set through NestJS config modules or environment variables.

## Contributing

Contributions are welcome! Please follow these steps:

- Fork the repository.
- Create a new feature or bugfix branch.
- Write clear, concise commit messages.
- Open a pull request with a description of your changes.

### Development Guidelines

- Use descriptive naming conventions.
- Write unit and integration tests for new features.
- Document new modules, classes, and utilities.
- Ensure all code passes linting and CI checks.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.