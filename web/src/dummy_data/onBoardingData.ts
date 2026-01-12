interface StepsProps {
  selector: string;
  content: string;
  title: string;
}

export const steps: StepsProps[] = [
  {
    selector: "#welcome",
    title: "Welcome ",
    content: "✨Every great story starts with a single visit.",
  },
  {
    selector: "#exploreJobs",
    title: "Explore Jobs",
    content: "Browse available jobs and find work that matches your skills.",
  },
  {
    selector: "#featuredJobs",
    title: "Featured Jobs",
    content: "Quickly apply to highlighted jobs with high demand.",
  },
  {
    selector: "#recommendedJobs",
    title: "Recommended Jobs",
    content: "Jobs suggested based on your profile and activity.",
  },
  {
    selector: "#myEarnings",
    title: "My Earnings",
    content: "Track your total earnings from completed jobs.",
  },
  {
    selector: "#withdrawMoney",
    title: "Withdraw Money",
    content: "Transfer your available balance to your bank account.",
  },
  {
    selector: "#completeProfile",
    title: "Complete Your Profile",
    content: "A higher profile score helps you get more jobs.",
  },
];
