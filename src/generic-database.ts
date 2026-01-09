import { BadRequestException, NotFoundException } from '@nestjs/common';
import { HydratedDocument, Model, PopulateOptions } from 'mongoose';
import { normalizePopulate } from './generic-helper';

export class GenericDatabase<T extends Model<HydratedDocument<any>>> {
  constructor(private readonly dbModel: T) {}

  /** * Finds a document by its username.
   *
   * This function queries the database for a document matching the provided username.
   *
   * @param {string} username - The username of the document to find.
   * @returns {Promise<HydratedDocument<any> | null>} - A Promise that resolves to the document if found, or null otherwise.
   * @throws {NotFoundException} - Thrown if an error occurs during the search.
   */
  async genericFindByUsername(
    username: string,
    populateFields?: string[],
  ): Promise<HydratedDocument<any> | null> {
    try {
      let query = this.dbModel.findOne({ username, isDeleted: false });

      if (populateFields && populateFields.length > 0) {
        query = query.populate(populateFields);
      }

      const response = await query.exec();

      if (!response) {
        throw new NotFoundException(
          `Document with username ${username} not found`,
        );
      }

      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error finding document by username:', error);
        throw new NotFoundException(
          `Error finding document by username: ${error.message}`,
        );
      }

      console.error('Unknown error finding document by username:', error);
      throw error;
    }
  }

  /** * Generic method to find all documents.
   * * This function retrieves all documents from the database.
   *
   * @returns {Promise<HydratedDocument<any>[]>} - A Promise that resolves to an array of all documents.
   * @throws {NotFoundException} - Thrown if an error occurs during the retrieval.
   */
  async genericFindAll(): Promise<HydratedDocument<any>[]> {
    try {
      const response: HydratedDocument<any>[] = await this.dbModel
        .find({ isDeleted: false })
        .exec();
      if (!response) {
        throw new NotFoundException(
          `No ${this.dbModel.modelName} documents found`,
        );
      }
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Error finding all documents:', error);
        throw new NotFoundException(
          `Error finding all documents: ${error.message}`,
        );
      }
      console.log('Unknown error finding all documents:', error);
      throw error;
    }
  }

  /**
   * Finds a single document by its ID where `isDeleted` is false.
   *
   * @param {string} id - The unique identifier of the document to find.
   * @returns {Promise<HydratedDocument<any> | null>} The found document, or throws an error if not found.
   * @throws {Error} When the document is not found or a database error occurs.
   */
  async genericFindOneByIdOrNotFound(
    id: string,
    populateFields?: string[],
  ): Promise<HydratedDocument<any> | null> {
    try {
      let query = this.dbModel.findOne({ _id: id, isDeleted: false });

      if (populateFields && populateFields.length > 0) {
        query = query.populate(populateFields);
      }

      const response: HydratedDocument<any> | null = await query.exec();

      if (!response) {
        throw new NotFoundException(
          `${this.dbModel.modelName} Document with id ${id} not found`,
        );
      }

      return response;
    } catch (error: unknown) {
      console.error('Error finding document:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new Error(`Error finding document: ${error.message}`);
      }
      console.log('Unknown error finding document by id:', error);
      throw error;
    }
  }

  /** * Generic method to create a new document.
   *
   * This function creates a new document in the database using the provided DTO.
   *
   * @param {any} createDto - The data transfer object containing the data for the new document.
   * @returns {Promise<HydratedDocument<any>>} - A Promise that resolves to the created document.
   * @throws {BadRequestException} - Thrown if an error occurs during creation.
   */
  async genericCreateOne(createDto: any): Promise<HydratedDocument<any>> {
    try {
      const createdDocument = new this.dbModel(createDto);
      const response = await createdDocument.save();
      if (!response) {
        throw new BadRequestException(
          `Failed to create ${this.dbModel.modelName} document`,
        );
      }
      return response;
    } catch (error: unknown) {
      console.error('Error creating document:', error);
      if (error instanceof Error) {
        throw new BadRequestException(
          `Error creating document: ${error.message}`,
        );
      }
      console.log('Unknown error creating document:', error);
      throw error;
    }
  }

  /** * Generic method to update a document by its ID.
   *
   * This function updates an existing document in the database using the provided update DTO.
   *
   * @param {string} id - The unique identifier of the document to update.
   * @param {any} updateDto - The data transfer object containing the updated data for the document.
   * @returns {Promise<HydratedDocument<any> | null>} - A Promise that resolves to the updated document, or null if not found.
   * @throws {NotFoundException} - Thrown if the document with the specified ID is not found.
   * @throws {BadRequestException} - Thrown if an error occurs during the update.
   */
  async genericUpdateOne(
    id: string,
    updateDto: any,
  ): Promise<HydratedDocument<any> | null> {
    try {
      const updatedDocument = await this.dbModel
        .findOneAndUpdate({ _id: id, isDeleted: false }, updateDto, {
          new: true,
        })
        .exec();

      if (!updatedDocument) {
        throw new NotFoundException(
          `${this.dbModel.modelName} Document with id ${id} not found`,
        );
      }

      return updatedDocument;
    } catch (error: unknown) {
      console.error('Error updating document:', error);
      if (error instanceof Error) {
        throw new BadRequestException(
          `Error updating document: ${error.message}`,
        );
      }
      console.log('Unknown error updating document:', error);
      throw error;
    }
  }

  /** * Generic method to "delete" a document by its ID.
   *
   * This function marks a document as deleted in the database by setting its `isDeleted` flag to true.
   *
   * @param {string} id - The unique identifier of the document to delete.
   * @returns {Promise<HydratedDocument<any> | null>} - A Promise that resolves to the deleted document, or null if not found.
   * @throws {NotFoundException} - Thrown if the document with the specified ID is not found.
   * @throws {BadRequestException} - Thrown if an error occurs during the deletion.
   */
  async genericDeleteOne(id: string): Promise<HydratedDocument<any> | null> {
    try {
      const deletedDocument = await this.dbModel
        .findOneAndUpdate(
          { _id: id, isDeleted: false },
          { isDeleted: true },
          { new: true },
        )
        .exec();

      if (!deletedDocument) {
        throw new NotFoundException(
          `${this.dbModel.modelName} Document with id ${id} not found`,
        );
      }

      return deletedDocument;
    } catch (error: unknown) {
      console.error('Error deleting document:', error);
      if (error instanceof Error) {
        throw new BadRequestException(
          `Error deleting document: ${error.message}`,
        );
      }
      console.log('Unknown error deleting document:', error);
      throw error;
    }
  }

  /** * Generic method to find a single document by a filter.
   *
   * This function retrieves a single document from the database that matches the provided filter.
   *
   * @param {any} filter - The filter criteria to find the document.
   * @returns {Promise<HydratedDocument<any> | null>} - A Promise that resolves to the found document, or null if not found.
   * @throws {NotFoundException} - Thrown if an error occurs during the search.
   */
  async genericFindOne(filter: any): Promise<HydratedDocument<any> | null> {
    try {
      const response: HydratedDocument<any> | null = await this.dbModel
        .findOne({ ...filter, isDeleted: false })
        .exec();
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Error finding document by filter:', error);
        throw new NotFoundException(
          `Error finding document by filter: ${error.message}`,
        );
      }
      console.log('Unknown error finding document by filter:', error);
      throw error;
    }
  }

  /**
   * Find a single document with optional population.
   *
   * @template T - The type of the document
   * @param filter - Filter criteria for finding the document
   * @param populateOptions - Optional populate fields (string, PopulateOptions, or array)
   * @returns The found document with populated fields, or null if not found
   * @throws NotFoundException if there is an error during the query
   */
  async genericFindOneWithPopulate<T>(
    filter: any,
    populateOptions?: string | PopulateOptions | (string | PopulateOptions)[],
  ): Promise<HydratedDocument<T> | null> {
    try {
      let query = this.dbModel.findOne({ ...filter, isDeleted: false });

      const normalizedPopulate = normalizePopulate(populateOptions);
      if (normalizedPopulate) {
        query = query.populate(normalizedPopulate);
      }

      return await query.exec();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error finding and populating document:', error);
        throw new NotFoundException(
          `Error finding and populating document: ${error.message}`,
        );
      }
      throw error;
    }
  }
  /**
   * Find all documents matching a filter with optional population.
   *
   * @template T - The type of the documents
   * @param filter - Filter criteria for finding documents
   * @param populateOptions - Optional populate fields (string, PopulateOptions, or array)
   * @returns Array of found documents with populated fields (empty array if none found)
   * @throws NotFoundException if there is an error during the query
   */
  async genericFindAllWithPopulate<T>(
    filter?: any,
    populateOptions?: string | PopulateOptions | (string | PopulateOptions)[],
  ): Promise<HydratedDocument<T>[]> {
    try {
      let query = this.dbModel.find({ ...filter, isDeleted: false });

      const normalizedPopulate = normalizePopulate(populateOptions);
      if (normalizedPopulate) {
        query = query.populate(normalizedPopulate);
      }

      return await query.exec();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error finding and populating documents:', error);
        throw new NotFoundException(
          `Error finding and populating documents: ${error.message}`,
        );
      }
      throw error;
    }
  }

  /**
   * Generic method to find a single document by a filter or throw NotFoundException.
   *
   * This function retrieves a single document from the database that matches the provided filter.
   * If no document is found, it throws a NotFoundException.
   *
   * @param {any} filter - The filter criteria to find the document.
   * @returns {Promise<HydratedDocument<any> | null>} - A Promise that resolves to the found document.
   * @throws {NotFoundException} - Thrown if no document is found or an error occurs during the search.
   */
  async genericFindOneOrNotFound(
    filter: any,
  ): Promise<HydratedDocument<any> | null> {
    try {
      const response: HydratedDocument<any> | null = await this.dbModel
        .findOne({ ...filter, isDeleted: false })
        .exec();

      if (!response) {
        throw new NotFoundException(
          `${this.dbModel.modelName} Document not found with provided filter`,
        );
      }
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Error finding document by filter:', error);
        throw new NotFoundException(
          `Error finding document by filter: ${error.message}`,
        );
      }
      console.log('Unknown error finding document by filter:', error);
      throw error;
    }
  }
}