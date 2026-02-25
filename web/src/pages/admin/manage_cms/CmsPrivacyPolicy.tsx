"use client";
import CMSPageEditor from "./CMSPageEditor";

/**
 * CMSPrivacyPolicy Component
 *
 * Renders the Privacy Policy page editor for CMS management.
 *
 * @component
 * @example
 * return (
 *   <CMSPrivacyPolicy />
 * );
 *
 * @returns {JSX.Element} The rendered CMSPrivacyPolicy component.
 */
export default function CMSPrivacyPolicy() {
  return (
    <CMSPageEditor
      slug="privacy-policy"
      pageLabel="Privacy Policy"
      initialContent=""
    />
  );
}
