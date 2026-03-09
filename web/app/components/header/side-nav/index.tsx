'use client'

import {
  RiApps2Line,
  RiCodeLine,
  RiDashboardFill,
  RiDashboardLine,
  RiDatabase2Fill,
  RiDatabase2Line,
  RiExchange2Line,
  RiFile4Line,
  RiFileShield2Line,
  RiFolderShield2Line,
  RiHammerFill,
  RiHammerLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiArrowGoBackLine,
  RiLogoutBoxRLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiMessage3Line,
  RiPlanetFill,
  RiPlanetLine,
  RiPlugLine,
  RiPuzzle2Fill,
  RiPuzzle2Line,
  RiRobot3Line,
  RiShieldCheckFill,
  RiShieldCheckLine,
  RiToolsLine,
} from '@remixicon/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSearchParams, useSelectedLayoutSegment } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAppContext } from '@/context/app-context'
import { cn } from '@/utils/classnames'
import AccountDropdown from '../account-dropdown'
import EnvNav from '../env-nav'
import { useLogout } from '@/service/use-common'

interface SubItemConfig {
  id: string
  href: string
  icon: React.ReactNode
  label: string
}

interface NavItemConfig {
  id: string
  href: string
  icon: React.ReactNode
  activeIcon: React.ReactNode
  label: string
  segments: string[]
  children?: SubItemConfig[]
  /** query param name used for child active detection */
  childParam?: string
  /** default child id when no param is set */
  childDefault?: string
}

