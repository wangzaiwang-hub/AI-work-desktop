'use client'
import { useGlobalPublicStore } from '@/context/global-public-context'

import useDocumentTitle from '@/hooks/use-document-title'
import { cn } from '@/utils/classnames'

export default function SignInLayout({ children }: any) {
  const { systemFeatures } = useGlobalPublicStore()
  useDocumentTitle('')
  return (
    <>
      <div className="min-h-screen w-full bg-white flex items-center justify-center p-4">
        {/* 居中的登录卡片 */}
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden relative">
          {/* Logo区域 - 左上角 */}
          <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
            <img 
              src="/logo/logo-monochrome-white.png" 
              alt="CheersAI Logo" 
              className="w-10 h-10 rounded-xl"
            />
            <span className="text-xl font-bold text-white">CheersAI企业版</span>
          </div>

          <div className="flex min-h-[600px]">
            {/* 左侧宣传区域 */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 relative overflow-hidden">
              {/* 背景装饰 */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
              
              <div className="relative z-10 flex flex-col justify-center px-8 py-8 text-white pt-20">
                {/* 主标题 */}
                <h1 className="text-3xl font-bold mb-6 leading-tight">
                  开启智能办公新体验
                </h1>
                
                {/* 副标题 */}
                <p className="text-lg mb-8 text-blue-100">
                  企业级AI助手平台，提升团队协作效率
                </p>

                {/* 特性列表 */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-blue-100">【智能对话】多模态AI交互体验</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-blue-100">【数据安全】企业级安全防护</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-blue-100">【工作流程】智能化业务流程</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-blue-100">【团队协作】高效协同办公</span>
                  </div>
                </div>

                {/* 底部插图区域 */}
                <div className="flex justify-center mt-auto">
                  <div className="w-56 h-36 bg-white/10 rounded-xl backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <span className="text-2xl">🤖</span>
                      </div>
                      <p className="text-sm text-blue-100">智能AI助手</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧登录区域 */}
            <div className="w-full md:w-1/2 flex flex-col bg-gray-50">
              {/* 头部 */}
              <div className="flex justify-end items-center p-6">
                <div>
                  <span className="text-xs text-gray-500">还没有账号？</span>
                  <a href="/signup" className="text-xs text-blue-600 hover:text-blue-700 ml-1">立即注册</a>
                </div>
              </div>

              {/* 登录表单区域 */}
              <div className="flex-1 flex items-center justify-center px-6">
                <div className="w-full max-w-sm">
                  {children}
                </div>
              </div>

              {/* 底部版权 */}
              {systemFeatures.branding.enabled === false && (
                <div className="p-6 text-center">
                  <p className="text-xs text-gray-400">
                    © {new Date().getFullYear()} CheersAI. All rights reserved.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
