"use client";
import CMSPageEditor from "./CMSPageEditor";

/**
 * CMSAddress Component
 *
 * Renders the Address page editor for CMS management.
 *
 * @component
 * @example
 * return (
 *   <CMSAddress />
 * );
 *
 * @returns {JSX.Element} The rendered CMSAddress component.
 */
export default function CMSAddress() {
  return (
    <CMSPageEditor
      slug="address"
      pageLabel="Address"
      initialContent=""
    />
  );
}
