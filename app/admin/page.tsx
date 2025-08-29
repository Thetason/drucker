"use client"

import { useState, useEffect } from "react"
import { 
  Users, Shield, UserCheck, UserX, 
  Activity, TrendingUp, AlertCircle, 
  Crown, ShieldCheck, User, Settings,
  RefreshCw, Search, Filter, ChevronDown,
  Mail, Calendar, Hash, FileText, CheckCircle
} from "lucide-react"

interface UserData {
  id: string
  email: string
  name: string | null
  role: 'MASTER' | 'ADMIN' | 'USER'
  isActive: boolean
  createdAt: string
  _count: {
    contentPlans: number
    tasks: number
  }
}

interface Stats {
  total: number
  active: number
  masters: number
  admins: number
  users: number
  activeUsers: number
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserData[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<'all' | 'MASTER' | 'ADMIN' | 'USER'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [password, setPassword] = useState("")

  // 관리자 인증 체크
  const checkAuth = () => {
    const authData = localStorage.getItem('drucker-auth')
    if (authData) {
      const user = JSON.parse(authData)
      // 실제로는 서버에서 role을 확인해야 함
      if (user.email === 'master@drucker.com') {
        setIsAuthorized(true)
        fetchUsers()
      }
    }
  }

  // 간단한 비밀번호 인증 (임시) - 실제로는 서버 인증 필요
  const handleAuth = async () => {
    // TODO: 서버사이드 인증 구현 필요
    // 임시로 하드코딩된 비밀번호 제거
    alert('보안 업데이트 중입니다. 서버 인증 시스템 구현이 필요합니다.')
    return
  }

  useEffect(() => {
    // 임시 인증 체크
    const adminAuth = localStorage.getItem('admin-auth')
    if (adminAuth === 'true') {
      setIsAuthorized(true)
      fetchUsers()
    }
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users', {
        headers: {
          'x-admin-auth': 'master-admin-2025'
        }
      })
      
      if (!response.ok) throw new Error('Failed to fetch users')
      
      const data = await response.json()
      setUsers(data.users)
      setStats(data.stats)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'master-admin-2025'
        },
        body: JSON.stringify({
          userId,
          isActive: !currentStatus
        })
      })

      if (response.ok) {
        fetchUsers() // 목록 새로고침
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  // 필터링된 사용자 목록
  const filteredUsers = users
    .filter(user => {
      if (filterRole !== 'all' && user.role !== filterRole) return false
      if (filterStatus === 'active' && !user.isActive) return false
      if (filterStatus === 'inactive' && user.isActive) return false
      if (searchTerm && !user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !user.name?.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'MASTER': return <Crown className="h-4 w-4 text-purple-600" />
      case 'ADMIN': return <ShieldCheck className="h-4 w-4 text-blue-600" />
      default: return <User className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'MASTER': return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'ADMIN': return 'bg-blue-100 text-blue-700 border-blue-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <Shield className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <h1 className="text-2xl font-bold">관리자 인증</h1>
            <p className="text-sm text-gray-600 mt-2">관리자 비밀번호를 입력하세요</p>
          </div>
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
            placeholder="비밀번호"
            className="w-full px-4 py-2 border rounded-lg mb-4"
          />
          
          <button
            onClick={handleAuth}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            로그인
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-600 mx-auto mb-3" />
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold">드러커 관리자 대시보드</h1>
                <p className="text-sm text-gray-600">사용자 관리 시스템</p>
              </div>
            </div>
            
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              새로고침
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-6 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">전체 사용자</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-gray-400" />
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">활성 사용자</p>
                  <p className="text-2xl font-bold text-green-700">{stats.active}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-400" />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">일반 사용자</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {stats.activeUsers}/100
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full"
                      style={{ width: `${(stats.activeUsers / 100) * 100}%` }}
                    />
                  </div>
                </div>
                <User className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">마스터</p>
                  <p className="text-2xl font-bold text-purple-700">{stats.masters}</p>
                </div>
                <Crown className="h-8 w-8 text-purple-400" />
              </div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-600">관리자</p>
                  <p className="text-2xl font-bold text-indigo-700">{stats.admins}</p>
                </div>
                <ShieldCheck className="h-8 w-8 text-indigo-400" />
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">남은 자리</p>
                  <p className="text-2xl font-bold text-red-700">
                    {100 - stats.activeUsers}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="이메일 또는 이름으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">모든 역할</option>
              <option value="MASTER">마스터</option>
              <option value="ADMIN">관리자</option>
              <option value="USER">일반 사용자</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">모든 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  역할
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  활동
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가입일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{user.name || '이름 없음'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadge(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.isActive ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {user._count.contentPlans}
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {user._count.tasks}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'USER' && (
                      <button
                        onClick={() => toggleUserStatus(user.id, user.isActive)}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          user.isActive
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {user.isActive ? '비활성화' : '활성화'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">검색 결과가 없습니다</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}