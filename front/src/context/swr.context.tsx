import { SWRConfig } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SWRProviders({ children }: any) {
  return <SWRConfig value={{ fetcher }}>{children}</SWRConfig>;
}
