interface PersonalInfo {
  fullName: string;
  phoneNumber: string;
  emailId: string;
  addressLocation: string;
}

interface LoginInfo extends PersonalInfo {}

const loginData: LoginInfo[] = [
  {
    fullName: "Nick Wilson",
    phoneNumber: "+91 9988552200",
    emailId: "nike@fieldtechy.com",
    addressLocation: "7 Tech Boulevard, TNagar, Chennai 600017",
  },
];

// Export types and data
export type { PersonalInfo};
export { loginData };