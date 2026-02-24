import CMSPageEditor from "./CMSPageEditor";

/**
 * CMSLegal Component
 *
 * Renders the Legal page editor for CMS management.
 *
 * @component
 * @example
 * return (
 *   <CMSLegal />
 * );
 *
 * @returns {JSX.Element} The rendered CMSLegal component.
 */
export default function CMSLegal() {
  return <CMSPageEditor slug="legal" pageLabel="Legal" initialContent="" />;
}
