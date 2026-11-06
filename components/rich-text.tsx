import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/react';
import Image from 'next/image';
import { imageUrl } from '@/lib/images';
export function RichText({ value }: { value?: PortableTextBlock[] }) {
  if (!value?.length) return null;
  return <div className="rich-text"><PortableText value={value} components={{
    types: {
      image: ({ value }) => <figure><Image src={imageUrl(value, 1400)} alt={value.imgDesc || 'Fotografija iz plesnog studija Ventus'} width={1400} height={900} sizes="(max-width: 850px) 92vw, 800px" style={{ height: 'auto' }} />{value.imgDesc && <figcaption>{value.imgDesc}</figcaption>}</figure>,
      youtube: ({ value }) => {
        const match = String(value.url || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
        return match ? <iframe className="youtube-embed" src={`https://www.youtube-nocookie.com/embed/${match[1]}`} title={value.videoDesc || 'Ventus plesni video'} loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : null;
      },
    },
    block: { cite: ({ children }) => <cite>{children}</cite> },
    marks: { link: ({ value, children }) => { const href = String(value?.href || ''); return /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(href) ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>{children}</a> : <span>{children}</span>; } },
  }} /></div>;
}
