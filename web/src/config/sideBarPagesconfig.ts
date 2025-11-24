/* eslint-disable @typescript-eslint/no-explicit-any */
import ClientAccountDrawerMenu from "@/pages/client/my_account/ClientAccountDrawerMenu";
import ClientAddFund from "@/pages/client/my_wallet/components/AddFund";
import ClientRecentTransactions, {
  ActionButtonsForRecentTransactions,
} from "@/pages/client/my_wallet/components/RecentTransactionsList";
import ClientWalletComponent from "@/pages/client/my_wallet/components/WalletComponent";
import AddClient from "@/pages/client/post_job/PostAJobComponent/client_Interview/AddClient";
import AddPOC from "@/pages/client/post_job/PostAJobComponent/client_Interview/AddPOC";
import EditClient from "@/pages/client/post_job/PostAJobComponent/client_Interview/EditClient";
import EditPOC from "@/pages/client/post_job/PostAJobComponent/client_Interview/EditPOC";
import AccountSettings from "@/pages/engineer/account_settings";
import AddBankDetails from "@/pages/engineer/account_settings/bank_details/AddBankDetails";
import BankAccountList from "@/pages/engineer/account_settings/bank_details/BankAccountList";
import EditBankDetails from "@/pages/engineer/account_settings/bank_details/EditBankDetails";
import MyEarning from "@/pages/engineer/account_settings/bank_details/MyEarning";
import TransactionDashboard from "@/pages/engineer/account_settings/bank_details/TransactionDashboard";
import Withdraw from "@/pages/engineer/account_settings/bank_details/Withdraw";
import ChangePassword from "@/pages/engineer/account_settings/ChangePassword";
import ContactUs from "@/pages/engineer/account_settings/contact_us/ContactUs";
import NotofocationPage from "@/pages/engineer/account_settings/notification/NotificationPage";
import MyAccountDrawerMenu from "@/pages/engineer/my_account";
import CancelJopOffer from "@/pages/engineer/my_job/job_details_components/CancelJopOffer";
import EditDocument from "@/pages/engineer/user_profile/components/documents/components/EditDocument";
import Documents from "@/pages/engineer/user_profile/components/documents/Documents";
import AddEducation from "@/pages/engineer/user_profile/components/education/AddEducation";
import EditEducation from "@/pages/engineer/user_profile/components/education/EditEducation";
import Education from "@/pages/engineer/user_profile/components/education/Education";
import AddExperiences from "@/pages/engineer/user_profile/components/experiences/components/AddExperiences";
import EditExperiences from "@/pages/engineer/user_profile/components/experiences/components/EditExperiences";
import Experiences from "@/pages/engineer/user_profile/components/experiences/Experiences";
import PersonalInformation from "@/pages/engineer/user_profile/components/PersonalInformation/PersonalInformation";
import AddSkills from "@/pages/engineer/user_profile/components/skills_and_tools/components/AddSkills";
import AddTools from "@/pages/engineer/user_profile/components/skills_and_tools/components/AddTools";
import EditSkills from "@/pages/engineer/user_profile/components/skills_and_tools/components/EditSkills";
import EditTools from "@/pages/engineer/user_profile/components/skills_and_tools/components/EditTools";
import SkillsAndTools from "@/pages/engineer/user_profile/components/skills_and_tools/SkillsAndTools";
import WorkPreference from "@/pages/engineer/user_profile/components/WorkPreference/WorkPreference";
import UserProfileSidebar from "@/pages/engineer/user_profile/UserProfileSidebar";

import ClientDocuments from "@/pages/client/my_account/components/documents/ClientDocuments";
import ClientEditDocument from "@/pages/client/my_account/components/documents/components/ClientEditDocument";
import ClientPersonalInformation from "@/pages/client/my_account/components/PersonalInformation/ClientPersonalInformation";

/**
 * Configuration object mapping route keys to their corresponding components, titles, and optional parent sections.
 * Used for dynamically rendering account settings and profile-related UI sections.
 *
 * Structure:
 * - `key`: Unique identifier for the section/route.
 * - `component`: React component (or placeholder string during development) to render.
 * - `title`: Display name for the section in UI (e.g., navigation, breadcrumbs).
 * - `parent` (optional): Key of the parent section for hierarchical organization.
 *
 * @type {Record<string, { component: React.ComponentType<any> | string; title: string; parent?: string; }>}
 *
 * Sorted alphabetically by key:
 */
export const sectionConfig: Record<
  string,
  {
    component: React.ComponentType<any> | string;
    title: string;
    parent?: string;
    actions?: React.ReactNode | React.ComponentType;
  }
