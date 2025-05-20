import { ApiError, type IApiError } from '../@types/apiError';
import type { IBook } from '../@types/book/book';
import { BookDto } from '../@types/book/bookDto';


const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${apiBaseUrl}/api`;

/**
 * A helper function to handle API responses, parse JSON, and manage errors.
 * @template T The expected type of the successful response data.
 * @param {Response} response The raw Response object from a fetch call.
 * @returns {Promise<T>} A promise that resolves with the parsed JSON data or rejects with an error.
 */
async function handleApiResponse<T>(response : Response) : Promise<T> {
  if (!response.ok) {
    let errorData : IApiError = { 
      message: `HTTP error! status: ${response.status} ${response.statusText || ''}`, 
      statusCode: response.status,
      errors: undefined 
    };
    try {
      // Clone the response so it can be read again if the first attempt fails or if we need raw text
      const clonedResponse = response.clone();
      const responseBody = await clonedResponse.json();
      
      // Handle the specific error format from the API
      if (responseBody.Message) {
        errorData = {
          message: responseBody.Message,
          statusCode: response.status,
          errors: undefined
        };
      } else {
        errorData = {
          message: responseBody.message || responseBody.title || errorData.message, // ASP.NET Core uses 'title' for general error
          statusCode: response.status,
          errors: responseBody.errors || undefined, // ASP.NET Core uses 'errors' for validation
        };
      }
      
      // Handle ASP.NET Core ProblemDetails structure if message is still generic
      if ((errorData.message === `HTTP error! status: ${response.status} ${response.statusText || ''}`) && responseBody.detail) {
        errorData.message = responseBody.detail;
      }
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      console.warn('Failed to parse API error response as JSON. Attempting to read as text.');
      try {
        const errorText = await response.text();
        console.error('Raw error response text:', errorText);
        errorData.message = `HTTP error ${response.status}: ${errorText.substring(0, 200)}${errorText.length > 200 ? '...' : ''}`;
      } catch (textError) {
        console.error('Failed to read API error response as text after JSON parsing failed.', textError);
      }
    }
    throw new ApiError(errorData.message, response.status, errorData.errors);
  }
  
  // For 204 No Content, response.json() will fail.
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

/**
 * Fetches all books from the API.
 * @returns {Promise<IBook[]>} A promise that resolves to an array of books.
 */
export async function fetchBooks() : Promise<IBook[]> {
  const response = await fetch(`${API_BASE_URL}/books`);
  return handleApiResponse<IBook[]>(response);
}

/**
 * Fetches a single book by its ID from the API.
 * @param {string} id The ID of the book to fetch.
 * @returns {Promise<IBook>} A promise that resolves to the book object.
 */
export async function fetchBookById(id : string) : Promise<IBook> {
  const response = await fetch(`${API_BASE_URL}/books/${id}`);
  return handleApiResponse<IBook>(response);
}

/**
 * Creates a new book.
 * @param {IBook} newBook The book object to create. Note: The DTO conversion handles what's sent to the API.
 * @returns {Promise<IBook>} A promise that resolves to the created book object, typically including its new ID.
 */
export async function createBook(newBook : IBook) : Promise<IBook> {
  const response = await fetch(`${API_BASE_URL}/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(BookDto(newBook)),
  });
  return handleApiResponse<IBook>(response); // handleApiResponse will throw ApiError if !response.ok
}

/**
 * Updates an existing book.
 * @param {IBook} payload The book object containing the ID and updated fields. Note: The DTO conversion handles what's sent to the API.
 * @returns {Promise<IBook>} A promise that resolves to the updated book object.
 */
export async function updateBook(payload : IBook) : Promise<IBook> {
  const response = await fetch(`${API_BASE_URL}/books/${payload.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(BookDto(payload)),
  });
  return handleApiResponse<IBook>(response);
}

/**
 * Deletes a book by its ID.
 * @param {string} id The ID of the book to delete.
 * @returns {Promise<{ id: string }>} A promise that resolves with an object containing the ID of the deleted book upon successful deletion (typically after a 204 No Content response).
 */
export async function deleteBook(id : string) : Promise<{ id : string }> {
  const response = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: 'DELETE',
  });
  // Book successfully deleted
  if (response.status === 204) {
    return { id };
  }
  if (!response.ok) {
     const errorData : IApiError = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
    throw new ApiError(errorData.message, response.status, errorData.errors);
  }
  throw new ApiError('Book could not be deleted', response.status);
}
