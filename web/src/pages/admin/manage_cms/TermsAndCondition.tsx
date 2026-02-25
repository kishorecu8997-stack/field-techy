"use client";
import CMSPageEditor from "./CMSPageEditor";

/**
 * CMSTermsAndConditions Component
 *
 * Renders the Terms and Conditions page editor for CMS management.
 *
 * @component
 * @example
 * return (
 *   <CMSTermsAndConditions />
 * );
 *
 * @returns {JSX.Element} The rendered CMSTermsAndConditions component.
 */
export default function CMSTermsAndConditions() {
  return (
    <CMSPageEditor
      slug="terms"
      pageLabel="Terms and Conditions"
      initialContent=""
    />
  );
}
