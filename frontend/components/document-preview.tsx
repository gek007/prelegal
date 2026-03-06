'use client'

import { useState, useEffect, useMemo } from 'react'
import { MNDAFormData } from './mnda-form'

interface DocumentPreviewProps {
  data: MNDAFormData
}

export function DocumentPreview({ data }: DocumentPreviewProps) {
  const [template, setTemplate] = useState<string>('')

  useEffect(() => {
    // Load the actual template
    fetch('/templates/Mutual-NDA.md')
      .then(res => res.text())
      .then(text => setTemplate(text))
      .catch(err => console.error('Failed to load template:', err))
  }, [])

  const documentHTML = useMemo(() => {
    if (!template) return '<p class="text-gray-500">Loading template...</p>'

    // Replace placeholders in the actual template
    const filledTemplate = template
      .replace(/<span class="coverpage_link">Purpose<\/span>/g,
        `<span style="background: #ecad0a; font-weight: 600;">${escapeHtml(data.purpose) || '[Purpose]'}</span>`)
      .replace(/<span class="coverpage_link">Effective Date<\/span>/g,
        `<span style="background: #ecad0a; font-weight: 600;">${data.effectiveDate ? formatDate(data.effectiveDate) : '[Effective Date]'}</span>`)
      .replace(/<span class="coverpage_link">MNDA Term<\/span>/g,
        `<span style="background: #ecad0a; font-weight: 600;">${escapeHtml(data.mndaTerm) || '[MNDA Term]'}</span>`)
      .replace(/<span class="coverpage_link">Term of Confidentiality<\/span>/g,
        `<span style="background: #ecad0a; font-weight: 600;">${escapeHtml(data.termOfConfidentiality) || '[Term of Confidentiality]'}</span>`)
      .replace(/<span class="coverpage_link">Governing Law<\/span>/g,
        `<span style="background: #ecad0a; font-weight: 600;">${escapeHtml(data.governingLaw) || '[Governing Law]'}</span>`)
      .replace(/<span class="coverpage_link">Jurisdiction<\/span>/g,
        `<span style="background: #ecad0a; font-weight: 600;">${escapeHtml(data.jurisdiction) || '[Jurisdiction]'}</span>`)

    // Generate full document with cover page
    return generateFullDocument(data, filledTemplate)
  }, [template, data])

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full overflow-auto max-h-[calc(100vh-120px)]">
      <div className="mb-4 pb-4 border-b sticky top-0 bg-white z-10">
        <h2 className="text-xl font-bold text-gray-900">Mutual NDA Document</h2>
        <p className="text-sm text-gray-600">Live preview - highlights show your inputs</p>
      </div>

      <div
        className="prose prose-sm max-w-none"
        style={{
          fontFamily: 'Times New Roman, Times, serif',
          lineHeight: '1.6',
          fontSize: '11px',
          color: '#000',
          padding: '20px',
          backgroundColor: '#fff',
        }}
        dangerouslySetInnerHTML={{ __html: documentHTML }}
      />
    </div>
  )
}

