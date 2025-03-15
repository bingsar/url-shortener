import { useState } from 'react'
import { useCreateShortUrlMutation, useGetAnalyticsQuery, useDeleteUrlMutation } from './store/api'
import Analytics from './components/Analytics'
import { getErrorMessage } from './common/utils.ts'

export default function App() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [alias, setAlias] = useState('')
  const [shortUrlInput, setShortUrlInput] = useState('')
  const [selectedShortUrl, setSelectedShortUrl] = useState('')

  const [createShortUrl, { data: createdUrl, error: createError }] = useCreateShortUrlMutation()

  const [deleteUrl] = useDeleteUrlMutation()

  const {
    data: analytics,
    isFetching,
    error: analyticsError,
    refetch,
  } = useGetAnalyticsQuery(selectedShortUrl, { skip: !selectedShortUrl })

  const handleCreate = () => {
    createShortUrl({ originalUrl, alias: alias.trim() || undefined })
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

      <div className="flex gap-2 mb-4">
        <input
          className="border rounded p-2 flex-1"
          placeholder="Original URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
        />
        <input
          className="border rounded p-2 w-40"
          placeholder="Alias (optional)"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 rounded" onClick={handleCreate}>
          Create
        </button>
      </div>

      {createdUrl && (
        <div className="bg-green-100 p-2 rounded mb-4">
          Short URL created: <strong>{createdUrl.shortUrl}</strong>
        </div>
      )}

      {createError && (
        <div className="bg-red-100 p-2 rounded mb-2">
          Error: {getErrorMessage(createError)}
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <input
          className="border rounded p-2 flex-1"
          placeholder="Enter short URL for analytics"
          value={shortUrlInput}
          onChange={(e) => setShortUrlInput(e.target.value)}
        />
        <button className="bg-green-500 text-white px-4 rounded" onClick={handleGetAnalytics}>
          Get Analytics
        </button>
      </div>

      {isFetching && <p>Loading analytics...</p>}

      {analyticsError && (
        <div className="bg-red-100 p-2 rounded mb-4">
          Error: {getErrorMessage(analyticsError)}
        </div>
      )}

      {analytics && !analyticsError && (
        <Analytics analytics={analytics} handleDelete={handleDelete} refetch={refetch} />
      )}
    </div>
  )
}
