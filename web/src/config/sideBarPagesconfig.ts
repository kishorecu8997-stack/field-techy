import AccountSettings from "@/pages/account_settings";
import AddBankDetails from "@/pages/account_settings/bank_details/AddBankDetails";
import BankAccountList from "@/pages/account_settings/bank_details/BankAccountList";
import EditBankDetails from "@/pages/account_settings/bank_details/EditBankDetails";
import ChangePassword from "@/pages/account_settings/ChangePassword";
import ContactUs from "@/pages/account_settings/contect_us/ContactUs";
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
    settings: { component: AccountSettings, title: "Account Settings", parent: "myAccount" },
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
    contactUs: { component:  ContactUs, title: "Contact Us", parent: "settings" },
  };