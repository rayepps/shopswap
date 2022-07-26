import * as t from "src/core/types";
import slugger from "url-slug";
import { objectify } from "radash";

/**
 * Utility to create option's label
 * and key properties.
 */
const option = (label: string, weight: number) => ({
  label,
  key: slugger(label),
  weight,
});

//
// NOTE: Weight values should be between 1 and 100
//
export const QUESTIONS: t.Question[] = [
  {
    label: "Does your brand predominantly target men, women, or both?",
    comment: "Select one",
    key: "target-sex",
    type: "single-select",
    limit: null,
    otherable: false,
    weight: 50,
    catchall: "both",
    options: [
      option("men", 0.10001),
      option("women", 0.9999),
      option("both", 0.5),
    ],
  },
  {
    label: "What age ranges does your brand target?",
    key: "target-age-range",
    type: "multi-select",
    comment: "Select many",
    limit: null,
    otherable: false,
    catchall: null,
    weight: 50,
    options: [
      option("0-6 Years", 0.1),
      option("7-13 Years", 0.2),
      option("14-18 Years", 0.3),
      option("19-24 Years", 0.4),
      option("25-34 Years", 0.5),
      option("35-44 Years", 0.6),
      option("45-65 Years", 0.7),
      option("65+ Years", 0.8),
    ],
  },
  {
    label: "What income ranges does your brand target?",
    key: "target-income-range",
    type: "multi-select",
    comment: "Select many",
    limit: null,
    catchall: null,
    otherable: false,
    weight: 50,
    options: [
      option("0-50k/year", 0.1001),
      option("50k-100k/year", 0.3),
      option("100k-250k/year", 0.6),
      option("250k+ /year", 0.9999),
    ],
  },
  {
    label: "Does your brand target any of the following familial niches?",
    key: "target-family-niche",
    type: "multi-select",
    comment: "Select many",
    weight: 50,
    limit: null,
    otherable: false,
    catchall: null,
    options: [
      option("Singles", 0.1),
      option("Couples", 0.5),
      option("New Parents", 0.9999),
    ],
  },
  {
    label: "Does your brand target any of the following psychographic niches?",
    comment: "Select one",
    key: "target-psychographic-niche",
    type: "single-select",
    limit: null,
    catchall: null,
    weight: 50,
    otherable: true,
    options: [
      option("Adventurers/Outdoor Enthusiasts", 0.1),
      option("Alternative/Hipster", 0.2),
      option("Business Professionals", 0.3),
      option("Food & Cooking Enthusiasts", 0.4),
      option("Music Fans", 0.5),
      option("Politically Oriented", 0.6),
      option("Self-Improvement Enthusiasts", 0.7),
      option("Sports Fans", 0.8),
      option("Technology Enthusiasts", 0.9),
      option("Travelers", 0.1),
      option("Vegetarian/Vegans", 0.1),
    ],
  },
  {
    label: "Are you open to partnering with an international brand?",
    comment: "Select one",
    key: "is-international",
    type: "binary",
    limit: null,
    otherable: false,
    weight: 50,
    catchall: "true",
    options: [option("Yes", 0.1), option("No", 0.9999)],
  },
  {
    label: "Which values best fit with your brand?",
    key: "target-brand-values",
    type: "multi-select",
    comment: "Select many",
    limit: 5,
    catchall: null,
    weight: 50,
    otherable: true,
    options: [
      option("Affordability", 0.1),
      option("Charitable Support", 0.2),
      option("Convenience", 0.3),
      option("Gender Equality", 0.4),
      option("LGBTQ+ Ally", 0.5),
      option("Luxury", 0.6),
      option("Minimalism", 0.7),
      option("Quality", 0.8),
      option("Support for Minorities", 0.9),
      option("Sustainability", 0.1),
      option("Vegan", 0.2),
    ],
  },
  {
    label: "What kind of brand partnership would you like to run?",
    comment: "Select one",
    key: "brand-partnership",
    type: "single-select",
    limit: 1,
    catchall: null,
    weight: 50,
    otherable: false,
    options: [
      option("Social Media Cross-Promotion/Referral Marketing", 0.1),
      option("Product Giveaway", 0.2),
      option("Discount Code Giveaway", 0.3),
      option("Co-Branding", 0.4),
      option("Contest/Sweepstake", 0.5),
    ],
  },
];

export const QUESTIONS_BY_KEY = objectify(
  QUESTIONS,
  (q) => q.key,
  (q) => q
);

export const ALL_QUESTION_KEYS = QUESTIONS.map((q) => q.key);
