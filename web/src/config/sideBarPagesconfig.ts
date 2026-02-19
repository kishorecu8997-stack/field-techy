/* eslint-disable @typescript-eslint/no-explicit-any */
import NotificationPreferences from "@/pages/engineer/account_settings/notification/NotificationPreferences";
import ActiveSessions from "@/pages/engineer/auth/components/ActiveSessions";
import LoginHistory from "@/pages/engineer/auth/components/LoginHistory";
import SecurityPage from "@/pages/engineer/auth/components/SecurityPage";
import React from "react";

const ClientAccountDrawerMenu = React.lazy(
  () => import("@/pages/client/my_account/ClientAccountDrawerMenu"),
);
const ClientAddFund = React.lazy(
  () => import("@/pages/client/my_wallet/components/AddFund"),
);
const ClientRecentTransactions = React.lazy(
  () => import("@/pages/client/my_wallet/components/RecentTransactionsList"),
);
const ClientWalletComponent = React.lazy(
  () => import("@/pages/client/my_wallet/components/WalletComponent"),
);
const AddClient = React.lazy(
  () =>
    import("@/pages/client/post_job/PostAJobComponent/client_Interview/AddClient"),
);
const AddPOC = React.lazy(
  () =>
    import("@/pages/client/post_job/PostAJobComponent/client_Interview/AddPOC"),
);
const EditClient = React.lazy(
  () =>
    import("@/pages/client/post_job/PostAJobComponent/client_Interview/EditClient"),
);
const EditPOC = React.lazy(
  () =>
    import("@/pages/client/post_job/PostAJobComponent/client_Interview/EditPOC"),
);
const AccountSettings = React.lazy(
  () => import("@/pages/engineer/account_settings"),
);
const AddBankDetails = React.lazy(
  () => import("@/pages/engineer/account_settings/bank_details/AddBankDetails"),
);
const BankAccountList = React.lazy(
  () =>
    import("@/pages/engineer/account_settings/bank_details/BankAccountList"),
);
const EditBankDetails = React.lazy(
  () =>
    import("@/pages/engineer/account_settings/bank_details/EditBankDetails"),
);
const MyEarning = React.lazy(
  () => import("@/pages/engineer/account_settings/bank_details/MyEarning"),
);
const Withdraw = React.lazy(
  () => import("@/pages/engineer/account_settings/bank_details/Withdraw"),
);
const ChangePassword = React.lazy(
  () => import("@/pages/engineer/account_settings/ChangePassword"),
);
const ContactUs = React.lazy(
  () => import("@/pages/engineer/account_settings/contact_us/ContactUs"),
);
const NotificationPage = React.lazy(
  () =>
    import("@/pages/engineer/account_settings/notification/NotificationPage"),
);
const MyAccountDrawerMenu = React.lazy(
  () => import("@/pages/engineer/my_account"),
);
const CancelJopOffer = React.lazy(
  () => import("@/pages/engineer/my_job/job_details_components/CancelJopOffer"),
);
const EditDocument = React.lazy(
  () =>
    import("@/pages/engineer/user_profile/components/documents/components/EditDocument"),
);
const Documents = React.lazy(
  () => import("@/pages/engineer/user_profile/components/documents/Documents"),
);
const AddEducation = React.lazy(
  () =>
    import("@/pages/engineer/user_profile/components/education/AddEducation"),
);
const EditEducation = React.lazy(
  () =>
    import("@/pages/engineer/user_profile/components/education/EditEducation"),
);
const Education = React.lazy(
  () => import("@/pages/engineer/user_profile/components/education/Education"),
);
const AddExperiences = React.lazy(
  () =>
    import("@/pages/engineer/user_profile/components/experiences/components/AddExperiences"),
);
const EditExperiences = React.lazy(
  () =>
    import("@/pages/engineer/user_profile/components/experiences/components/EditExperiences"),
);
const Experiences = React.lazy(
  () =>
    import("@/pages/engineer/user_profile/components/experiences/Experiences"),
);
const PersonalInformation = React.lazy(
  () =>
    import("@/pages/engineer/user_profile/components/PersonalInformation/PersonalInformation"),
);
const AddSkills = React.lazy(
  () =>
    import("@/pages/engineer/user_profile/components/skills_and_tools/components/AddSkills"),
);
const AddTools = React.lazy(
  () =>
    import("@/pages/engineer/user_profile/components/skills_and_tools/components/AddTools"),
);
const EditSkills = React.lazy(
  () =>
    import("@/pages/engineer/user_profile/components/skills_and_tools/components/EditSkills"),
);
const EditTools = React.lazy(
  () =>
    import("@/pages/engineer/user_profile/components/skills_and_tools/components/EditTools"),
);
const SkillsAndTools = React.lazy(
  () =>
    import("@/pages/engineer/user_profile/components/skills_and_tools/SkillsAndTools"),
);
const WorkPreference = React.lazy(
  () =>
    import("@/pages/engineer/user_profile/components/WorkPreference/WorkPreference"),
);
const UserProfileSidebar = React.lazy(
  () => import("@/pages/engineer/user_profile/UserProfileSidebar"),
);
const AccountSettingsDrawerMenu = React.lazy(
  () => import("@/pages/client/account_settings"),
);
const ClientDocuments = React.lazy(
  () =>
    import("@/pages/client/my_account/components/documents/ClientDocuments"),
);
const ClientEditDocument = React.lazy(
  () =>
    import("@/pages/client/my_account/components/documents/components/ClientEditDocument"),
);
const ClientPersonalInformation = React.lazy(
  () =>
    import("@/pages/client/my_account/components/PersonalInformation/ClientPersonalInformation"),
);
const DrawerPaymentSection = React.lazy(
  () => import("@/pages/client/my_account/DrawerPaymentSection"),
);
const AddProject = React.lazy(
  () => import("@/pages/client/my_projects/projectDetail/AddProject"),
);
const EditProject = React.lazy(
  () => import("@/pages/client/my_projects/projectDetail/EditProject"),
);
const AddProjectMember = React.lazy(
  () =>
    import("@/pages/client/my_projects/createProject/components/AddProjectMember"),
);
const AddExistingFTMember = React.lazy(
  () =>
    import("@/pages/client/my_projects/createProject/components/AddExistingFTMember"),
);
const EditProjectMember = React.lazy(
  () =>
    import("@/pages/client/my_projects/createProject/components/EditProjectMember"),
);
const Feedback = React.lazy(
  () => import("@/pages/client/my_job_client/components/FeedbackForm"),
);
const ClientNotification = React.lazy(
  () => import("@/pages/client/messages/ClientNotification"),
);

