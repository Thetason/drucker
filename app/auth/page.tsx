"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, Lock, LogIn, UserPlus, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // 임시 로그인 함수 (나중에 Supabase로 교체)
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // 임시 로직: localStorage에 저장
      if (isLogin) {
        // 로그인
        const savedUser = localStorage.getItem('drucker-user')
        if (savedUser) {
          const user = JSON.parse(savedUser)
          if (user.email === email && user.password === password) {
            localStorage.setItem('drucker-auth', JSON.stringify({ email, name: user.name }))
            // 쿠키에도 저장 (미들웨어에서 확인용)
            document.cookie = `drucker-auth=true; path=/; max-age=${7 * 24 * 60 * 60}` // 7일
            setMessage({ type: 'success', text: '로그인 성공! 잠시 후 메인으로 이동합니다.' })
            setTimeout(() => {
              window.location.href = '/'
            }, 1500)
          } else {
            setMessage({ type: 'error', text: '이메일 또는 비밀번호가 일치하지 않습니다.' })
          }
        } else {
          setMessage({ type: 'error', text: '등록되지 않은 사용자입니다.' })
        }
      } else {
        // 회원가입
        const newUser = { email, password, name }
        localStorage.setItem('drucker-user', JSON.stringify(newUser))
        localStorage.setItem('drucker-auth', JSON.stringify({ email, name }))
        // 쿠키에도 저장 (미들웨어에서 확인용)
        document.cookie = `drucker-auth=true; path=/; max-age=${7 * 24 * 60 * 60}` // 7일
        setMessage({ type: 'success', text: '회원가입 성공! 잠시 후 메인으로 이동합니다.' })
        setTimeout(() => {
          window.location.href = '/'
        }, 1500)
      }
    } catch (error) {
      setMessage({ type: 'error', text: '오류가 발생했습니다. 다시 시도해주세요.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition">
          <ArrowLeft className="h-4 w-4" />
          홈으로 돌아가기
        </Link>

        <Card className="shadow-xl border-0">
          <CardHeader className="pb-6">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">
              {isLogin ? '로그인' : '회원가입'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? '드러커에 오신 것을 환영합니다' 
                : '크리에이터 여정을 시작하세요'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
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
                    required={!isLogin}
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
                {!isLogin && (
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
                {loading ? (
                  '처리 중...'
                ) : (
                  <>
                    {isLogin ? (
                      <>
                        <LogIn className="h-4 w-4 mr-2" />
                        로그인
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        회원가입
                      </>
                    )}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <p className="text-center text-sm text-gray-600">
                {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setMessage(null)
                    setEmail("")
                    setPassword("")
                    setName("")
                  }}
                  className="ml-2 font-medium text-blue-600 hover:text-blue-700"
                  disabled={loading}
                >
                  {isLogin ? '회원가입' : '로그인'}
                </button>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                임시 로그인 시스템입니다. 
                <br />
                추후 Supabase Auth로 업그레이드 예정입니다.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>가입하면 드러커의 이용약관 및 개인정보처리방침에 동의하게 됩니다.</p>
        </div>
      </div>
    </div>
  )
}