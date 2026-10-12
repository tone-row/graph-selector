/*
The goal of this file is centralize the regular expressions 
that are being used for the same purpose. */

export const getEdgeBreakIndex = (line: string) => line.search(/[^\\](: |：)/);

export const getFeaturesIndex = (line: string) => {
  const m = /(^|\s)(#|\.|\[)/.exec(line);
  return m?.index ?? line.length;
};

/**
 * @description
 * This regular expression is used to match the features of a node or edge.
 */
export const featuresRe =
  /(?<replace>(?<id>#[\w-]+)?(?<classes>(\.[a-zA-Z]{1}[\w-]*)*)?(?<attributes>(\[[^\]=]+(?<attributeValue>=(".*"|'.*'|.*))?\])*))/s;

/**
 * featuresRe with the g flag, for getFeatureData's exec loop. Keep it a literal: a transpiler
 * that polyfills named groups (CRA's Babel does) wraps literals only, and a copy made with
 * new RegExp(featuresRe, "gs") comes back without match.groups.
 */
export const featuresReGlobal =
  /(?<replace>(?<id>#[\w-]+)?(?<classes>(\.[a-zA-Z]{1}[\w-]*)*)?(?<attributes>(\[[^\]=]+(?<attributeValue>=(".*"|'.*'|.*))?\])*))/gs;
