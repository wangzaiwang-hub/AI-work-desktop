import type { FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/app/components/base/button'
import Input from '@/app/components/base/input'
import Toast from '@/app/components/base/toast'
import { COUNT_DOWN_KEY, COUNT_DOWN_TIME_MS } from '@/app/components/signin/countdown'
import { useLocale } from '@/context/i18n'

type PhoneAuthProps = {
  isInvite: boolean
}

export default function PhoneAuth({ isInvite }: PhoneAuthProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setIsLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const locale = useLocale()

  // 手机号验证正则
  const phoneRegex = /^1[3-9]\d{9}$/

  const handleSendCode = async () => {
    try {
      if (!phone) {
        Toast.notify({ type: 'error', message: '请输入手机号' })
        return
      }

      if (!phoneRegex.test(phone)) {
        Toast.notify({
          type: 'error',
          message: '请输入正确的手机号格式',
        })
        return
      }

      setIsLoading(true)
      
      // 这里应该调用后端API发送短信验证码
      // const ret = await sendPhoneCode(phone, locale)
      
      // 临时模拟成功响应
      const ret = { result: 'success', data: 'mock-token' }
      
      if (ret.result === 'success') {
        setCodeSent(true)
        setCountdown(60)
        
        // 开始倒计时
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
        
        Toast.notify({ type: 'success', message: '验证码已发送' })
      }
    } catch (error) {
      console.error(error)
      Toast.notify({ type: 'error', message: '发送验证码失败' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    try {
      if (!code) {
        Toast.notify({ type: 'error', message: '请输入验证码' })
        return
      }

      if (code.length !== 6) {
        Toast.notify({ type: 'error', message: '请输入6位验证码' })
        return
      }

      setIsLoading(true)
      
      // 这里应该调用后端API验证手机号和验证码
      // const ret = await verifyPhoneCode(phone, code)
      
      // 临时模拟登录成功
      Toast.notify({ type: 'success', message: '登录成功' })
      router.push('/apps')
      
    } catch (error) {
      console.error(error)
      Toast.notify({ type: 'error', message: '登录失败' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!codeSent) {
      handleSendCode()
    } else {
      handleLogin()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" className="hidden" />
      
      <div className="mb-4">
        <label htmlFor="phone" className="system-md-semibold my-2 text-text-secondary">
          手机号
        </label>
        <div className="mt-1">
          <Input 
            id="phone" 
            type="tel" 
            disabled={isInvite || codeSent} 
            value={phone} 
            placeholder="请输入手机号" 
            onChange={e => setPhone(e.target.value)} 
          />
        </div>
      </div>

      {codeSent && (
        <div className="mb-4">
          <label htmlFor="code" className="system-md-semibold my-2 text-text-secondary">
            验证码
          </label>
          <div className="mt-1 flex gap-2">
            <Input 
              id="code" 
              type="text" 
              value={code} 
              placeholder="请输入6位验证码" 
              maxLength={6}
              onChange={e => setCode(e.target.value)} 
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              disabled={countdown > 0 || loading}
              onClick={handleSendCode}
              className="whitespace-nowrap"
            >
              {countdown > 0 ? `${countdown}s` : '重新发送'}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4">
        <Button 
          type="submit" 
          loading={loading} 
          disabled={loading || !phone || (codeSent && !code)} 
          variant="primary" 
          className="w-full"
        >
          {codeSent ? '登录' : '获取验证码'}
        </Button>
      </div>

      {codeSent && (
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => {
              setCodeSent(false)
              setCode('')
              setCountdown(0)
            }}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            更换手机号
          </button>
        </div>
      )}
    </form>
  )
}