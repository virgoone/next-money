/**
 * 主题前缀
 */
export const Prefix = "meme";
export const IconPrefix = Prefix + "-icon";

export enum model {
  pro = "black-forest-labs/flux-pro",
  schnell = "black-forest-labs/flux-schnell",
  dev = "black-forest-labs/flux-dev",
}

export const Credits = {
  [model.pro]: 80,
  [model.schnell]: 10,
  [model.dev]: 40,
};

export const ModelName = {
  [model.pro]: "FLUX.1 [pro]",
  [model.schnell]: "FLUX.1 [schnell]",
  [model.dev]: "FLUX.1 [dev]",
};

export enum Ratio {
  r1 = "1:1",
  r2 = "16:9",
  r3 = "9:16",
  r4 = "3:2",
  r5 = "2:3",
}
