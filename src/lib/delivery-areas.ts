export type DeliveryAreaOption = {
  value: string;
  label: string;
  districts: Array<{
    value: string;
    label: string;
    thanas: Array<{
      value: string;
      label: string;
    }>;
  }>;
};

export const VEHICLE_OPTIONS = [
  { value: "bike", label: "Bike" },
  { value: "scooter", label: "Scooter" },
  { value: "motorcycle", label: "Motorcycle" },
  { value: "cycle", label: "Cycle" },
  { value: "van", label: "Van" },
];

export const DELIVERY_AREAS: DeliveryAreaOption[] = [
  {
    value: "dhaka",
    label: "Dhaka",
    districts: [
      {
        value: "dhaka",
        label: "Dhaka",
        thanas: [
          { value: "dhanmondi", label: "Dhanmondi" },
          { value: "uttara", label: "Uttara" },
          { value: "mirpur", label: "Mirpur" },
        ],
      },
      {
        value: "gazipur",
        label: "Gazipur",
        thanas: [
          { value: "tongi", label: "Tongi" },
          { value: "joydebpur", label: "Joydebpur" },
        ],
      },
      {
        value: "narayanganj",
        label: "Narayanganj",
        thanas: [
          { value: "siddhirganj", label: "Siddhirganj" },
          { value: "narayanganj-sadar", label: "Narayanganj Sadar" },
        ],
      },
    ],
  },
  {
    value: "chattogram",
    label: "Chattogram",
    districts: [
      {
        value: "chattogram",
        label: "Chattogram",
        thanas: [
          { value: "pahartali", label: "Pahartali" },
          { value: "kotwali", label: "Kotwali" },
        ],
      },
      {
        value: "coxsbazar",
        label: "Cox's Bazar",
        thanas: [
          { value: "coxsbazar-sadar", label: "Cox's Bazar Sadar" },
          { value: "teknaf", label: "Teknaf" },
        ],
      },
    ],
  },
  {
    value: "khulna",
    label: "Khulna",
    districts: [
      {
        value: "khulna",
        label: "Khulna",
        thanas: [
          { value: "sonadanga", label: "Sonadanga" },
          { value: "khulna-sadar", label: "Khulna Sadar" },
        ],
      },
      {
        value: "jashore",
        label: "Jashore",
        thanas: [
          { value: "jashore-sadar", label: "Jashore Sadar" },
          { value: "bagharpara", label: "Bagharpara" },
        ],
      },
    ],
  },
  {
    value: "rajshahi",
    label: "Rajshahi",
    districts: [
      {
        value: "rajshahi",
        label: "Rajshahi",
        thanas: [
          { value: "boalia", label: "Boalia" },
          { value: "motihar", label: "Motihar" },
        ],
      },
      {
        value: "bogura",
        label: "Bogura",
        thanas: [
          { value: "bogura-sadar", label: "Bogura Sadar" },
          { value: "shibganj-bogura", label: "Shibganj" },
        ],
      },
    ],
  },
];
