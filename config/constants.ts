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
  [model.pro]: 10,
  [model.schnell]: 1,
  [model.dev]: 5,
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

export const ModelDefaultAdVancedSetting = {
  [model.pro]: {
    steps: {
      default: 25,
      min: 1,
      max: 50,
    },
    guidance: {
      default: 3,
      min: 2,
      max: 5,
    },
    interval: {
      default: 2,
      min: 1,
      max: 4,
    },
    safety_tolerance: {
      default: 2,
      min: 1,
      max: 5,
    }
  },
  [model.schnell]: "FLUX.1 [schnell]",
  [model.dev]: "FLUX.1 [dev]",
}