const SideNav = () => {
  const segment = useSelectedLayoutSegment()
  const searchParams = useSearchParams()
  const { isCurrentWorkspaceEditor, isCurrentWorkspaceDatasetOperator, userProfile } = useAppContext()
  const router = useRouter()
  const { mutateAsync: logout } = useLogout()

  const handleLogout = async () => {
    await logout()
    localStorage.removeItem('setup_status')
    router.push('/signin')
  }
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined')
      return localStorage.getItem('side_nav_collapsed') === 'true'
    return false
  })

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('side_nav_collapsed', String(next))
      return next
    })
  }

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // 工作台子菜单
  const appsChildren: SubItemConfig[] = [
    { id: 'all', href: '/apps?category=all', icon: <RiApps2Line className="h-4 w-4" />, label: '全部' },
    { id: 'workflow', href: '/apps?category=workflow', icon: <RiExchange2Line className="h-4 w-4" />, label: '工作流' },
    { id: 'advanced-chat', href: '/apps?category=advanced-chat', icon: <RiMessage3Line className="h-4 w-4" />, label: 'Chatflow' },
    { id: 'chat', href: '/apps?category=chat', icon: <RiMessage3Line className="h-4 w-4" />, label: '聊天助手' },
    { id: 'agent-chat', href: '/apps?category=agent-chat', icon: <RiRobot3Line className="h-4 w-4" />, label: 'Agent' },
    { id: 'completion', href: '/apps?category=completion', icon: <RiFile4Line className="h-4 w-4" />, label: '文本生成' },
  ]

  const navItems: NavItemConfig[] = []

  // 工作台 (原 apps)
  if (!isCurrentWorkspaceDatasetOperator) {
    navItems.push({
      id: 'apps',
      href: '/apps',
      icon: <RiDashboardLine className="h-5 w-5" />,
      activeIcon: <RiDashboardFill className="h-5 w-5" />,
      label: '工作台',
      segments: ['apps', 'app'],
      children: appsChildren,
      childParam: 'category',
      childDefault: 'all',
    })
  }

  // 脱敏沙箱子菜单
  const dataMaskingChildren: SubItemConfig[] = [
    { id: 'mask', href: '/data-masking?tab=mask', icon: <RiFileShield2Line className="h-4 w-4" />, label: '文件脱敏' },
    { id: 'restore', href: '/data-masking?tab=restore', icon: <RiArrowGoBackLine className="h-4 w-4" />, label: '脱敏还原' },
    { id: 'rules', href: '/data-masking?tab=rules', icon: <RiShieldCheckLine className="h-4 w-4" />, label: '脱敏规则' },
    { id: 'files', href: '/data-masking?tab=files', icon: <RiFolderShield2Line className="h-4 w-4" />, label: '文件管理' },
    { id: 'transfer', href: '/data-masking?tab=transfer', icon: <RiExchange2Line className="h-4 w-4" />, label: '导出导入' },
  ]

  // 脱敏沙箱
  if (!isCurrentWorkspaceDatasetOperator) {
    navItems.push({
      id: 'data-masking',
      href: '/data-masking',
      icon: <RiShieldCheckLine className="h-5 w-5" />,
      activeIcon: <RiShieldCheckFill className="h-5 w-5" />,
      label: '脱敏沙箱',
      segments: ['data-masking'],
      children: dataMaskingChildren,
      childParam: 'tab',
      childDefault: 'mask',
    })
  }

  // 探索
  if (!isCurrentWorkspaceDatasetOperator) {
    navItems.push({
      id: 'explore',
      href: '/explore/apps',
      icon: <RiPlanetLine className="h-5 w-5" />,
      activeIcon: <RiPlanetFill className="h-5 w-5" />,
      label: '探索',
      segments: ['explore'],
    })
  }

  // 知识库
  if (isCurrentWorkspaceEditor || isCurrentWorkspaceDatasetOperator) {
    navItems.push({
      id: 'datasets',
      href: '/datasets',
      icon: <RiDatabase2Line className="h-5 w-5" />,
      activeIcon: <RiDatabase2Fill className="h-5 w-5" />,
      label: '知识库',
      segments: ['datasets'],
    })
  }

  // 工具子菜单
  const toolsChildren: SubItemConfig[] = [
    { id: 'builtin', href: '/tools?category=builtin', icon: <RiToolsLine className="h-4 w-4" />, label: '工具' },
    { id: 'api', href: '/tools?category=api', icon: <RiCodeLine className="h-4 w-4" />, label: '自定义' },
    { id: 'workflow', href: '/tools?category=workflow', icon: <RiExchange2Line className="h-4 w-4" />, label: '工作流' },
    { id: 'mcp', href: '/tools?category=mcp', icon: <RiPlugLine className="h-4 w-4" />, label: 'MCP' },
  ]

  // 工具
  if (!isCurrentWorkspaceDatasetOperator) {
    navItems.push({
      id: 'tools',
      href: '/tools',
      icon: <RiHammerLine className="h-5 w-5" />,
      activeIcon: <RiHammerFill className="h-5 w-5" />,
      label: '工具',
      segments: ['tools'],
      children: toolsChildren,
      childParam: 'category',
      childDefault: 'builtin',
    })
  }

  // 插件
  if (!isCurrentWorkspaceDatasetOperator) {
    navItems.push({
      id: 'plugins',
      href: '/plugins',
      icon: <RiPuzzle2Line className="h-5 w-5" />,
      activeIcon: <RiPuzzle2Fill className="h-5 w-5" />,
      label: '插件',
      segments: ['plugins'],
    })
  }

  // 审计日志
  if (!isCurrentWorkspaceDatasetOperator) {
    navItems.push({
      id: 'audit-logs',
      href: '/audit-logs',
      icon: <RiFileShield2Line className="h-5 w-5" />,
      activeIcon: <RiFileShield2Line className="h-5 w-5" />,
      label: '审计日志',
      segments: ['audit-logs'],
    })
  }

  // Auto-expand the active nav item on mount / segment change
  useEffect(() => {
    const activeItem = navItems.find(item => item.segments.includes(segment ?? ''))
    if (activeItem?.children?.length) {
      setExpandedItems((prev) => {
        if (prev.has(activeItem.id)) return prev
        const next = new Set(prev)
        next.add(activeItem.id)
        return next
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment])

  return (
    <div
      className={cn(
        'flex h-full flex-col shrink-0 bg-[#1a1f2e] transition-all duration-200',
        collapsed ? 'w-[60px]' : 'w-[240px]',
      )}
    >
      {/* Logo + tagline + collapse */}
      <div className={cn(
        'flex items-center shrink-0 border-b border-white/10',
        collapsed ? 'flex-col gap-1 px-2 py-4' : 'justify-between px-4 py-4',
      )}>
        <Link href="/apps" className="flex items-center gap-4 shrink-0">
          <div className={cn(
            'rounded-xl border border-white/20 overflow-hidden shrink-0',
            collapsed ? 'w-8 h-8' : 'w-12 h-12',
          )}>
            <img
              src="/logo/CheersAI.png"
              alt="CheersAI"
              className="w-full h-full object-cover scale-125"
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-white/90 text-xs font-medium">省心用</span>
              <span className="text-white/90 text-xs font-medium">安心用</span>
              <span className="text-white/90 text-xs font-medium">领先用</span>
            </div>
          )}
        </Link>
        <button
          onClick={toggleCollapsed}
          className="p-1 rounded text-white/40 hover:text-white/80 hover:bg-white/5"
          title={collapsed ? '展开导航' : '收起导航'}
        >
          {collapsed
            ? <RiMenuUnfoldLine className="w-4 h-4" />
            : <RiMenuFoldLine className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3 py-2 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = item.segments.includes(segment ?? '')
          const hasChildren = item.children && item.children.length > 0
          const isExpanded = expandedItems.has(item.id)
          const showChildren = isExpanded && hasChildren && !collapsed

          const handleItemClick = (e: React.MouseEvent) => {
            if (hasChildren && !collapsed) {
              e.preventDefault()
              setExpandedItems((prev) => {
                const next = new Set(prev)
                if (next.has(item.id))
                  next.delete(item.id)
                else
                  next.add(item.id)
                return next
              })
              // Navigate if not already on this section
              if (!isActive)
                router.push(item.href)
            }
          }

          return (
            <div key={item.id}>
              <Link
                href={item.href}
                onClick={handleItemClick}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-xl transition-colors w-full',
                  collapsed ? 'justify-center px-0 py-3' : 'px-4 py-3',
                  isActive && !showChildren
                    ? 'bg-[#2563eb] text-white font-medium'
                    : isActive
                      ? 'bg-white/10 text-white font-medium'
                      : 'text-white/70 hover:bg-white/5 hover:text-white',
                )}
              >
                <span className="shrink-0">
                  {isActive ? item.activeIcon : item.icon}
                </span>
                {!collapsed && (
                  <>
                    <span className="text-sm truncate flex-1">
                      {item.label}
                    </span>
                    {hasChildren && (
                      <span className="shrink-0 text-white/40">
                        {isExpanded
                          ? <RiArrowDownSLine className="w-4 h-4" />
                          : <RiArrowRightSLine className="w-4 h-4" />}
                      </span>
                    )}
                  </>
                )}
              </Link>
              {/* Sub-items */}
              {showChildren && (
                <div className="mt-0.5 ml-4 flex flex-col gap-0.5">
                  {item.children!.map((child) => {
                    const paramValue = item.childParam ? (searchParams.get(item.childParam) || item.childDefault) : ''
                    const isChildActive = isActive && paramValue === child.id
                    return (
                      <Link
                        key={child.id}
                        href={child.href}
                        className={cn(
                          'flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors text-[13px]',
                          isChildActive
                            ? 'bg-[#2563eb] text-white font-medium'
                            : 'text-white/60 hover:bg-white/5 hover:text-white/90',
                        )}
                      >
                        <span className="shrink-0">{child.icon}</span>
                        <span className="truncate">{child.label}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Bottom: env, account */}
      <div className="shrink-0 border-t border-white/5 px-3 py-3 flex flex-col gap-2">
        {!collapsed
          ? (
            <>
              <EnvNav />
              <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <AccountDropdown />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-white/90 text-sm font-medium truncate">{userProfile.name}</span>
                  <span className="text-white/50 text-xs truncate">{userProfile.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="shrink-0 p-1.5 rounded-md text-white/30 hover:text-white/80 hover:bg-white/10 transition-colors"
                  title="退出登录"
                >
                  <RiLogoutBoxRLine className="w-4 h-4" />
                </button>
              </div>
            </>
          )
          : (
            <div className="flex justify-center w-full">
              <AccountDropdown />
            </div>
          )}
      </div>
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default SideNav
