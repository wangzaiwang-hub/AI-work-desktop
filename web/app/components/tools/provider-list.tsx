'use client'
import type { Collection } from './types'
import { useQueryState } from 'nuqs'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RiArrowRightUpLine, RiArrowUpDoubleLine } from '@remixicon/react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import { useLocale } from '#i18n'
import Input from '@/app/components/base/input'
import Loading from '@/app/components/base/loading'
import Card from '@/app/components/plugins/card'
import CardMoreInfo from '@/app/components/plugins/card/card-more-info'
import { useTags } from '@/app/components/plugins/hooks'
import Empty from '@/app/components/plugins/marketplace/empty'
import List from '@/app/components/plugins/marketplace/list'
import PluginDetailPanel from '@/app/components/plugins/plugin-detail-panel'
import LabelFilter from '@/app/components/tools/labels/filter'
import CustomCreateCard from '@/app/components/tools/provider/custom-create-card'
import ProviderDetail from '@/app/components/tools/provider/detail'
import WorkflowToolEmpty from '@/app/components/tools/provider/empty'
import { useGlobalPublicStore } from '@/context/global-public-context'
import { useCheckInstalled, useInvalidateInstalledPluginList } from '@/service/use-plugins'
import { useAllToolProviders } from '@/service/use-tools'
import { cn } from '@/utils/classnames'
import { getMarketplaceUrl } from '@/utils/var'
import { ToolTypeEnum } from '../workflow/block-selector/types'
import { useMarketplace } from './marketplace/hooks'
import MCPList from './mcp'