> = {
  myAccount: { component: MyAccountDrawerMenu, title: "My Account" },
  cancelOffer: {
    component: CancelJopOffer,
    title: "Do you want to cancel the job?",
  },
  profile: {
    component: UserProfileSidebar,
    title: "My Profile",
    parent: "myAccount",
  },
  personalInfo: {
    component: PersonalInformation,
    title: "Personal Information",
    parent: "profile",
  },
  education: { component: Education, title: "Education", parent: "profile" },
  addEducation: {
    component: AddEducation,
    title: "Add Education",
    parent: "education",
  },
  editEducation: {
    component: EditEducation,
    title: "Edit Education",
    parent: "education",
  },
  skillsAndTools: {
    component: SkillsAndTools,
    title: "Skills & Tools",
    parent: "profile",
  },
  addSkills: {
    component: AddSkills,
    title: "Add Skills",
    parent: "skillsAndTools",
  },
  editSkills: {
    component: EditSkills,
    title: "Edit Skills",
    parent: "skillsAndTools",
  },
  addTools: {
    component: AddTools,
    title: "Add Tools",
    parent: "skillsAndTools",
  },
  editTools: {
    component: EditTools,
    title: "Edit Tools",
    parent: "skillsAndTools",
  },
  experiences: {
    component: Experiences,
    title: "Experiences",
    parent: "profile",
  },
  addExperiences: {
    component: AddExperiences,
    title: "Add Experience",
    parent: "experiences",
  },
  editExperiences: {
    component: EditExperiences,
    title: "Edit Experience",
    parent: "experiences",
  },
  workPreference: {
    component: WorkPreference,
    title: "Work Preference",
    parent: "profile",
  },
  documents: { component: Documents, title: "Documents", parent: "profile" },
  editDocument: {
    component: EditDocument,
    title: "Edit Document",
    parent: "documents",
  },
  jobs: { component: () => "job", title: "My Jobs" },
  earning: {
    component: MyEarning,
    title: "My Earning",
    parent: "myAccount",
  },
  saved: { component: () => "test", title: "Saved Jobs" },
  settings: {
    component: AccountSettings,
    title: "Account Settings",
    parent: "myAccount",
  },
  changePassword: {
    component: ChangePassword,
    title: "Change Password",
    parent: "settings",
  },
  manageBankAccounts: {
    component: BankAccountList,
    title: " Bank Details",
    parent: "settings",
  },
  addBankdetails: {
    component: AddBankDetails,
    title: "Add Bank Details",
    parent: "manageBankAccounts",
  },
  editBankdetails: {
    component: EditBankDetails,
    title: "Edit Bank Details",
    parent: "manageBankAccounts",
  },
  contactUs: { component: ContactUs, title: "Contact Us", parent: "settings" },
  myEarning: { component: MyEarning, title: "My Earning", parent: "settings" },
  withdraw: { component: Withdraw, title: "Withdraw", parent: "settings" },
  notification: {
    component: NotofocationPage,
    title: "Notification",
    parent: "settings",
  },

  //client
  clientAccount: { component: ClientAccountDrawerMenu, title: "My Profile" },
  proposal: {
    component: "test",
    title: "Manage Proposal",
    parent: "clientAccount",
  },

  company: {
    component: ClientPersonalInformation,
    title: "Company Information",
    parent: "clientAccount",
  },

  document: {
    component: ClientDocuments,
    title: "Documents",
    parent: "clientAccount",
  },
  clientEditDocument: {
    component: ClientEditDocument,
    title: "Edit Document",
    parent: "document",
  },
  payment: {
    component: "test",
    title: "Payment Methods",
    parent: "clientAccount",
  },
  changePwd: {
    component: "test",
    title: "Change Password",
    parent: "clientAccount",
  },
  clientAcc: {
    component: "test",
    title: "Account Setting",
    parent: "clientAccount",
  },
  clientWallet: { component: ClientWalletComponent, title: "My Wallet" },
  clientAddFund: {
    component: ClientAddFund,
    title: "Add Fund",
    parent: "clientWallet",
  },
  recentTransactions: {
    component: ClientRecentTransactions,
    title: "Recent Transactions",
    actions: ActionButtonsForRecentTransactions,
    parent: "clientWallet",
  },
  engineerRecentTransactions: {
    component: TransactionDashboard,
    title: "Recent Transactions",
    actions: ActionButtonsForRecentTransactions,
    parent: "myEarning",
  },
  clientInterviewer: {
    component: AddClient,
    title: "Client Interviewer",
  },
  editClientInterviewer: {
    component: EditClient,
    title: "Edit Client Interviewer Details",
  },
  addPointOfContent: {
    component: AddPOC,
    title: "Add Point Of Content",
  },
  editPointOfContent: {
    component: EditPOC,
    title: "Edit Point Of Content",
  },
};
