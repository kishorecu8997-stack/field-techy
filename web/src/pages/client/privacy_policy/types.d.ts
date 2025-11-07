export interface Feature {
  title: string;
  description: string;
}

export interface Section {
  title: string;
  items?: Feature[];
  content?: string; // optional
}
