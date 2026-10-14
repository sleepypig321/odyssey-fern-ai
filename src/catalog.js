// PROVISIONAL catalog labels provided by the owner.
// No prices, dosages, active-compound strength, inventory, or ingredient claims are verified.
// Review against current product labels before public deployment.
export const CATALOG = {
  reviewed: false,
  lastVerified: null,
  currency: "USD",
  categories: [
    {
      name: "Kratom capsules",
      knownLabels: [
        "Yellow Maeng Da", "Green Maeng Da", "Red Maeng Da", "White Maeng Da"
      ],
      knownPackages: ["80-count", "140-count"],
      verifiedInStock: false
    },
    {
      name: "Kratom powder",
      knownLabels: [
        "Yellow Maeng Da", "Green Maeng Da", "Red Maeng Da", "White Maeng Da"
      ],
      knownPackages: ["100 g"],
      verifiedInStock: false
    },
    {
      name: "Botanical shots",
      knownLabels: ["Lime", "Butterscotch", "Coffee"],
      knownPackages: [],
      verifiedInStock: false,
      note: "Flavor names are known, but extract type, ingredient composition, and concentration must be confirmed from labels."
    },
    {
      name: "Flower",
      knownLabels: [],
      knownPackages: [],
      verifiedInStock: false,
      note: "Category known, but product type, strain names and status have not been verified."
    }
  ]
};

export function publicCatalog() {
  return {
    reviewed: CATALOG.reviewed,
    categories: CATALOG.categories.map(({name, knownLabels, knownPackages}) => ({
      name, knownLabels, knownPackages
    })),
    disclaimer: "This is an unverified reference list, not live availability or product advice."
  };
}
