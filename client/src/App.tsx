import React, { useState } from 'react'

type ApiResponse = {
  emotion: string
  confidence: number
}

const App = () => {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<ApiResponse | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from server.')
      }

      const data: ApiResponse = await response.json()
      setResult(data)
      console.log(data)
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#D5A105] flex justify-center items-center min-h-screen w-full">
      <div className="flex flex-col gap-5 bg-[#FEF8E8] sm:p-10 rounded-xl">
        <h1 className="text-3xl font-bold text-[#D5A105] text-center mb-5">
          Emotion Reflection Tool
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="border rounded-md p-3 text-black"
            placeholder="How are you feeling today?"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            {loading ? 'Analyzing...' : 'Analyze Emotion'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 p-4 rounded-lg shadow-md bg-green-50 border">
            <h2 className="text-xl font-semibold mb-2">Detected Emotion</h2>
            <p className="mb-1">
              <strong>Emotion:</strong> {result.emotion}
            </p>
            <p className="mb-1">
              <strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
