"use client";
import CMSPageEditor from "./CMSPageEditor";

/**
 * CMSCustomerPrivacyPolicy Component
 *
 * Renders the Customer Privacy Policy page editor for CMS management.
 *
 * @component
 * @example
 * return (
 *   <CMSCustomerPrivacyPolicy />
 * );
 *
 * @returns {JSX.Element} The rendered CMSCustomerPrivacyPolicy component.
 */
export default function CMSCustomerPrivacyPolicy() {
  return (
    <CMSPageEditor
      slug="customer-privacy-policy"
      pageLabel="Customer Privacy Policy"
      initialContent=""
    />
  );
}
