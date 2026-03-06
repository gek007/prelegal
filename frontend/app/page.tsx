'use client'

import { useState } from 'react'
import { MNDAForm, MNDAFormData } from '@/components/mnda-form'
import { generateMNDApdf } from '@/lib/pdf-generator'
import { DocumentPreview } from '@/components/document-preview'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<MNDAFormData>({
    disclosingPartyName: '',
    disclosingPartyAddress: '',
    receivingPartyName: '',
    receivingPartyAddress: '',
    purpose: '',
    effectiveDate: '',
    mndaTerm: '',
    termOfConfidentiality: '',
    governingLaw: '',
    jurisdiction: '',
  })

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

  const handleFormChange = (data: MNDAFormData) => {
    setFormData(data)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Mutual NDA Generator</h1>
          <p className="text-gray-600 mt-2">Fill in the form and see your document update in real-time</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div>
            <MNDAForm onSubmit={handleSubmit} loading={loading} onChange={handleFormChange} />
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <DocumentPreview data={formData} />
          </div>
        </div>
      </div>
    </main>
  )
}
