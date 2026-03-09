'use client'
import * as React from 'react'
import { useParams } from 'next/navigation'
import Main from '@/app/components/explore/installed-app'

export default function InstalledAppClient() {
  const params = useParams()
  const appId = params.appId as string
  return <Main id={appId} />
}
