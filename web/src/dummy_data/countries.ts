export interface CountryOption {
  value: string;
  label: string;
}

export interface LocationOption {
  value: string;
  label: string;
}

export const countries: CountryOption[] = [
  { value: "in", label: "India" },
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "au", label: "Australia" },
  { value: "sg", label: "Singapore" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "za", label: "South Africa" },
  { value: "ae", label: "United Arab Emirates" },
];

export const statesByCountry: Record<string, LocationOption[]> = {
  in: [
    { value: "ka", label: "Karnataka" },
    { value: "mh", label: "Maharashtra" },
    { value: "dl", label: "Delhi" },
    { value: "tn", label: "Tamil Nadu" },
    { value: "gj", label: "Gujarat" },
  ],
  us: [
    { value: "ca", label: "California" },
    { value: "ny", label: "New York" },
    { value: "tx", label: "Texas" },
    { value: "fl", label: "Florida" },
    { value: "il", label: "Illinois" },
  ],
  ca: [
    { value: "on", label: "Ontario" },
    { value: "bc", label: "British Columbia" },
    { value: "qc", label: "Quebec" },
    { value: "ab", label: "Alberta" },
  ],
  uk: [
    { value: "eng", label: "England" },
    { value: "sct", label: "Scotland" },
    { value: "wls", label: "Wales" },
    { value: "nir", label: "Northern Ireland" },
  ],
  au: [
    { value: "nsw", label: "New South Wales" },
    { value: "vic", label: "Victoria" },
    { value: "qld", label: "Queensland" },
    { value: "wa", label: "Western Australia" },
  ],
  sg: [{ value: "sg-all", label: "Singapore" }],
  de: [
    { value: "be", label: "Berlin" },
    { value: "by", label: "Bavaria" },
    { value: "nw", label: "North Rhine-Westphalia" },
  ],
  fr: [
    { value: "idf", label: "Île-de-France" },
    { value: "ara", label: "Auvergne-Rhône-Alpes" },
    { value: "pdl", label: "Pays de la Loire" },
  ],
  za: [
    { value: "gp", label: "Gauteng" },
    { value: "wc", label: "Western Cape" },
    { value: "kzn", label: "KwaZulu-Natal" },
  ],
  ae: [
    { value: "du", label: "Dubai" },
    { value: "ab", label: "Abu Dhabi" },
    { value: "shj", label: "Sharjah" },
  ],
};

export const citiesByState: Record<string, LocationOption[]> = {
  ka: [
    { value: "blr", label: "Bengaluru" },
    { value: "mys", label: "Mysuru" },
  ],
  mh: [
    { value: "bom", label: "Mumbai" },
    { value: "pune", label: "Pune" },
  ],
  dl: [
    { value: "nd", label: "New Delhi" },
    { value: "dwk", label: "Dwarka" },
  ],
  tn: [
    { value: "chn", label: "Chennai" },
    { value: "cbe", label: "Coimbatore" },
  ],
  gj: [
    { value: "ahm", label: "Ahmedabad" },
    { value: "sur", label: "Surat" },
  ],
  ca: [
    { value: "la", label: "Los Angeles" },
    { value: "sf", label: "San Francisco" },
    { value: "sd", label: "San Diego" },
  ],
  ny: [
    { value: "nyc", label: "New York City" },
    { value: "buf", label: "Buffalo" },
  ],
  tx: [
    { value: "aus", label: "Austin" },
    { value: "dal", label: "Dallas" },
  ],
  fl: [
    { value: "mia", label: "Miami" },
    { value: "orl", label: "Orlando" },
  ],
  il: [
    { value: "chi", label: "Chicago" },
    { value: "nap", label: "Naperville" },
  ],
  on: [
    { value: "tor", label: "Toronto" },
    { value: "ott", label: "Ottawa" },
  ],
  bc: [
    { value: "van", label: "Vancouver" },
    { value: "vic", label: "Victoria" },
  ],
  qc: [
    { value: "mtl", label: "Montreal" },
    { value: "qcc", label: "Quebec City" },
  ],
  ab: [
    { value: "cal", label: "Calgary" },
    { value: "edm", label: "Edmonton" },
  ],
  eng: [
    { value: "ldn", label: "London" },
    { value: "man", label: "Manchester" },
  ],
  sct: [
    { value: "edi", label: "Edinburgh" },
    { value: "gla", label: "Glasgow" },
  ],
  wls: [
    { value: "cwl", label: "Cardiff" },
    { value: "swa", label: "Swansea" },
  ],
  nir: [
    { value: "bfs", label: "Belfast" },
    { value: "der", label: "Derry" },
  ],
  nsw: [
    { value: "syd", label: "Sydney" },
    { value: "ncl", label: "Newcastle" },
  ],
  vic: [
    { value: "mel", label: "Melbourne" },
    { value: "geo", label: "Geelong" },
  ],
  qld: [
    { value: "bne", label: "Brisbane" },
    { value: "cns", label: "Cairns" },
  ],
  wa: [
    { value: "per", label: "Perth" },
    { value: "fre", label: "Fremantle" },
  ],
  "sg-all": [{ value: "sg", label: "Singapore" }],
  be: [{ value: "ber", label: "Berlin" }],
  by: [
    { value: "muc", label: "Munich" },
    { value: "nue", label: "Nuremberg" },
  ],
  nw: [
    { value: "dus", label: "Düsseldorf" },
    { value: "cgn", label: "Cologne" },
  ],
  idf: [
    { value: "par", label: "Paris" },
    { value: "vrs", label: "Versailles" },
  ],
  ara: [
    { value: "lyo", label: "Lyon" },
    { value: "gre", label: "Grenoble" },
  ],
  pdl: [
    { value: "nan", label: "Nantes" },
    { value: "sai", label: "Saint-Nazaire" },
  ],
  gp: [
    { value: "jhb", label: "Johannesburg" },
    { value: "pta", label: "Pretoria" },
  ],
  wc: [
    { value: "cpt", label: "Cape Town" },
    { value: "stel", label: "Stellenbosch" },
  ],
  kzn: [
    { value: "dbn", label: "Durban" },
    { value: "pm", label: "Pietermaritzburg" },
  ],
  du: [{ value: "dxb", label: "Dubai" }],
  shj: [{ value: "shj-city", label: "Sharjah" }],
};

export default countries;
