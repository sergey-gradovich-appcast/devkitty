import { ReactNode } from 'react';
import isNull from 'lodash/isNull';

const escapeRegExpChars = (text: string) => {
  return text.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
};

export const highlightText = (text: string, query: string = '') => {
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [text];
  }
  const regexp = new RegExp(words.join('|'), 'gi');
  const tokens: ReactNode[] = [];
  let match = regexp.exec(text);
  while (!isNull(match)) {
    const length = match[0].length;
    const before = text.slice(lastIndex, regexp.lastIndex - length);
    if (before.length > 0) {
      tokens.push(before);
    }
    lastIndex = regexp.lastIndex;
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
    match = regexp.exec(text);
  }
  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
};