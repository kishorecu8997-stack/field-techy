"use client";
import CMSPageEditor from "./CMSPageEditor";

/**
 * CMSAboutUs Component
 *
 * Renders the About Us page editor for CMS management.
 *
 * @component
 * @example
 * return (
 *   <CMSAboutUs />
 * );
 *
 * @returns {JSX.Element} The rendered CMSAboutUs component.
 */
export default function CMSAboutUs() {
  return (
    <CMSPageEditor slug="about-us" pageLabel="About Us" initialContent="" />
  );
}
