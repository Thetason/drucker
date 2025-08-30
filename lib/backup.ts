// 자동 백업 및 복구 기능

export interface BackupData {
  persona?: any
  plans?: any[]
  tasks?: any[]
  exportDate: string
  version: string
}

export class DataBackupManager {
  private static BACKUP_KEY = 'drucker-backup'
  private static BACKUP_HISTORY_KEY = 'drucker-backup-history'
  private static MAX_BACKUPS = 5

  // 자동 백업 (매번 데이터 저장 시 호출)
  static autoBackup() {
    try {
      const backup: BackupData = {
        persona: localStorage.getItem('drucker-persona') ? 
          JSON.parse(localStorage.getItem('drucker-persona')!) : null,
        plans: localStorage.getItem('drucker-plans') ? 
          JSON.parse(localStorage.getItem('drucker-plans')!) : [],
        tasks: localStorage.getItem('drucker-tasks') ? 
          JSON.parse(localStorage.getItem('drucker-tasks')!) : [],
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      }

      // 최신 백업 저장
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backup))

      // 백업 히스토리 관리
      this.updateBackupHistory(backup)

      return true
    } catch (error) {
      console.error('백업 실패:', error)
      return false
    }
  }

  // 백업 히스토리 업데이트
  private static updateBackupHistory(backup: BackupData) {
    try {
      let history: BackupData[] = []
      const historyStr = localStorage.getItem(this.BACKUP_HISTORY_KEY)
      
      if (historyStr) {
        history = JSON.parse(historyStr)
      }

      // 새 백업 추가
      history.unshift(backup)

      // 최대 개수 유지
      if (history.length > this.MAX_BACKUPS) {
        history = history.slice(0, this.MAX_BACKUPS)
      }

      localStorage.setItem(this.BACKUP_HISTORY_KEY, JSON.stringify(history))
    } catch (error) {
      console.error('백업 히스토리 업데이트 실패:', error)
    }
  }

  // 데이터 복구
  static restore(backupData?: BackupData) {
    try {
      let backup = backupData

      // 백업 데이터가 없으면 최신 백업 사용
      if (!backup) {
        const backupStr = localStorage.getItem(this.BACKUP_KEY)
        if (!backupStr) {
          throw new Error('복구할 백업이 없습니다')
        }
        backup = JSON.parse(backupStr)
      }

      // 데이터 복원
      if (backup.persona) {
        localStorage.setItem('drucker-persona', JSON.stringify(backup.persona))
      }
      if (backup.plans) {
        localStorage.setItem('drucker-plans', JSON.stringify(backup.plans))
      }
      if (backup.tasks) {
        localStorage.setItem('drucker-tasks', JSON.stringify(backup.tasks))
      }

      return true
    } catch (error) {
      console.error('복구 실패:', error)
      return false
    }
  }

  // 백업 내보내기 (다운로드)
  static exportBackup() {
    try {
      const backup: BackupData = {
        persona: localStorage.getItem('drucker-persona') ? 
          JSON.parse(localStorage.getItem('drucker-persona')!) : null,
        plans: localStorage.getItem('drucker-plans') ? 
          JSON.parse(localStorage.getItem('drucker-plans')!) : [],
        tasks: localStorage.getItem('drucker-tasks') ? 
          JSON.parse(localStorage.getItem('drucker-tasks')!) : [],
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      }

      const dataStr = JSON.stringify(backup, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `drucker-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      return true
    } catch (error) {
      console.error('내보내기 실패:', error)
      return false
    }
  }

  // 백업 가져오기 (파일 업로드)
  static async importBackup(file: File): Promise<boolean> {
    try {
      const text = await file.text()
      const backup: BackupData = JSON.parse(text)

      // 데이터 검증
      if (!backup.exportDate || !backup.version) {
        throw new Error('유효하지 않은 백업 파일입니다')
      }

      return this.restore(backup)
    } catch (error) {
      console.error('가져오기 실패:', error)
      return false
    }
  }

  // 백업 히스토리 가져오기
  static getBackupHistory(): BackupData[] {
    try {
      const historyStr = localStorage.getItem(this.BACKUP_HISTORY_KEY)
      return historyStr ? JSON.parse(historyStr) : []
    } catch (error) {
      console.error('백업 히스토리 로드 실패:', error)
      return []
    }
  }

  // 모든 백업 삭제
  static clearAllBackups() {
    localStorage.removeItem(this.BACKUP_KEY)
    localStorage.removeItem(this.BACKUP_HISTORY_KEY)
  }
}