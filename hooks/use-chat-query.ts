import qs from 'query-string'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSocket } from '../components/providers/SocketProvider'

type ChatQueryProps = {
  queryKey: string
  apiUrl: string
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected } = useSocket()

  const fetchMessages = async ({ pageParam = null }) => {
    const url = qs?.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true },
    )

    const res = await fetch(url)
    return res?.json()
  }

  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    })

  return {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  }
}
