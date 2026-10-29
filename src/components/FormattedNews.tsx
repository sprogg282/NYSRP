import { useState, type ReactNode } from 'react';

function decodeTextEntities(value: string) {
  return value.replace(/&(amp|lt|gt|quot|apos|nbsp|#39|#\d+|#x[\da-f]+);/gi, (entity, name: string) => {
    const named: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };
    if (named[name.toLowerCase()]) return named[name.toLowerCase()];
    const code = name.toLowerCase().startsWith('#x') ? Number.parseInt(name.slice(2), 16) : Number.parseInt(name.slice(1), 10);
    return Number.isInteger(code) && code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
  });
}

function InlineImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? <span className="news-image-unavailable">{alt}</span> : <img className="news-inline-image" src={src} alt={alt} loading="lazy" onError={() => setFailed(true)}/>;
}

function inlineContent(text: string, keyPrefix: string): ReactNode[] {
  text = decodeTextEntities(text);
  const token = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  const result: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = token.exec(text))) {
    if (match.index > lastIndex) result.push(text.slice(lastIndex, match.index));
    const key = `${keyPrefix}-${index++}`;
    if (match[1] !== undefined) {
      result.push(<InlineImage key={key} src={match[2]} alt={match[1]}/>);
    } else if (match[3] !== undefined) {
      result.push(<a key={key} href={match[4]} target="_blank" rel="noopener noreferrer">{match[3]}</a>);
    } else if (match[5] !== undefined) {
      result.push(<strong key={key}>{match[5]}</strong>);
    } else if (match[6] !== undefined) {
      result.push(<em key={key}>{match[6]}</em>);
    }
    lastIndex = token.lastIndex;
  }

  if (lastIndex < text.length) result.push(text.slice(lastIndex));
  return result;
}

/** Render the safe Markdown subset used by News; raw HTML is always plain text. */
export function FormattedNews({ content }: { content: string }) {
  const lines = content.replace(/\r\n?/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let cursor = 0;

  while (cursor < lines.length) {
    if (!lines[cursor].trim()) { cursor++; continue; }
    const heading = lines[cursor].match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const Tag = heading[1].length === 1 ? 'h2' : 'h3';
      blocks.push(<Tag key={`heading-${cursor}`}>{inlineContent(heading[2], `heading-${cursor}`)}</Tag>);
      cursor++;
      continue;
    }
    if (/^\s*[-*]\s+/.test(lines[cursor])) {
      const items: ReactNode[] = [];
      while (cursor < lines.length && /^\s*[-*]\s+/.test(lines[cursor])) {
        const lineIndex = cursor;
        items.push(<li key={`list-item-${lineIndex}`}>{inlineContent(lines[cursor].replace(/^\s*[-*]\s+/, ''), `list-${lineIndex}`)}</li>);
        cursor++;
      }
      blocks.push(<ul key={`list-${cursor}`}>{items}</ul>);
      continue;
    }
    const paragraph: string[] = [];
    const start = cursor;
    while (cursor < lines.length && lines[cursor].trim() && !/^(#{1,3})\s+/.test(lines[cursor]) && !/^\s*[-*]\s+/.test(lines[cursor])) {
      paragraph.push(lines[cursor]);
      cursor++;
    }
    blocks.push(<p key={`paragraph-${start}`}>{paragraph.map((line, i) => <span key={i}>{i > 0 && <br/>}{inlineContent(line, `paragraph-${start}-${i}`)}</span>)}</p>);
  }

  return <div className="news-formatted-content">{blocks}</div>;
}
