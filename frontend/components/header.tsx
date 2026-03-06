'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export function Header() {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    // Get user email from localStorage
    const userEmail = localStorage.getItem('user_email')
    setEmail(userEmail || '')
  }, [])

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_email')
    // Redirect to login
    router.push('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1
              className="text-2xl font-bold text-navy cursor-pointer"
              onClick={() => router.push('/dashboard')}
            >
              PreLegal
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {email && (
              <>
                <span className="text-sm text-gray-600">{email}</span>
                <Button variant="outline" className="h-8 px-3 text-xs" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
