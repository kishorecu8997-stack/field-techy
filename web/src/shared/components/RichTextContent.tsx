import DOMPurify from "dompurify";
import type { HTMLAttributes } from "react";

interface RichTextContentProps extends HTMLAttributes<HTMLDivElement> {
  html: string;
  className?: string;
}

/**
 * Reusable component that safely renders sanitized HTML with good typography
 * using Tailwind Typography (prose) classes.
 */
export default function RichTextContent({
  html,
  className = "",
  ...rest
}: RichTextContentProps) {
  const sanitized = DOMPurify.sanitize(html);

  return (
    <div
      className={`
        prose 
        prose-lg 
        dark:prose-invert 
        max-w-none

        [&_ul]:list-disc
        [&_ul]:pl-6
        [&_ol]:list-decimal
        [&_ol]:pl-6
        [&_li]:mb-1

        prose-headings:font-bold
        prose-headings:text-gray-900 dark:prose-headings:text-gray-100

        [&_h1]:text-4xl    [&_h1]:leading-tight   [&_h1]:mt-10 [&_h1]:mb-6
        [&_h2]:text-3xl    [&_h2]:leading-tight   [&_h2]:mt-8  [&_h2]:mb-4
        [&_h3]:text-2xl    [&_h3]:leading-snug    [&_h3]:mt-6  [&_h3]:mb-3
        [&_h4]:text-xl     [&_h4]:leading-normal  [&_h4]:mt-4  [&_h4]:mb-2
        [&_h5]:text-lg     [&_h5]:font-semibold
        [&_h6]:text-base   [&_h6]:font-semibold

        break-words
        overflow-x-hidden
        w-full

        ${className}
      `}
      dangerouslySetInnerHTML={{ __html: sanitized }}
      {...rest}
    />
  );
}