const getToolType = (type: string) => {
  switch (type) {
    case 'builtin':
      return ToolTypeEnum.BuiltIn
    case 'api':
      return ToolTypeEnum.Custom
    case 'workflow':
      return ToolTypeEnum.Workflow
    case 'mcp':
      return ToolTypeEnum.MCP
    default:
      return ToolTypeEnum.BuiltIn
  }
}
const ProviderList = () => {
  // const searchParams = useSearchParams()
  // searchParams.get('category') === 'workflow'
  const { t } = useTranslation()
  const { getTagLabel } = useTags()
  const locale = useLocale()
  const { theme } = useTheme()
  const { enable_marketplace } = useGlobalPublicStore(s => s.systemFeatures)
  const containerRef = useRef<HTMLDivElement>(null)

  const [activeTab, setActiveTab] = useQueryState('category', {
    defaultValue: 'builtin',
  })
  const [tagFilterValue, setTagFilterValue] = useState<string[]>([])
  const handleTagsChange = (value: string[]) => {
    setTagFilterValue(value)
  }
  const [keywords, setKeywords] = useState<string>('')
  const handleKeywordsChange = (value: string) => {
    setKeywords(value)
  }
  const { data: collectionList = [], refetch } = useAllToolProviders()
  const filteredCollectionList = useMemo(() => {
    return collectionList.filter((collection) => {
      if (collection.type !== activeTab)
        return false
      if (tagFilterValue.length > 0 && (!collection.labels || collection.labels.every(label => !tagFilterValue.includes(label))))
        return false
      if (keywords)
        return Object.values(collection.label).some(value => value.toLowerCase().includes(keywords.toLowerCase()))
      return true
    })
  }, [activeTab, tagFilterValue, keywords, collectionList])

  const [currentProviderId, setCurrentProviderId] = useState<string | undefined>()
  const currentProvider = useMemo<Collection | undefined>(() => {
    return filteredCollectionList.find(collection => collection.id === currentProviderId)
  }, [currentProviderId, filteredCollectionList])
  const { data: checkedInstalledData } = useCheckInstalled({
    pluginIds: currentProvider?.plugin_id ? [currentProvider.plugin_id] : [],
    enabled: !!currentProvider?.plugin_id,
  })
  const invalidateInstalledPluginList = useInvalidateInstalledPluginList()
  const currentPluginDetail = useMemo(() => {
    return checkedInstalledData?.plugins?.[0]
  }, [checkedInstalledData])

  const showMarketplacePanel = useCallback(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [])

  const marketplaceContext = useMarketplace(keywords, tagFilterValue)
  const {
    handleScroll,
  } = marketplaceContext

  const [isMarketplaceArrowVisible, setIsMarketplaceArrowVisible] = useState(true)
  const onContainerScroll = useMemo(() => {
    return (e: Event) => {
      handleScroll(e)
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current
        setIsMarketplaceArrowVisible(scrollTop + clientHeight < scrollHeight - 50)
      }
    }
  }, [handleScroll])

  useEffect(() => {
    const container = containerRef.current
    if (container)
      container.addEventListener('scroll', onContainerScroll)

    return () => {
      if (container)
        container.removeEventListener('scroll', onContainerScroll)
    }
  }, [onContainerScroll])

  return (
    <>
      <div className="relative flex h-0 shrink-0 grow overflow-hidden">
        <div
          ref={containerRef}
          className="relative flex grow flex-col overflow-y-auto bg-background-body"
        >
          <div className={cn(
            'sticky top-0 z-10 flex flex-wrap items-center justify-end gap-y-2 bg-background-body px-12 pb-2 pt-4 leading-[56px]',
            currentProviderId && 'pr-6',
          )}
          >
            <div className="flex items-center gap-2">
              {activeTab !== 'mcp' && (
                <LabelFilter value={tagFilterValue} onChange={handleTagsChange} />
              )}
              <Input
                showLeftIcon
                showClearIcon
                wrapperClassName="w-[200px]"
                value={keywords}
                onChange={e => handleKeywordsChange(e.target.value)}
                onClear={() => handleKeywordsChange('')}
              />
            </div>
          </div>
          {activeTab !== 'mcp' && (
            <div className={cn(
              'relative grid shrink-0 grid-cols-1 content-start gap-4 px-12 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
              !filteredCollectionList.length && activeTab === 'workflow' && 'grow',
              enable_marketplace && activeTab === 'builtin' ? 'pb-2' : 'pb-4',
            )}
            >
              {activeTab === 'api' && <CustomCreateCard onRefreshData={refetch} />}
              {filteredCollectionList.map(collection => (
                <div
                  key={collection.id}
                  onClick={() => setCurrentProviderId(collection.id)}
                >
                  <Card
                    className={cn(
                      'cursor-pointer border-[1.5px] border-transparent',
                      currentProviderId === collection.id && 'border-components-option-card-option-selected-border',
                    )}
                    hideCornerMark
                    payload={{
                      ...collection,
                      brief: collection.description,
                      org: collection.plugin_id ? collection.plugin_id.split('/')[0] : '',
                      name: collection.plugin_id ? collection.plugin_id.split('/')[1] : collection.name,
                    } as any}
                    footer={(
                      <CardMoreInfo
                        tags={collection.labels?.map(label => getTagLabel(label)) || []}
                      />
                    )}
                  />
                </div>
              ))}
              {!filteredCollectionList.length && activeTab === 'workflow' && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><WorkflowToolEmpty type={getToolType(activeTab)} /></div>}
            </div>
          )}
          {!filteredCollectionList.length && activeTab === 'builtin' && (
            <Empty lightCard text={t('noTools', { ns: 'tools' })} className="h-[224px] shrink-0 px-12" />
          )}
          {enable_marketplace && activeTab === 'builtin' && (
            <div className="shrink-0 bg-background-default-subtle px-12 pb-2">
              {
                marketplaceContext.isLoading && marketplaceContext.page === 1 && (
                  <div className="flex items-center justify-center py-12">
                    <Loading />
                  </div>
                )
              }
              {
                (!marketplaceContext.isLoading || marketplaceContext.page > 1) && (
                  <List
                    marketplaceCollections={marketplaceContext.marketplaceCollections || []}
                    marketplaceCollectionPluginsMap={marketplaceContext.marketplaceCollectionPluginsMap || {}}
                    plugins={marketplaceContext.plugins}
                    showInstallButton
                  />
                )
              }
            </div>
          )}
          {activeTab === 'mcp' && (
            <MCPList searchText={keywords} />
          )}
        </div>
        {enable_marketplace && activeTab === 'builtin' && (
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-background-default-subtle shadow-[0_-4px_12px_rgba(0,0,0,0.08)] border-t border-divider-subtle">
            <div className="flex shrink-0 flex-col px-12 pb-[14px] pt-2">
              {isMarketplaceArrowVisible && (
                <RiArrowUpDoubleLine
                  className="absolute left-1/2 top-2 z-10 h-4 w-4 -translate-x-1/2 cursor-pointer text-text-quaternary"
                  onClick={showMarketplacePanel}
                />
              )}
              <div className="pb-3 pt-4">
                <div className="title-2xl-semi-bold bg-gradient-to-r from-[rgba(11,165,236,0.95)] to-[rgba(21,90,239,0.95)] bg-clip-text text-transparent">
                  {t('marketplace.moreFrom', { ns: 'plugin' })}
                </div>
                <div className="body-md-regular flex items-center text-center text-text-tertiary">
                  {t('marketplace.discover', { ns: 'plugin' })}
                  <span className="body-md-medium relative ml-1 text-text-secondary after:absolute after:bottom-[1.5px] after:left-0 after:h-2 after:w-full after:bg-text-text-selected after:content-['']">
                    {t('category.models', { ns: 'plugin' })}
                  </span>
                  ,
                  <span className="body-md-medium relative ml-1 text-text-secondary after:absolute after:bottom-[1.5px] after:left-0 after:h-2 after:w-full after:bg-text-text-selected after:content-['']">
                    {t('category.tools', { ns: 'plugin' })}
                  </span>
                  ,
                  <span className="body-md-medium relative ml-1 text-text-secondary after:absolute after:bottom-[1.5px] after:left-0 after:h-2 after:w-full after:bg-text-text-selected after:content-['']">
                    {t('category.datasources', { ns: 'plugin' })}
                  </span>
                  ,
                  <span className="body-md-medium relative ml-1 text-text-secondary after:absolute after:bottom-[1.5px] after:left-0 after:h-2 after:w-full after:bg-text-text-selected after:content-['']">
                    {t('category.triggers', { ns: 'plugin' })}
                  </span>
                  ,
                  <span className="body-md-medium relative ml-1 text-text-secondary after:absolute after:bottom-[1.5px] after:left-0 after:h-2 after:w-full after:bg-text-text-selected after:content-['']">
                    {t('category.agents', { ns: 'plugin' })}
                  </span>
                  ,
                  <span className="body-md-medium relative ml-1 mr-1 text-text-secondary after:absolute after:bottom-[1.5px] after:left-0 after:h-2 after:w-full after:bg-text-text-selected after:content-['']">
                    {t('category.extensions', { ns: 'plugin' })}
                  </span>
                  {t('marketplace.and', { ns: 'plugin' })}
                  <span className="body-md-medium relative ml-1 mr-1 text-text-secondary after:absolute after:bottom-[1.5px] after:left-0 after:h-2 after:w-full after:bg-text-text-selected after:content-['']">
                    {t('category.bundles', { ns: 'plugin' })}
                  </span>
                  {t('operation.in', { ns: 'common' })}
                  <a
                    href={getMarketplaceUrl('', { language: locale, q: keywords, tags: tagFilterValue.join(','), theme })}
                    className="system-sm-medium ml-1 flex items-center text-text-accent"
                    target="_blank"
                  >
                    {t('marketplace.difyMarketplace', { ns: 'plugin' })}
                    <RiArrowRightUpLine className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {currentProvider && !currentProvider.plugin_id && (
        <ProviderDetail
          collection={currentProvider}
          onHide={() => setCurrentProviderId(undefined)}
          onRefreshData={refetch}
        />
      )}
      <PluginDetailPanel
        detail={currentPluginDetail}
        onUpdate={() => invalidateInstalledPluginList()}
        onHide={() => setCurrentProviderId(undefined)}
      />
    </>
  )
}
ProviderList.displayName = 'ToolProviderList'
export default ProviderList
