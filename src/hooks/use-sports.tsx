import { useQuery } from "@tanstack/react-query";
import { getSports } from "../services/sports";
import { ISport } from "types";

export const sportsQueryKey = {
  useSportsQuery: "sportsQuery",
};

export const useSportsQuery = () => {
  return useQuery<ISport[] | null>({
    queryKey: [sportsQueryKey.useSportsQuery],
    queryFn: getSports,
    retry: false,
    select(data) {
      return data;
    },
  });
};
