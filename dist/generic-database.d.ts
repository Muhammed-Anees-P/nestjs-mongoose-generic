import { HydratedDocument, Model, PopulateOptions } from 'mongoose';
export declare class GenericDatabase<T extends Model<HydratedDocument<any>>> {
    private readonly dbModel;
    constructor(dbModel: T);
    /** * Finds a document by its username.
     *
     * This function queries the database for a document matching the provided username.
     *
     * @param {string} username - The username of the document to find.
     * @returns {Promise<HydratedDocument<any> | null>} - A Promise that resolves to the document if found, or null otherwise.
     * @throws {NotFoundException} - Thrown if an error occurs during the search.
     */
    genericFindByUsername(username: string, populateFields?: string[]): Promise<HydratedDocument<any> | null>;
    /** * Generic method to find all documents.
     * * This function retrieves all documents from the database.
     *
     * @returns {Promise<HydratedDocument<any>[]>} - A Promise that resolves to an array of all documents.
     * @throws {NotFoundException} - Thrown if an error occurs during the retrieval.
     */
    genericFindAll(): Promise<HydratedDocument<any>[]>;
    /**
     * Finds a single document by its ID where `isDeleted` is false.
     *
     * @param {string} id - The unique identifier of the document to find.
     * @returns {Promise<HydratedDocument<any> | null>} The found document, or throws an error if not found.
     * @throws {Error} When the document is not found or a database error occurs.
     */
    genericFindOneByIdOrNotFound(id: string, populateFields?: string[]): Promise<HydratedDocument<any> | null>;
    /** * Generic method to create a new document.
     *
     * This function creates a new document in the database using the provided DTO.
     *
     * @param {any} createDto - The data transfer object containing the data for the new document.
     * @returns {Promise<HydratedDocument<any>>} - A Promise that resolves to the created document.
     * @throws {BadRequestException} - Thrown if an error occurs during creation.
     */
    genericCreateOne(createDto: any): Promise<HydratedDocument<any>>;
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
    genericUpdateOne(id: string, updateDto: any): Promise<HydratedDocument<any> | null>;
    /** * Generic method to "delete" a document by its ID.
     *
     * This function marks a document as deleted in the database by setting its `isDeleted` flag to true.
     *
     * @param {string} id - The unique identifier of the document to delete.
     * @returns {Promise<HydratedDocument<any> | null>} - A Promise that resolves to the deleted document, or null if not found.
     * @throws {NotFoundException} - Thrown if the document with the specified ID is not found.
     * @throws {BadRequestException} - Thrown if an error occurs during the deletion.
     */
    genericDeleteOne(id: string): Promise<HydratedDocument<any> | null>;
    /** * Generic method to find a single document by a filter.
     *
     * This function retrieves a single document from the database that matches the provided filter.
     *
     * @param {any} filter - The filter criteria to find the document.
     * @returns {Promise<HydratedDocument<any> | null>} - A Promise that resolves to the found document, or null if not found.
     * @throws {NotFoundException} - Thrown if an error occurs during the search.
     */
    genericFindOne(filter: any): Promise<HydratedDocument<any> | null>;
    /**
     * Find a single document with optional population.
     *
     * @template T - The type of the document
     * @param filter - Filter criteria for finding the document
     * @param populateOptions - Optional populate fields (string, PopulateOptions, or array)
     * @returns The found document with populated fields, or null if not found
     * @throws NotFoundException if there is an error during the query
     */
    genericFindOneWithPopulate<T>(filter: any, populateOptions?: string | PopulateOptions | (string | PopulateOptions)[]): Promise<HydratedDocument<T> | null>;
    /**
     * Find all documents matching a filter with optional population.
     *
     * @template T - The type of the documents
     * @param filter - Filter criteria for finding documents
     * @param populateOptions - Optional populate fields (string, PopulateOptions, or array)
     * @returns Array of found documents with populated fields (empty array if none found)
     * @throws NotFoundException if there is an error during the query
     */
    genericFindAllWithPopulate<T>(filter?: any, populateOptions?: string | PopulateOptions | (string | PopulateOptions)[]): Promise<HydratedDocument<T>[]>;
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
    genericFindOneOrNotFound(filter: any): Promise<HydratedDocument<any> | null>;
}
