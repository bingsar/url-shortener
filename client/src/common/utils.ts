import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'

export const getErrorMessage = (error: FetchBaseQueryError | SerializedError): string => {
  if ('data' in error && typeof error.data === 'object' && error.data !== null) {
    return (error.data as { message?: string }).message || 'An error occurred.';
  } else if ('message' in error) {
    return error.message || 'An error occurred.';
  }
  return 'An unknown error occurred.';
};