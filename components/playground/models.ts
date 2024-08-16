export const types = ["Flux AI"] as const;

export type ModelType = (typeof types)[number];

export interface Model<Type = string> {
  id: string;
  name: string;
  description: string;
  strengths?: string;
  type: Type;
}

export const models: Model<ModelType>[] = [
  {
    id: "black-forest-labs/flux-pro",
    name: "FLUX.1 [pro]",
    description:
      "Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following. Also supports inserting completions within text.",
    type: "Flux AI",
    strengths:
      "Complex intent, cause and effect, creative generation, search, summarization for audience",
  },
  {
    id: "black-forest-labs/flux-schnell",
    name: "FLUX.1 [schnell]",
    description: "Very capable, but faster and lower cost than Davinci.",
    type: "Flux AI",
    strengths:
      "Language translation, complex classification, sentiment, summarization",
  },
];
