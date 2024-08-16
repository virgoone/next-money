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
