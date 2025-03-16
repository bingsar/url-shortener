import { useState } from 'react'
import { useCreateShortUrlMutation, useGetAnalyticsQuery, useDeleteUrlMutation } from './store/api'
import Analytics from './components/Analytics'
import { getErrorMessage, getMinDate } from './common/utils.ts'

export default function App() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [alias, setAlias] = useState('')
  const [shortUrlInput, setShortUrlInput] = useState('')
  const [selectedShortUrl, setSelectedShortUrl] = useState('')
  const [expiresAt, setExpiresAt] = useState('')

  const [createShortUrl, { data: createdUrl, error: createError }] = useCreateShortUrlMutation()

  const [deleteUrl] = useDeleteUrlMutation()

  const {
    data: analytics,
    isFetching,
    error: analyticsError,
    refetch,
  } = useGetAnalyticsQuery(selectedShortUrl, { skip: !selectedShortUrl })

  const handleCreate = () => {
    createShortUrl({
      originalUrl,
      alias: alias.trim() || undefined,
      expiresAt: expiresAt.trim() || undefined,
    })
  }

  const handleDelete = async () => {
    await deleteUrl(selectedShortUrl)
  }

  const handleGetAnalytics = () => {
    setSelectedShortUrl(shortUrlInput.trim())
    refetch()
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">URL Shortener</h1>

      <div className="relative">
        <div className="flex flex-col gap-4 md:flex-row pb-14 w-full">
          <div className="relative flex flex-col gap-2 flex-grow">
            <label className="text-gray-400" htmlFor="originalUrl">
              Alias (Optional)
            </label>
            <input
              id="originalUrl"
              className="border rounded p-2 flex-1 w-full h-11"
              placeholder="Original URL"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />
          </div>
          <div className="relative flex flex-col gap-2 flex-grow">
            <label className="text-gray-400" htmlFor="alias">
              Alias (Optional)
            </label>
            <input
              id="alias"
              className="border rounded p-2 w-full h-11"
              placeholder="Alias (optional)"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
          </div>
          <div className="relative flex flex-col gap-2 flex-grow">
            <label className="text-gray-400" htmlFor="expiresAt">
              Expire date (Optional)
            </label>
            <input
              id="expiresAt"
              type="date"
              className="border rounded p-2 w-full h-11"
              placeholder="Expires At"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              min={getMinDate()}
            />
          </div>
          <button
            className="md:mt-8 h-11 bg-blue-500 text-white px-4 rounded"
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
        {createdUrl && (
          <div className="absolute bottom-0 bg-green-100 p-2 rounded mb-2">
            Short URL created: <strong>{createdUrl.shortUrl}</strong>
          </div>
        )}

        {createError && (
          <div className="absolute bottom-0 bg-red-100 p-2 rounded mb-2">
            Error: {getErrorMessage(createError)}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Get Analytics</h2>
        <div className="flex gap-2 mb-4">
          <input
            className="border rounded p-2 w-full"
            placeholder="Enter short URL for analytics"
            value={shortUrlInput}
            onChange={(e) => setShortUrlInput(e.target.value)}
          />
          <button
            className="bg-green-500 text-white px-4 rounded whitespace-nowrap"
            onClick={handleGetAnalytics}
          >
            Get Analytics
          </button>
        </div>
      </div>

      {isFetching && <p>Loading analytics...</p>}

      {analyticsError && (
        <div className="bg-red-100 p-2 rounded mb-4">Error: {getErrorMessage(analyticsError)}</div>
      )}

      {analytics && !analyticsError && (
        <Analytics analytics={analytics} handleDelete={handleDelete} refetch={refetch} />
      )}
    </div>
  )
}
