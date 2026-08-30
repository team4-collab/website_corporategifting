"use client";

import { useEffect, useState } from "react";

function getRemaining(endAt: string) {
  const diff = new Date(endAt).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer({ endAt }: { endAt: string }) {
  const [remaining, setRemaining] = useState(() => getRemaining(endAt));

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(endAt)), 1000);
    return () => clearInterval(id);
  }, [endAt]);

  if (!remaining) return null;

  return (
    <span className="font-mono tabular-nums">
      {remaining.days}d {remaining.hours}h {remaining.minutes}m{" "}
      {remaining.seconds}s
    </span>
  );
}
