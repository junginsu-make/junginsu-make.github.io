"use client";
import { useEffect, useState } from "react";
import { Counter } from "@/components/motion/counter";
import type { VisitCounts } from "@/lib/visits";

/**
 * 푸터 방문자 수 — 오늘 / 전체.
 *
 * 이 요청 하나가 집계까지 겸한다. 서버가 쿠키로 같은 사람인지 가려내고, 오늘 처음
 * 온 사람일 때만 숫자를 올린 뒤 현재 값을 돌려준다. 그래서 여기서는 세는 시점을
 * 신경 쓸 게 없다 — 한 번 부르고 받은 숫자를 그리면 된다.
 *
 * **실패하면 아무것도 그리지 않는다.** 저장소가 죽었을 때 0 을 띄우면 "방문자가
 * 없는 사이트"로 읽힌다. 거짓 숫자보다 빈 자리가 낫다.
 */
export function VisitorCounter() {
  const [counts, setCounts] = useState<VisitCounts | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/visits/", { method: "POST" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: VisitCounts | null) => {
        if (alive && data) setCounts(data);
      })
      .catch(() => {
        /* 카운터 하나 때문에 콘솔을 어지럽히지 않는다 */
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!counts) return null;

  return (
    <dl className="flex items-baseline gap-x-6 gap-y-1 flex-wrap text-[11px] tracking-wider">
      <div className="flex items-baseline gap-1.5">
        <dt className="opacity-40">오늘 방문자</dt>
        <dd className="font-mono tabular-nums opacity-70">
          <Counter to={counts.today} startOnMount />
        </dd>
      </div>
      <div className="flex items-baseline gap-1.5">
        <dt className="opacity-40">전체 방문자</dt>
        <dd className="font-mono tabular-nums opacity-70">
          <Counter to={counts.total} startOnMount />
        </dd>
      </div>
    </dl>
  );
}
