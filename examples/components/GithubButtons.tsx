"use client";

import GitHubButton from "react-github-btn";

export function Stars() {
  return (
    <GitHubButton
      href="https://github.com/tone-row/graph-selector"
      data-show-count
      data-icon="octicon-star"
      aria-label="Star tone-row/graph-selector on GitHub"
      data-size="large"
    >
      Star
    </GitHubButton>
  );
}

export function Sponsor() {
  return (
    <GitHubButton
      href="https://github.com/sponsors/tone-row"
      data-icon="octicon-heart"
      data-size="large"
      data-show-count
      aria-label="Sponsor tone-row on GitHub"
    >
      Sponsor
    </GitHubButton>
  );
}
