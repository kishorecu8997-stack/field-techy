 interface StepsProps {
  selector: string;
  content: string;
  title: string;
}

export const steps: StepsProps[] = [
  {
    selector: "#welcome",
    title: "Welcome ",
    content:
      "✨ “Welcome aboard — every great story starts with a single visit.”",
  },
  {
    selector: "#exploreJobs",
    title: "ExploreJobs",
    content:
      "Explore Jobs Browse available jobs and find work that matches your skills.",
  },
  {
    selector: "#featuredJobs",
    title: "FeaturedJobs",
    content:
      "Featured Jobs Quickly apply to highlighted jobs with high demand.",
  },
  {
    selector: "#recommendedJobs",
    title: "RecommendedJobs",
    content:
      "Recommended Jobs Jobs suggested based on your profile and activity.",
  },
  {
    selector: "#myEarnings",
    title: "MyEarnings",
    content: "My Earnings Skip Track your total earnings from completed jobs.",
  },
  {
    selector: "#withdrawMoney",
    title: "WithdrawMoney",
    content:
      "Withdraw Money Skip Transfer your available balance to your bank account.",
  },
  {
    selector: "#completeProfile",
    title: "CompleteProfile",
    content:
      "Complete Your Profile Skip A higher profile score helps you get more jobs.",
  },
];
