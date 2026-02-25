"use client";
import CMSPageEditor from "./CMSPageEditor";

/**
 * CMSDataDeletionPolicy Component
 *
 * Renders the Data Deletion Policy page editor for CMS management.
 *
 * @component
 * @example
 * return (
 *   <CMSDataDeletionPolicy />
 * );
 *
 * @returns {JSX.Element} The rendered CMSDataDeletionPolicy component.
 */
export default function CMSDataDeletionPolicy() {
  return (
    <CMSPageEditor
      slug="data-deletion-policy"
      pageLabel="Data Deletion Policy"
      initialContent=""
    />
  );
}
