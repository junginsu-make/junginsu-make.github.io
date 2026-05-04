import { GithubFull } from "@/components/builder/github-full";

export const metadata = {
  title: "GitHub — AI Builder · 정인수",
  description:
    "외부 공개 43 레포 (private 41 별도) — 5 카테고리 (대표 시스템 25 / Claude Code 생태계 6 / Frontend Stack 8 / 외부 fork 2 / Misc 2) + 12 Golden Principles.",
};

export default function GithubInventory() {
  return <GithubFull />;
}
