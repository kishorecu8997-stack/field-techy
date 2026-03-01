"use client";
import CMSPageEditor from "./CMSPageEditor";

/**
 * CMSCopyRight Component
 *
 * Renders the Copyright page editor for CMS management.
 *
 * @component
 * @example
 * return (
 *   <CMSCopyRight />
 * );
 *
 * @returns {JSX.Element} The rendered CMSCopyRight component.
 */
export default function CMSCopyRight() {
  return (
    <CMSPageEditor
      slug="copyright"
      pageLabel="Copyright"
      initialContent=""
    />
  );
}
