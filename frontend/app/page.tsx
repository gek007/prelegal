'use client'

import { useState } from 'react'
import { MNDAForm, MNDAFormData } from '@/components/mnda-form'
import { generateMNDApdf } from '@/lib/pdf-generator'

export default function Home() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: MNDAFormData) => {
    setLoading(true)
    try {
      await generateMNDApdf(data)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <MNDAForm onSubmit={handleSubmit} loading={loading} />
    </main>
  )
}
