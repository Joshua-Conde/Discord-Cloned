import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "../components/providers/SocketProvider";

type ChatQueryProps = {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
};

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true },
    );

    const res = await fetch(url);
    return res.json();
  };

  // initialPageParam: undefined = MY ADDITION
  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      initialPageParam: undefined,
      getNextPageParam: (lastPage) =>
        // console.log(lastPage)
        lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    });

  return {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
};
