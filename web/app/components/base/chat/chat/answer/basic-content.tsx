import type { FC } from 'react'
import type { ChatItem } from '../../types'
import { memo } from 'react'
import { Markdown } from '@/app/components/base/markdown'
import { cn } from '@/utils/classnames'
import { useReverseMask } from './use-reverse-mask'

type BasicContentProps = {
  item: ChatItem
}
const BasicContent: FC<BasicContentProps> = ({
  item,
}) => {
  const {
    annotation,
    content,
  } = item

  if (annotation?.logAnnotation)
    return <Markdown content={annotation?.logAnnotation.content || ''} />

  // Preserve Windows UNC paths and similar backslash-heavy strings by
  // wrapping them in inline code so Markdown renders backslashes verbatim.
  let displayContent = content
  if (typeof content === 'string' && /^\\\\\S.*/.test(content) && !/^`.*`$/.test(content)) {
    displayContent = `\`${content}\``
  }

  // 反脱敏：将 AI 回复中的脱敏占位符还原为真实值
  const reversedContent = useReverseMask(typeof displayContent === 'string' ? displayContent : '')

  return (
    <Markdown
      className={cn(
        item.isError && '!text-[#F04438]',
      )}
      content={typeof displayContent === 'string' ? reversedContent : displayContent}
    />
  )
}

export default memo(BasicContent)
