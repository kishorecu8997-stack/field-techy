export interface NetworkEngineerProposal {
  id: string;
  name: string;
  role: string;
  receivedOn: string;
  description: string;
  attachmentName?: string;
}

export const networkEngineerProposals: NetworkEngineerProposal[] = [
  {
    id: "albert",
    name: "Albert",
    role: "Network Engineer",
    receivedOn: "05 Apr 2026, 1:05PM",
    description:
      "I have hands-on experience as a Network Engineer in configuring, maintaining, and troubleshooting network systems. I have worked with LAN/WAN setups, IP camera installations, and NVR configuration. I can complete this job as per the given requirements and ensure proper testing and smooth network performance.",
    attachmentName: "Network ConfigurationSamples.pdf",
  },
  {
    id: "ram",
    name: "Ram",
    role: "Network Engineer",
    receivedOn: "31 Mar 2026, 5:30PM",
    description:
      "I am a Network Engineer with experience in network setup, cable routing, and device configuration. I have handled on-site installations and ensured stable connectivity and proper testing after setup. I follow standard practices and will complete the work within the given timeline.",
    attachmentName: "Site Installation Report.pdf",
  },
];
