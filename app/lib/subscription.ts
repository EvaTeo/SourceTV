export const SUBSCRIPTION = {
  premium: {
    name: "SourceTV Premium",

    monthlyPrice: 8.99,

    currency: "USD",

    stripe: {
  monthlyPriceId: "price_1TpkxuGwiqTjJguju8CcsWQS",
  yearlyPriceId: "",
},

    features: [
      "Skip eligible commercial ads",
      "Highest streaming quality",
      "Early access to new SourceTV features",
      "Support independent creators",
    ],

    marketing: {
      popupTitle: "Upgrade to SourceTV Premium",

      popupDescription:
        "Enjoy skippable commercial ads, premium streaming quality, and help support the future of independent entertainment.",

      upgradeButton: "Upgrade for $8.99/month",
    },
  },
} as const;