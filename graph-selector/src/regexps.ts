/*
The goal of this file is centralize the regular expressions 
that are being used for the same purpose. */

export const getEdgeBreakIndex = (line: string) => line.search(/[^\\][:：] /);

export const getFeaturesIndex = (line: string) => {
  const m = /(^|\s)(#|\.|\[)/.exec(line);
  return m?.index ?? line.length;
};
