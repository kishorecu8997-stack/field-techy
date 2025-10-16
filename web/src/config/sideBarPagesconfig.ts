import AccountSettings from "@/pages/account_settings";
import BankAccountList from "@/pages/account_settings/BankAccountList";
import ChangePassword from "@/pages/account_settings/ChangePassword";
import MyAccountDrawerMenu from "@/pages/my_account";

 export  const sectionConfig: Record<
    string,
    {
      component: React.ComponentType<any> | string;
      title: string;
      parent?: string;
    }
  > = {
    myAccount: { component: MyAccountDrawerMenu, title: "My Account" },
    profile: { component: () => "test", title: "My Profile" },
    personalInfo: {
      component: "test",
      title: "Personal Information",
      parent: "profile",
    },
    education: {
      component: "test",
      title: "Education",
      parent: "profile",
    },
    addEducation: {
      component: () => "test",
      title: "Add Education",
      parent: "education",
    },
    editEducation: {
      component: () => "test",
      title: "Edit Education",
      parent: "education",
    },
    skillsAndTools: {
      component: () => "test",
      title: "Skills & Tools",
      parent: "profile",
    },
    addSkills: {
      component: () => "test<",
      title: "Add Skills",
      parent: "skillsAndTools",
    },
    editSkills: {
      component: () => "test",
      title: "Edit Skills",
      parent: "skillsAndTools",
    },
    addTools: {
      component: () => "test",
      title: "Add Tools",
      parent: "skillsAndTools",
    },
    editTools: {
      component: () => "test",
      title: "Edit Tools",
      parent: "skillsAndTools",
    },
    experiences: {
      component: () => "test",
      title: "Experiences",
      parent: "profile",
    },
    addExperiences: {
      component: () => "test",
      title: "Add Experience",
      parent: "experiences",
    },
    editExperiences: {
      component: () => "test",
      title: "Edit Experience",
      parent: "experiences",
    },
    workPreference: {
      component: () => "test",
      title: "Work Preference",
      parent: "profile",
    },
    documents: {
      component: () => "test",
      title: "Documents",
      parent: "profile",
    },
    editDocument: {
      component: () => "test",
      title: "Edit Document",
      parent: "documents",
    },
    jobs: { component: () => "job", title: "My Jobs" },
    earning: {
      component: () =>"test",
      title: "My Earning",
    },
    saved: { component: () => "test", title: "Saved Jobs" },
    settings: { component: AccountSettings, title: "Account Settings" },
    changePassword: {
      component: ChangePassword,
      title: "Change Password",
      parent: "settings",
    },
    manageBankAccounts: {
      component: BankAccountList,
      title: "Manage Bank Accounts",
      parent: "settings",
    },
  };