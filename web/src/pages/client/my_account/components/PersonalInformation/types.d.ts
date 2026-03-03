/**
 * Form shape for the ClientPersonalInformation form.
 * Maps to the fields returned by the clientGetCompanyInfo API
 * (ClientGetCompanyInfoResponse) and sent via clientUpdateCompanyInfo.
 *
 * - country / state / city store raw IDs (number | string) because
 *   react-hook-form / SelectField can hold either the raw id or a
 *   {value, label} object; the submit handler normalises them with getId().
 * - Corporate-only fields (companyName, address, industry,
 *   businessType, taxDocument, vatRegistrationNumber) are optional so
 *   the same interface covers both "home" and "corporate" client types.
 */
interface PersonalInfo {
  companyName?: string;
  contactPersonName: string;
  phoneNumber: string;
  businessType?: string | number | null;
  industry?: string | number | null;
  address?: string | null;
  country?: string | number | null;
  state?: string | number | null;
  city?: string | number | null;
  postalCode?: string;
  taxDocument?: string | null;
  vatRegistrationNumber?: string;
}
