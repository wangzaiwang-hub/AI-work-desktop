import { RiContractLine, RiDoorLockLine, RiErrorWarningFill } from '@remixicon/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Toast from '@/app/components/base/toast'
import { IS_CE_EDITION } from '@/config'
import { useGlobalPublicStore } from '@/context/global-public-context'
import { invitationCheck } from '@/service/common'
import { useIsLogin } from '@/service/use-common'
import { LicenseStatus } from '@/types/feature'
import { cn } from '@/utils/classnames'
import Loading from '../components/base/loading'
import MailAndCodeAuth from './components/mail-and-code-auth'
import MailAndPasswordAuth from './components/mail-and-password-auth'
import SocialAuth from './components/social-auth'
import SSOAuth from './components/sso-auth'
import WechatAuth from './components/wechat-auth'
import PhoneAuth from './components/phone-auth'
import { resolvePostLoginRedirect } from './utils/post-login-redirect'

const NormalForm = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoading: isCheckLoading, data: loginData } = useIsLogin()
  const isLoggedIn = loginData?.logged_in
  const message = decodeURIComponent(searchParams.get('message') || '')
  const invite_token = decodeURIComponent(searchParams.get('invite_token') || '')
  const [isInitCheckLoading, setInitCheckLoading] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const isLoading = isCheckLoading || isInitCheckLoading || isRedirecting
  const { systemFeatures } = useGlobalPublicStore()
  const [authType, updateAuthType] = useState<'code' | 'password' | 'phone' | 'wechat'>('password')
  const [showORLine, setShowORLine] = useState(false)
  const [allMethodsAreDisabled, setAllMethodsAreDisabled] = useState(false)
  const [workspaceName, setWorkSpaceName] = useState('')

  const isInviteLink = Boolean(invite_token && invite_token !== 'null')

  const init = useCallback(async () => {
    try {
      if (isLoggedIn) {
        setIsRedirecting(true)
        const redirectUrl = resolvePostLoginRedirect(searchParams)
        router.replace(redirectUrl || '/apps')
        return
      }

      if (message) {
        Toast.notify({
          type: 'error',
          message,
        })
      }
      setAllMethodsAreDisabled(!systemFeatures.enable_social_oauth_login && !systemFeatures.enable_email_code_login && !systemFeatures.enable_email_password_login && !systemFeatures.sso_enforced_for_signin)
      setShowORLine((systemFeatures.enable_social_oauth_login || systemFeatures.sso_enforced_for_signin) && (systemFeatures.enable_email_code_login || systemFeatures.enable_email_password_login))
      updateAuthType(systemFeatures.enable_email_password_login ? 'password' : 'code')
      if (isInviteLink) {
        const checkRes = await invitationCheck({
          url: '/activate/check',
          params: {
            token: invite_token,
          },
        })
        setWorkSpaceName(checkRes?.data?.workspace_name || '')
      }
    }
    catch (error) {
      console.error(error)
      setAllMethodsAreDisabled(true)
    }
    finally { setInitCheckLoading(false) }
  }, [isLoggedIn, message, router, invite_token, isInviteLink, systemFeatures])
  useEffect(() => {
    init()
  }, [init])
  if (isLoading) {
    return (
      <div className={
        cn(
          'flex w-full grow flex-col items-center justify-center',
          'px-6',
          'md:px-[108px]',
        )
      }
      >
        <Loading type="area" />
      </div>
    )
  }
  if (systemFeatures.license?.status === LicenseStatus.LOST) {
    return (
      <div className="mx-auto mt-8 w-full">
        <div className="relative">
          <div className="rounded-lg bg-gradient-to-r from-workflow-workflow-progress-bg-1 to-workflow-workflow-progress-bg-2 p-4">
            <div className="shadows-shadow-lg relative mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-components-card-bg shadow">
              <RiContractLine className="h-5 w-5" />
              <RiErrorWarningFill className="absolute -right-1 -top-1 h-4 w-4 text-text-warning-secondary" />
            </div>
            <p className="system-sm-medium text-text-primary">{t('licenseLost', { ns: 'login' })}</p>
            <p className="system-xs-regular mt-1 text-text-tertiary">{t('licenseLostTip', { ns: 'login' })}</p>
          </div>
        </div>
      </div>
    )
  }
  if (systemFeatures.license?.status === LicenseStatus.EXPIRED) {
    return (
      <div className="mx-auto mt-8 w-full">
        <div className="relative">
          <div className="rounded-lg bg-gradient-to-r from-workflow-workflow-progress-bg-1 to-workflow-workflow-progress-bg-2 p-4">
            <div className="shadows-shadow-lg relative mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-components-card-bg shadow">
              <RiContractLine className="h-5 w-5" />
              <RiErrorWarningFill className="absolute -right-1 -top-1 h-4 w-4 text-text-warning-secondary" />
            </div>
            <p className="system-sm-medium text-text-primary">{t('licenseExpired', { ns: 'login' })}</p>
            <p className="system-xs-regular mt-1 text-text-tertiary">{t('licenseExpiredTip', { ns: 'login' })}</p>
          </div>
        </div>
      </div>
    )
  }
  if (systemFeatures.license?.status === LicenseStatus.INACTIVE) {
    return (
      <div className="mx-auto mt-8 w-full">
        <div className="relative">
          <div className="rounded-lg bg-gradient-to-r from-workflow-workflow-progress-bg-1 to-workflow-workflow-progress-bg-2 p-4">
            <div className="shadows-shadow-lg relative mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-components-card-bg shadow">
              <RiContractLine className="h-5 w-5" />
              <RiErrorWarningFill className="absolute -right-1 -top-1 h-4 w-4 text-text-warning-secondary" />
            </div>
            <p className="system-sm-medium text-text-primary">{t('licenseInactive', { ns: 'login' })}</p>
            <p className="system-xs-regular mt-1 text-text-tertiary">{t('licenseInactiveTip', { ns: 'login' })}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full">
        {isInviteLink
          ? (
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  加入 {workspaceName}
                </h2>
                {!systemFeatures.branding.enabled && (
                  <p className="text-gray-600">
                    您已被邀请加入 {workspaceName} 工作空间
                  </p>
                )}
              </div>
            )
          : (
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {systemFeatures.branding.enabled ? '登录' : '欢迎回来'}
                </h2>
                <p className="text-gray-600">选择您喜欢的登录方式</p>
              </div>
            )}
        <div className="relative">
          {/* 登录方式选择 */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => updateAuthType('password')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  authType === 'password' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                邮箱密码
              </button>
              <button
                type="button"
                onClick={() => updateAuthType('code')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  authType === 'code' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                邮箱验证码
              </button>
              <button
                type="button"
                onClick={() => updateAuthType('phone')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  authType === 'phone' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                手机号
              </button>
              <button
                type="button"
                onClick={() => updateAuthType('wechat')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  authType === 'wechat' 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                微信登录
              </button>
            </div>
          </div>

          {/* 社交登录 */}
          <div className="flex flex-col gap-3 mb-6">
            {systemFeatures.enable_social_oauth_login && <SocialAuth />}
            {systemFeatures.sso_enforced_for_signin && (
              <div className="w-full">
                <SSOAuth protocol={systemFeatures.sso_enforced_for_signin_protocol} />
              </div>
            )}
          </div>

          {/* 分割线 */}
          {(systemFeatures.enable_social_oauth_login || systemFeatures.sso_enforced_for_signin) && (
            <div className="relative my-6">
              <div className="flex items-center">
                <div className="h-px flex-1 bg-gray-200"></div>
                <span className="px-4 text-sm text-gray-500 bg-white">或</span>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>
            </div>
          )}

          {/* 登录表单 */}
          <div className="space-y-4">
            {authType === 'password' && systemFeatures.enable_email_password_login && (
              <MailAndPasswordAuth isInvite={isInviteLink} isEmailSetup={systemFeatures.is_email_setup} allowRegistration={systemFeatures.is_allow_register} />
            )}
            
            {authType === 'code' && systemFeatures.enable_email_code_login && (
              <MailAndCodeAuth isInvite={isInviteLink} />
            )}
            
            {authType === 'phone' && (
              <PhoneAuth isInvite={isInviteLink} />
            )}
            
            {authType === 'wechat' && (
              <WechatAuth />
            )}
          </div>

          {systemFeatures.is_allow_register && authType === 'password' && (
            <div className="mt-6 text-center text-sm text-gray-600">
              <span>还没有账号？</span>
              <Link
                className="text-blue-600 hover:text-blue-700 ml-1"
                href="/signup"
              >
                立即注册
              </Link>
            </div>
          )}
          {allMethodsAreDisabled && (
            <>
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <div className="flex items-center mb-2">
                  <RiDoorLockLine className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-sm font-medium text-red-800">无可用登录方式</p>
                </div>
                <p className="text-sm text-red-700">请联系管理员配置登录方式</p>
              </div>
            </>
          )}
          {!systemFeatures.branding.enabled && (
            <>
              <div className="mt-6 text-xs text-gray-500 text-center">
                登录即表示您同意我们的
                <Link
                  className="text-blue-600 hover:text-blue-700 mx-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://dify.ai/terms"
                >
                  服务条款
                </Link>
                和
                <Link
                  className="text-blue-600 hover:text-blue-700 ml-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://dify.ai/privacy"
                >
                  隐私政策
                </Link>
              </div>
              {IS_CE_EDITION && (
                <div className="mt-2 text-xs text-gray-500 text-center">
                  需要初始化系统？
                  <Link
                    className="text-blue-600 hover:text-blue-700 ml-1"
                    href="/install"
                  >
                    设置管理员账户
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default NormalForm
