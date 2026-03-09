'use client'
import { useSelectedLayoutSegment } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import {
  RiCheckLine,
  RiEyeOffLine,
  RiShieldCheckFill,
  RiShieldCheckLine,
} from '@remixicon/react'
import { cn } from '@/utils/classnames'
import Link from 'next/link'

type DataMaskingNavProps = {
  className?: string
}

const DataMaskingNav = ({ className }: DataMaskingNavProps) => {
  const { t } = useTranslation()
  const selectedSegment = useSelectedLayoutSegment()
  const isActive = selectedSegment === 'data-masking'

  return (
    <Link
      href="/data-masking"
      className={cn(
        'group text-sm font-medium',
        isActive && 'hover:bg-components-main-nav-nav-button-bg-active-hover bg-components-main-nav-nav-button-bg-active font-semibold shadow-md',
        isActive ? 'text-components-main-nav-nav-button-text-active' : 'text-components-main-nav-nav-button-text hover:bg-components-main-nav-nav-button-bg-hover',
        className,
      )}
    >
      {
        isActive
          ? <RiShieldCheckFill className="h-4 w-4" />
          : <RiShieldCheckLine className="h-4 w-4" />
      }
      <div className="ml-2 max-[1024px]:hidden">
        {t('menus.dataMasking', { ns: 'common' })}
      </div>
    </Link>
  )
}

export default DataMaskingNav