const RecentTransactionsModule =
  import("@/pages/client/my_wallet/components/RecentTransactionsList");

const ActionButtonsForRecentTransactions = React.lazy(() =>
  RecentTransactionsModule.then((module) => ({
    default: module.ActionButtonsForRecentTransactions,
  })),
);
const ProfileCompletionCard = React.lazy(
  () =>
    import("@/pages/engineer/user_profile/profile_completion/ProfileCompletionCard"),
);
const AllTransactionsPage = React.lazy(
  () =>
    import("@/pages/engineer/account_settings/bank_details/AllTransactionsPage"),
);
const FeedbackFromEngineer = React.lazy(
  () =>
    import("@/pages/client/manage_proposal/components/ViewEngineerFeedbackSidebar"),
);

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
    title: "My Earnings",
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
  NotificationPreferences: {
    component: NotificationPreferences,
    title: "Notification",
    parent: "settings",
  },
  myEarning: { component: MyEarning, title: "My Earnings" },
  withdraw: { component: Withdraw, title: "Withdraw", parent: "myEarning" },
  notification: {
    component: NotificationPage,
    title: "Notification",
  },
  security: {
    component: SecurityPage,
    title: "Security",
    parent: "settings",
  },
  loginHistory: {
    component: LoginHistory,
    title: "Login History",
    parent: "settings",
  },
  clientNotification: {
    component: ClientNotification,
    title: "Notification",
  },
  profileCompletion: {
    component: ProfileCompletionCard,
    title: "Profile Completion",
    parent: "profile",
  },
  activeSessions: {
    component: ActiveSessions,
    title: "Active Sessions",
    parent: "settings",
  },

  //client
  clientAccount: { component: ClientAccountDrawerMenu, title: "My Profile" },
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
    component: DrawerPaymentSection,
    title: "Payment Methods",
    parent: "clientAccount",
  },
  changePwd: {
    component: ChangePassword,
    title: "Change Password",
    parent: "clientAccount",
  },
  clientAcc: {
    component: AccountSettingsDrawerMenu,
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

  addclientProject: {
    component: AddProject,
    title: "Add Project Site",
  }, // myAccount: { component: MyAccountDrawerMenu, title: "My Account" },

  editclientProject: {
    component: EditProject,
    title: "Edit Project Site",
  },
  clientFeedback: { component: Feedback, title: "Rate Client" },
  addProjectMember: {
    component: AddProjectMember,
    title: "Add New Project Member",
  },

  addExistingProjectMember: {
    component: AddExistingFTMember,
    title: "Add Existing FT Project Member",
  },

  editProjectMember: {
    component: EditProjectMember,
    title: "Edit Project Member Details",
  },
  engineerRecentTransactions: {
    component: AllTransactionsPage,
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
  addPointOfContact: {
    component: AddPOC,
    title: "Add Point of Contact",
  },
  editPointOfContent: {
    component: EditPOC,
    title: "Edit Point of Contact",
  },
  engineerFromFeedback: { component: FeedbackFromEngineer, title: "Feedback From Engineers", },
};
