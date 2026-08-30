/**
 * Lab experiment data — lorem-ipsum placeholders pending real
 * proof-of-concept entries (WebGL, audio, video, AI, etc.).
 */
export type Experiment = {
  slug: string;
  title: string;
  summary: string;
  status: "in-progress" | "complete" | "idea";
};

export const experiments: Experiment[] = [
  {
    slug: "experiment-one",
    title: "Lorem Ipsum Experiment",
    summary:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
    status: "in-progress",
  },
  {
    slug: "experiment-two",
    title: "Lorem Ipsum Experiment Two",
    summary:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
    status: "idea",
  },
];
