"use client";

import dynamic from "next/dynamic";

export const IntroClipMount = dynamic(
  () => import("./IntroClip").then((m) => m.IntroClip),
  { ssr: false },
);
