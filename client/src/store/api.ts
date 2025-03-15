import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { CreateUrlDto } from '../dto/create-url.dto'
import { AnalyticsDto } from '../dto/analytics.dto'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}` }),
  tagTypes: ['Urls', 'Analytics'],
  endpoints: (builder) => ({
    createShortUrl: builder.mutation<{ shortUrl: string }, CreateUrlDto>({
      query: (body) => ({ url: '/shorten', method: 'POST', body }),
      invalidatesTags: ['Urls', 'Analytics'],
    }),

    deleteUrl: builder.mutation<{ message: string }, string>({
      query: (shortUrl) => ({ url: `/delete/${shortUrl}`, method: 'DELETE' }),
      invalidatesTags: (_, error, shortUrl) => {
        if (error) {
          console.error(`Error while deleting ${shortUrl}:`, error)
        }
        return [{ type: 'Urls', id: shortUrl }, { type: 'Analytics' }]
      },
    }),

    getAnalytics: builder.query<AnalyticsDto, string>({
      query: (shortUrl) => `/analytics/${shortUrl}`,
      providesTags: (result, error, shortUrl) => {
        if (error) {
          console.error(`Error while getting Analytics ${shortUrl}:`, error)
        }
        return result ? [{ type: 'Analytics', id: shortUrl }] : [{ type: 'Analytics' }]
      },
    }),
  }),
})

export const { useCreateShortUrlMutation, useDeleteUrlMutation, useGetAnalyticsQuery } = api
