import { formatPublicDay } from "libs/day";

import Loading from "components/common/loading";
import ComponentStatusContainer from "components/layouts/component-status-container";
import Filter from "components/common/filters";
import { GLOBAL_NEWS_FILTERS } from "data/football/news";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";

import { useLeagueStore } from "stores/league-store";
import { useInfiniteScroll } from "hooks/use-infinite-scroll";
import {
  useGlobalNewsQuery,
  useLocalNewsQuery,
} from "hooks/services/quries/use-news-query";
import { useSearchParams } from "react-router-dom";

interface INewsListProps {
  type: "local" | "global";
}

const NewsList: React.FunctionComponent<INewsListProps> = ({ type }) => {
  const selectedLeague = useLeagueStore((state) => state.selectedLeague);
  const [searchParams] = useSearchParams();
  const filterName = searchParams.get("filterName") || "";

  const {
    data: localNewsData,
    isLoading: localLoading,
    isError: localError,
    hasNextPage: localHasNextPage,
    fetchNextPage: localFetchNextPage,
    isFetching: isLocalFetching,
  } = useLocalNewsQuery(selectedLeague?.name!, type === "local");

  const {
    data: globalNewsData,
    isLoading: globalLoading,
    isError: globalNewsError,
    hasNextPage: globalHasNextPage,
    fetchNextPage: globalfetchNextPage,
    isFetching: isGlobalFetching,
  } = useGlobalNewsQuery(selectedLeague?.name!, type === "global", filterName);

  const { observerRef: localRef } = useInfiniteScroll({
    hasNextPage: localHasNextPage,
    fetchNextPage: localFetchNextPage,
  });

  const { observerRef: globalRef } = useInfiniteScroll({
    hasNextPage: globalHasNextPage,
    fetchNextPage: globalfetchNextPage,
  });

  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noreferrer");
  };

  if (localLoading || globalLoading) {
    return (
      <ComponentStatusContainer state="loading" height="500">
        <Loading size="sm" />
      </ComponentStatusContainer>
    );
  }

  if (localError || globalNewsError) {
    return (
      <ComponentStatusContainer state="loading" height="500">
        데이터를 불러오던 도중 오류가 발생했어요 🤮
      </ComponentStatusContainer>
    );
  }

  return (
    <div className="py-2">
      {type === "local" ? (
        <>
          <ul className="grid grid-cols-1 gap-2 xl:grid-cols-2">
            {localNewsData?.map((el, i) => (
              <li
                onClick={() => openInNewTab(el.link)}
                key={i}
                className="cursor-pointer rounded-md border-2  border-MediumGrey p-5  transition-colors hover:border-Main hover:bg-Main hover:text-White"
              >
                <div className="mb-2 flex w-full text-sm">
                  <time>{formatPublicDay(el.pubDate)}</time>
                </div>
                <h2 className="font-semibold">{parsingHTML(el.title)}</h2>
                <p className="mt-2 text-sm">{parsingHTML(el.description)}</p>
              </li>
            ))}
          </ul>
          <div
            className="my-2 flex h-20 items-center justify-center p-5"
            ref={localRef}
          >
            {isLocalFetching ? (
              <div className="my-5">
                <Loading size="sm" />
              </div>
            ) : (
              <p>Load More...</p>
            )}
          </div>
        </>
      ) : null}
      {type === "global" ? (
        <>
          <Filter items={GLOBAL_NEWS_FILTERS} />
          {globalNewsData && globalNewsData?.length > 0 ? (
            <>
              <ul className="mt-4 grid grid-cols-1 gap-2 xl:grid-cols-2">
                {globalNewsData?.map((el, i) => (
                  <li
                    onClick={() => openInNewTab(el.url)}
                    key={i}
                    className="flex cursor-pointer flex-col justify-around rounded-md border-2  border-MediumGrey px-5 py-3  transition-colors hover:border-Main hover:bg-Main hover:text-White"
                  >
                    <div className="mb-2 flex  flex-col justify-end text-sm">
                      {/* <p>{el.author}</p>
                  <p>{el.source.name}</p> */}
                      <time>{formatPublicDay(el.publishedAt)}</time>
                    </div>

                    <div className="flex justify-between gap-x-4">
                      <LazyLoadImage
                        effect="opacity"
                        src={el.urlToImage}
                        alt="thumbnail"
                        width={200}
                        className="aspect-square h-32 max-w-[150px] rounded-md"
                      />
                      <div className="">
                        <h2 className="font-semibold">{el.title}</h2>
                        <p className="mt-2 text-sm">{el.description}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-end justify-between text-sm">
                      <p>{el.author}</p>
                      <p>{el.source.name}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div
                className="my-2 flex h-20 items-center justify-center p-5"
                ref={globalRef}
              >
                {globalNewsData &&
                globalNewsData?.length > 0 &&
                isGlobalFetching ? (
                  <div className="my-5">
                    <Loading size="sm" />
                  </div>
                ) : (
                  <p>Load More...</p>
                )}
              </div>
            </>
          ) : (
            <>
              <ComponentStatusContainer
                height="300"
                state="error"
                classNames="mt-10 h-[350px]"
              >
                This keyword article does not exist.
              </ComponentStatusContainer>
            </>
          )}
        </>
      ) : null}
    </div>
  );
};

export default NewsList;

function parsingHTML(contents: string) {
  return <div dangerouslySetInnerHTML={{ __html: contents }} />;
}
