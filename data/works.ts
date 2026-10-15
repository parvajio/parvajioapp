export type Work = {
  t: string;
  d: string;
  tags: string[];
  c: string;
  s: string;
  r: string;
};

/** Projects list — copied verbatim from old/index.html.
 *  `c` is kept for fidelity; the original card builder never renders it. */
export const WORKS: Work[] = [
  {
    t: "NoyonLearn — AI Tutor",
    d: "RAG tutor with citations, streaming, quiz gen.",
    tags: ["NEXT.JS", "PGVECTOR", "GEMINI"],
    c: "#7C3AED",
    s: "Next.js 14 / Prisma / LangChain",
    r: "Solo build — design to deploy",
  },
  {
    t: "WebLearn Realtime Collab",
    d: "Live cursors, docs + whiteboard for classrooms.",
    tags: ["LIVEBLOCKS", "EDGE"],
    c: "#6D28D9",
    s: "Next.js / Liveblocks / Redis",
    r: "Frontend + realtime infra",
  },
  {
    t: "Sentiment Intel Platform",
    d: "Brand sentiment dashboard over social firehose.",
    tags: ["AI SDK", "CHARTS"],
    c: "#7C3AED",
    s: "Next.js / Python worker",
    r: "Full-stack",
  },
  {
    t: "YT Downloader Ext.",
    d: "40k users, queue + batch downloads.",
    tags: ["EXTENSION", "FFMPEG"],
    c: "#6D28D9",
    s: "Plasmo / TS",
    r: "Solo extension dev",
  },
];
