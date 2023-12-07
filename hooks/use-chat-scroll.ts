import { useEffect, useState } from 'react'

type ChatScrollProps = {
  topRef: React.RefObject<HTMLDivElement>
  bottomRef: React.RefObject<HTMLDivElement>
  shouldLoadMore: boolean
  loadMore: () => void
  count: number
}

export const useChatScroll = ({
  topRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: ChatScrollProps) => {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const topDiv = topRef?.current

    const handleScrollTop = () => {
      const scrollTop = topDiv?.scrollTop

      if (scrollTop === 0 && shouldLoadMore) {
        loadMore()
      }
    }

    topDiv?.addEventListener('scroll', handleScrollTop)
    return () => topDiv?.removeEventListener('scroll', handleScrollTop)
  }, [topRef, shouldLoadMore, loadMore])

  useEffect(() => {
    const topDiv = topRef?.current
    const bottomDiv = bottomRef?.current

    const shouldAutoScrollBottom = () => {
      if (bottomDiv && !isInitialized) {
        setIsInitialized(true)
        return true
      }

      if (!topDiv) {
        return false
      }

      const bottomDistance =
        topDiv?.scrollHeight - topDiv?.scrollTop - topDiv?.clientHeight

      return bottomDistance <= 100
    }

    if (shouldAutoScrollBottom()) {
      setTimeout(() => {
        bottomDiv?.scrollIntoView({
          behavior: 'smooth',
        })
      }, 100)
    }
  }, [topRef, bottomRef, isInitialized, count])
}
