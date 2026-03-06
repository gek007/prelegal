'use client'

import { useState } from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Button } from './ui/button'

export interface MNDAFormData {
  disclosingPartyName: string
  disclosingPartyAddress: string
  receivingPartyName: string
  receivingPartyAddress: string
  purpose: string
  effectiveDate: string
  mndaTerm: string
  termOfConfidentiality: string
  governingLaw: string
  jurisdiction: string
}

interface Props {
  onSubmit: (data: MNDAFormData) => void
  loading?: boolean
}

export function MNDAForm({ onSubmit, loading = false }: Props) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: keyof MNDAFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold text-gray-900">Mutual NDA Generator</h1>
      <p className="text-gray-600">Fill in the details below to generate a Mutual Non-Disclosure Agreement.</p>

      {/* Disclosing Party */}
      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold text-gray-900">Disclosing Party</legend>
        <div className="space-y-2">
          <Label htmlFor="disclosingPartyName">Name *</Label>
          <Input
            id="disclosingPartyName"
            value={formData.disclosingPartyName}
            onChange={(e) => handleChange('disclosingPartyName', e.target.value)}
            placeholder="Acme Corporation"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="disclosingPartyAddress">Address *</Label>
          <Textarea
            id="disclosingPartyAddress"
            value={formData.disclosingPartyAddress}
            onChange={(e) => handleChange('disclosingPartyAddress', e.target.value)}
            placeholder="123 Main St&#10;San Francisco, CA 94105"
            required
          />
        </div>
      </fieldset>

      {/* Receiving Party */}
      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold text-gray-900">Receiving Party</legend>
        <div className="space-y-2">
          <Label htmlFor="receivingPartyName">Name *</Label>
          <Input
            id="receivingPartyName"
            value={formData.receivingPartyName}
            onChange={(e) => handleChange('receivingPartyName', e.target.value)}
            placeholder="Tech Startup Inc."
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="receivingPartyAddress">Address *</Label>
          <Textarea
            id="receivingPartyAddress"
            value={formData.receivingPartyAddress}
            onChange={(e) => handleChange('receivingPartyAddress', e.target.value)}
            placeholder="456 Oak Ave&#10;Palo Alto, CA 94301"
            required
          />
        </div>
      </fieldset>

      {/* Agreement Terms */}
      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold text-gray-900">Agreement Terms</legend>

        <div className="space-y-2">
          <Label htmlFor="purpose">Purpose *</Label>
          <Textarea
            id="purpose"
            value={formData.purpose}
            onChange={(e) => handleChange('purpose', e.target.value)}
            placeholder="e.g., Evaluating a potential business relationship and discussing collaboration opportunities"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="effectiveDate">Effective Date *</Label>
          <Input
            id="effectiveDate"
            type="date"
            value={formData.effectiveDate}
            onChange={(e) => handleChange('effectiveDate', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mndaTerm">MNDA Term *</Label>
          <Input
            id="mndaTerm"
            value={formData.mndaTerm}
            onChange={(e) => handleChange('mndaTerm', e.target.value)}
            placeholder="e.g., 2 years"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="termOfConfidentiality">Term of Confidentiality *</Label>
          <Input
            id="termOfConfidentiality"
            value={formData.termOfConfidentiality}
            onChange={(e) => handleChange('termOfConfidentiality', e.target.value)}
            placeholder="e.g., 5 years"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="governingLaw">Governing Law (State) *</Label>
          <Input
            id="governingLaw"
            value={formData.governingLaw}
            onChange={(e) => handleChange('governingLaw', e.target.value)}
            placeholder="e.g., Delaware"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="jurisdiction">Jurisdiction (County/City) *</Label>
          <Input
            id="jurisdiction"
            value={formData.jurisdiction}
            onChange={(e) => handleChange('jurisdiction', e.target.value)}
            placeholder="e.g., New Castle County, Delaware"
            required
          />
        </div>
      </fieldset>

      <Button
        type="submit"
        disabled={loading}
        className="w-full text-base"
      >
        {loading ? 'Generating PDF...' : 'Download Mutual NDA'}
      </Button>
    </form>
  )
}
