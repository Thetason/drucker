"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, Lock, LogIn, UserPlus, ArrowLeft, Users, KeyRound } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [remainingSpots, setRemainingSpots] = useState<number | null>(null)

  const isLogin = mode === 'login'
  const isSignup = mode === 'signup'
  const isReset = mode === 'reset'

  const switchMode = (nextMode: typeof mode) => {
    setMode(nextMode)
    setMessage(null)
    setLoading(false)
    if (nextMode !== 'signup') {
      setName("")
    }
    if (nextMode === 'reset') {
      setPassword("")
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || '요청을 처리하지 못했습니다.' })
        return
      }

      localStorage.setItem('drucker-auth', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        isActive: data.user.isActive
      }))

      setMessage({
        type: 'success',
        text: isLogin ? '로그인 성공! 잠시 후 메인으로 이동합니다.' : '회원가입 성공! 잠시 후 메인으로 이동합니다.'
      })

      setTimeout(() => {
        window.location.href = '/'
      }, 1500)
    } catch (error) {
      console.error('Auth error:', error)
      setMessage({ type: 'error', text: '오류가 발생했습니다. 다시 시도해주세요.' })
    } finally {
      setLoading(false)
    }
  }

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/reset-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || '요청을 처리하지 못했습니다.' })
        return
      }

      setMessage({ type: 'success', text: data.message || '비밀번호 재설정 요청이 접수되었습니다.' })

      setTimeout(() => {
        switchMode('login')
      }, 2000)
    } catch (error) {
      console.error('Password reset request error:', error)
      setMessage({ type: 'error', text: '요청을 처리하지 못했습니다. 다시 시도해주세요.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isSignup) {
      fetch('/api/auth/spots')
        .then(res => res.json())
        .then(data => setRemainingSpots(data.remaining))
        .catch(() => setRemainingSpots(null))
    } else {
      setRemainingSpots(null)
    }
  }, [isSignup])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition">
          <ArrowLeft className="h-4 w-4" />
          홈으로 돌아가기
        </Link>

        {isSignup && remainingSpots !== null && remainingSpots > 0 && (
          <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-900">남은 자리</span>
              </div>
              <span className="text-lg font-bold text-amber-600">{remainingSpots}/30</span>
            </div>
            {remainingSpots <= 5 && (
              <p className="text-xs text-amber-700 mt-1">서둘러주세요! 마감 임박</p>
            )}
          </div>
        )}

        <Card className="shadow-xl border-0">
          <CardHeader className="pb-6">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                {isReset ? <KeyRound className="h-8 w-8 text-white" /> : <User className="h-8 w-8 text-white" />}
              </div>
            </div>
            <CardTitle className="text-2xl text-center">
              {isLogin ? '로그인' : isSignup ? '회원가입' : '비밀번호 재설정'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin
                ? '드러커에 오신 것을 환영합니다'
                : isSignup
                  ? '크리에이터 여정을 시작하세요'
                  : '가입된 이메일로 비밀번호 재설정을 요청할 수 있습니다.'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isReset ? (
              <form onSubmit={handleResetRequest} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    가입 이메일
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <p className="text-xs text-gray-500">
                  요청이 접수되면 관리자가 확인 후 임시 비밀번호를 발급합니다. 발급된 비밀번호는 관리자에게 문의해주세요.
                </p>

                {message && (
                  <div className={`p-3 rounded-lg text-sm ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {message.text}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  disabled={loading}
                >
                  {loading ? '요청 중...' : '재설정 요청 보내기'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleAuth} className="space-y-4">
                {isSignup && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      이름
                    </label>
                    <Input
                      type="text"
                      placeholder="홍길동"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isSignup}
                      disabled={loading}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    이메일
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-gray-500" />
                    비밀번호
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  {isSignup && (
                    <p className="text-xs text-gray-500">최소 6자 이상</p>
                  )}
                </div>

                {message && (
                  <div className={`p-3 rounded-lg text-sm ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {message.text}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  disabled={loading}
                >
                  {loading
                    ? '처리 중...'
                    : isLogin
                      ? (<><LogIn className="h-4 w-4 mr-2" />로그인</>)
                      : (<><UserPlus className="h-4 w-4 mr-2" />회원가입</>)}
                </Button>

                <div className="text-center text-sm text-gray-600 space-y-2">
                  {isLogin && (
                    <>
                      <div>
                        <span>계정이 없으신가요?</span>
                        <button
                          type="button"
                          onClick={() => switchMode('signup')}
                          className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          회원가입
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => switchMode('reset')}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        비밀번호를 잊으셨나요?
                      </button>
                    </>
                  )}

                  {isSignup && (
                    <>
                      <div>
                        <span>이미 계정이 있으신가요?</span>
                        <button
                          type="button"
                          onClick={() => switchMode('login')}
                          className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          로그인
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => switchMode('reset')}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        비밀번호 재설정 요청하기
                      </button>
                    </>
                  )}
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {isReset ? (
          <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              로그인 화면으로 돌아가기
            </button>
            <div>
              <span>계정이 없으신가요?</span>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                회원가입
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>Vercel Postgres 기반 · bcrypt 암호화 적용</p>
          </div>
        )}

        <div className="mt-4 text-center text-xs text-gray-500">
          <p>가입하면 드러커의 이용약관 및 개인정보처리방침에 동의하게 됩니다.</p>
        </div>
      </div>
    </div>
  )
}