function generateFullDocument(data: MNDAFormData, filledTemplate: string): string {
  // Generate cover page
  const coverPage = `
    <div style="text-align: center; margin-bottom: 40px; padding-top: 20px;">
      <h1 style="font-size: 22px; font-weight: bold; margin-bottom: 20px; color: #000;">MUTUAL NON-DISCLOSURE AGREEMENT</h1>
    </div>

    <div style="margin-bottom: 25px; page-break-inside: avoid;">
      <h2 style="font-size: 14px; font-weight: bold; margin-bottom: 8px; color: #000;">DISCLOSING PARTY:</h2>
      <p style="margin: 4px 0;"><strong>${escapeHtml(data.disclosingPartyName) || '<span style="color: #999;">[Disclosing Party Name]</span>'}</strong></p>
      <p style="margin: 4px 0; white-space: pre-line;">${escapeHtml(data.disclosingPartyAddress) || '<span style="color: #999;">[Disclosing Party Address]</span>'}</p>
    </div>

    <div style="margin-bottom: 25px; page-break-inside: avoid;">
      <h2 style="font-size: 14px; font-weight: bold; margin-bottom: 8px; color: #000;">RECEIVING PARTY:</h2>
      <p style="margin: 4px 0;"><strong>${escapeHtml(data.receivingPartyName) || '<span style="color: #999;">[Receiving Party Name]</span>'}</strong></p>
      <p style="margin: 4px 0; white-space: pre-line;">${escapeHtml(data.receivingPartyAddress) || '<span style="color: #999;">[Receiving Party Address]</span>'}</p>
    </div>

    <div style="margin-top: 40px;">
      <p style="margin: 8px 0;"><strong>Purpose:</strong> ${escapeHtml(data.purpose) || '<span style="color: #999;">[Purpose]</span>'}</p>
      <p style="margin: 8px 0;"><strong>Effective Date:</strong> ${data.effectiveDate ? formatDate(data.effectiveDate) : '<span style="color: #999;">[Effective Date]</span>'}</p>
      <p style="margin: 8px 0;"><strong>MNDA Term:</strong> ${escapeHtml(data.mndaTerm) || '<span style="color: #999;">[MNDA Term]</span>'}</p>
      <p style="margin: 8px 0;"><strong>Term of Confidentiality:</strong> ${escapeHtml(data.termOfConfidentiality) || '<span style="color: #999;">[Term of Confidentiality]</span>'}</p>
      <p style="margin: 8px 0;"><strong>Governing Law:</strong> ${escapeHtml(data.governingLaw) || '<span style="color: #999;">[Governing Law]</span>'}</p>
      <p style="margin: 8px 0;"><strong>Jurisdiction:</strong> ${escapeHtml(data.jurisdiction) || '<span style="color: #999;">[Jurisdiction]</span>'}</p>
    </div>

    <div style="margin-top: 50px;">
      <div style="margin-bottom: 30px;">
        <p style="border-bottom: 1px solid black; width: 250px; margin-bottom: 8px;"></p>
        <p style="margin: 4px 0;"><strong>${escapeHtml(data.disclosingPartyName) || '<span style="color: #999;">[Disclosing Party Name]</span>'}</strong></p>
        <p style="margin: 4px 0; color: #666; font-size: 10px;">Disclosing Party Signature</p>
      </div>

      <div>
        <p style="border-bottom: 1px solid black; width: 250px; margin-bottom: 8px;"></p>
        <p style="margin: 4px 0;"><strong>${escapeHtml(data.receivingPartyName) || '<span style="color: #999;">[Receiving Party Name]</span>'}</strong></p>
        <p style="margin: 4px 0; color: #666; font-size: 10px;">Receiving Party Signature</p>
      </div>
    </div>

    <div style="margin: 40px 0; padding-top: 20px; border-top: 2px solid #000;">
      <div style="text-align: center; margin-bottom: 15px;">
        <h3 style="font-size: 13px; font-weight: bold; color: #000;">STANDARD TERMS</h3>
      </div>
    </div>
  `

  // Convert markdown to HTML
  const standardTermsHTML = convertMarkdownToHTML(filledTemplate)

  return coverPage + standardTermsHTML
}

function convertMarkdownToHTML(markdown: string): string {
  // Escape HTML first
  let html = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Convert markdown headers to HTML
  html = html
    .replace(/^# (.+)$/gm, '<h3 style="font-size: 14px; font-weight: bold; margin: 15px 0 8px 0; color: #000;">$1</h3>')
    .replace(/^## (.+)$/gm, '<h4 style="font-size: 13px; font-weight: bold; margin: 12px 0 6px 0; color: #000;">$1</h4>')
    .replace(/^### (.+)$/gm, '<h5 style="font-size: 12px; font-weight: bold; margin: 10px 0 5px 0; color: #000;">$1</h5>')

  // Convert bold text
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Convert italic text
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Split into paragraphs (double newline)
  const paragraphs = html.split('\n\n')
  html = paragraphs.map(para => {
    // Skip if it's a header
    if (para.startsWith('<h')) return para

    // Convert numbered lists
    if (para.match(/^\d+\./)) {
      const items = para.split('\n').map(line => {
        const match = line.match(/^(\d+)\.\s*(.+)/)
        return match ? `<li style="margin: 4px 0;">${match[2]}</li>` : line
      }).join('')
      return `<ol style="margin: 8px 0; padding-left: 25px;">${items}</ol>`
    }

    // Regular paragraph
    if (para.trim() && !para.startsWith('<')) {
      return `<p style="margin: 8px 0; text-align: justify;">${para}</p>`
    }

    return para
  }).join('\n')

  return html
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function escapeHtml(text: string): string {
  if (!text) return ''
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
