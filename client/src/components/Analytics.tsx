import { AnalyticsDto } from '../dto/analytics.dto.ts'
import { useEffect, useState } from 'react'

interface AnalyticsProps {
  analytics: AnalyticsDto
  handleDelete: () => void
  refetch: () => void
}

export default function Analytics({ analytics, handleDelete, refetch }: AnalyticsProps) {
  const [shouldRefetch, setShouldRefetch] = useState(false)

  const handleOpenShortUrl = () => {
    setShouldRefetch(true)
    const url = `${import.meta.env.VITE_BACKEND_URL}/${analytics.shortUrl}`
    window.open(url, '_blank')
  }

  useEffect(() => {
    const onFocus = () => {
      if (shouldRefetch) {
        refetch()
        setShouldRefetch(false)
      }
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [shouldRefetch, refetch])

  return (
    <div className="border rounded p-4">
      <h3 className="font-semibold mb-2">Analytics for: {analytics.shortUrl}</h3>
      <table className="w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Original URL</th>
            <th className="border border-gray-300 p-2">Total Clicks</th>
            <th className="border border-gray-300 p-2">Created At</th>
            <th className="border border-gray-300 p-2">Recent Clicks (IP - Date)</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2">{analytics.originalUrl}</td>
            <td className="border border-gray-300 p-2">{analytics.clickCount}</td>
            <td className="border border-gray-300 p-2">
              {new Date(analytics.createdAt).toLocaleString()}
            </td>
            <td className="border border-gray-300 p-2">
              {analytics.recentClicks.length > 0 ? (
                <ul>
                  {analytics.recentClicks.map((click, idx) => (
                    <li key={idx}>
                      {click.ipAddress} - {new Date(click.clickedAt).toLocaleString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <span>No recent clicks</span>
              )}
            </td>
            <td className="p-2 flex flex-col gap-4">
              <button
                className="bg-blue-500 text-white px-4 py-1 rounded"
                onClick={handleOpenShortUrl}
              >
                Go to URL
              </button>
              <button className="bg-red-500 text-white px-4 py-1 rounded" onClick={handleDelete}>
                Delete URL
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
