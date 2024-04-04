import dayjs from "dayjs";
import useScheduleStore from "stores/schedule-store";

import Loading from "components/common/loading";
import ComponentStatusContainer from "components/layouts/component-status-container";
import { useLeagueStore } from "stores/league-store";
import { useScheduleQuery } from "hooks/services/quries/use-schedule-query";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";

interface IScheduleResultProps {
  isAll: boolean;
}

const ScheduleResult: React.FunctionComponent<IScheduleResultProps> = ({
  isAll,
}) => {
  const nav = useNavigate();
  const { currentDate } = useScheduleStore();
  const selectedLeague = useLeagueStore((state) => state.selectedLeague);

  const formatDate = dayjs(currentDate);
  const firstDayOfMonth = formatDate.startOf("month").format("YYYY-MM-DD");
  const lastDayOfMonth = formatDate.endOf("month").format("YYYY-MM-DD");

  const { data, isLoading, isError } = useScheduleQuery({
    isAll,
    date: currentDate,
    start: firstDayOfMonth,
    end: lastDayOfMonth,
    season: selectedLeague?.season!,
    leagueId: selectedLeague?.leagueId!,
  });

  if (isLoading) {
    return (
      <ComponentStatusContainer state="loading" height="500">
        <Loading size="md" />
      </ComponentStatusContainer>
    );
  }

  if (isError) {
    return (
      <ComponentStatusContainer state="loading" height="500">
        <p>An error occurred while trying to fetch data 🤮</p>
      </ComponentStatusContainer>
    );
  }

  return (
    <ul className=" mt-6 w-full space-y-4 p-0 sm:px-8 md:block">
      {data?.map((el) => (
        <li
          key={el.fixture.id}
          className="relative flex w-full flex-wrap items-center justify-between rounded-md border  border-MediumGrey px-4 py-2 md:gap-x-4"
        >
          <div className="absolute left-1 top-1 flex gap-x-4 md:static ">
            <time className="text-xs font-semibold sm:text-sm">
              {isAll
                ? `${dayjs(el.fixture.date).format("MM-DD HH:mm")}`
                : `${dayjs(el.fixture.date).format("HH:mm")}`}
            </time>
            <span className="hidden text-sm ">{el.fixture.venue.name}</span>
          </div>

          <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-y-2 md:mt-0 md:flex-auto md:flex-row md:justify-between">
            <div className="flex  items-center gap-x-2">
              <div>
                <span className="flex items-center justify-center rounded-sm bg-green-500 px-[3px] text-xs leading-[20px] text-white">
                  Home
                </span>
              </div>
              <div>{el.teams.home.name}</div>
            </div>

            <div className="flex gap-x-3 font-semibold">
              <LazyLoadImage
                src={el.teams.home.logo}
                alt="homeLogo"
                className="aspect-square w-8 max-w-8"
              />
              <span className="flex items-center gap-x-2 rounded-md bg-Main px-2 py-1 text-xs leading-[20px] text-White">
                <span>{el.goals.home}</span>
                <span>{el.fixture.status.long}</span>
                <span>{el.goals.away}</span>
              </span>
              <LazyLoadImage
                src={el.teams.away.logo}
                alt="homeLogo"
                className="aspect-square w-8 max-w-8"
              />
            </div>
            <div className="flex items-center">
              <div>{el.teams.away.name}</div>
              <span className="ml-2 flex items-center justify-center rounded-sm bg-blue-500 px-[3px] text-xs leading-[20px] text-white">
                Away
              </span>
            </div>
          </div>
          <span className="absolute bottom-1 right-2 font-semibold sm:block md:static">{`${el.league.round.at(
            -2,
          )}${el.league.round.at(-1)}R`}</span>

          <button
            onClick={() => {
              nav(`/match-result/${el.fixture.id}`);
            }}
            className="absolute right-1 top-1 rounded-md border border-MediumGrey px-2 py-[2px] text-sm uppercase transition-colors hover:bg-Main  hover:text-White md:static"
          >
            result
          </button>
        </li>
      ))}
    </ul>
  );
};
export default ScheduleResult;
