// ================================================================
// SPENDLENS PRICING DATA
// All prices in USD per month
// Sources documented in PRICING_DATA.md
// Last verified: May 2025
// ================================================================

export interface PlanDetails {
  name: string;
  pricePerSeat: number;
  minSeats: number;
  bestFor: string;
}

export interface ToolPricing {
  displayName: string;
  plans: Record<string, PlanDetails>;
}

export const PRICING: Record<string, ToolPricing> = {
  cursor: {
    displayName: "Cursor",
    plans: {
      hobby: {
        name: "Hobby",
        pricePerSeat: 0,
        minSeats: 1,
        bestFor: "Occasional use, trying out AI coding",
      },
      pro: {
        name: "Pro",
        pricePerSeat: 20,
        minSeats: 1,
        bestFor: "Individual developers, daily coding",
      },
      business: {
        name: "Business",
        pricePerSeat: 40,
        minSeats: 1,
        bestFor: "Teams needing admin controls and SSO",
      },
      enterprise: {
        name: "Enterprise",
        pricePerSeat: 60,
        minSeats: 20,
        bestFor: "Large orgs with compliance requirements",
      },
    },
  },

  "github-copilot": {
    displayName: "GitHub Copilot",
    plans: {
      individual: {
        name: "Individual",
        pricePerSeat: 10,
        minSeats: 1,
        bestFor: "Solo developers",
      },
      business: {
        name: "Business",
        pricePerSeat: 19,
        minSeats: 1,
        bestFor: "Teams needing policy management",
      },
      enterprise: {
        name: "Enterprise",
        pricePerSeat: 39,
        minSeats: 1,
        bestFor: "Large orgs needing fine-tuned models",
      },
    },
  },

  claude: {
    displayName: "Claude",
    plans: {
      free: {
        name: "Free",
        pricePerSeat: 0,
        minSeats: 1,
        bestFor: "Casual use, trying Claude",
      },
      pro: {
        name: "Pro",
        pricePerSeat: 20,
        minSeats: 1,
        bestFor: "Heavy individual use",
      },
      max: {
        name: "Max",
        pricePerSeat: 100,
        minSeats: 1,
        bestFor: "Power users needing highest limits",
      },
      team: {
        name: "Team",
        pricePerSeat: 30,
        minSeats: 5,
        bestFor: "Teams of 5+ needing collaboration",
      },
      enterprise: {
        name: "Enterprise",
        pricePerSeat: 60,
        minSeats: 10,
        bestFor: "Large orgs with security requirements",
      },
    },
  },

  chatgpt: {
    displayName: "ChatGPT",
    plans: {
      free: {
        name: "Free",
        pricePerSeat: 0,
        minSeats: 1,
        bestFor: "Casual use",
      },
      plus: {
        name: "Plus",
        pricePerSeat: 20,
        minSeats: 1,
        bestFor: "Individual power users",
      },
      team: {
        name: "Team",
        pricePerSeat: 30,
        minSeats: 2,
        bestFor: "Small teams needing shared workspace",
      },
      enterprise: {
        name: "Enterprise",
        pricePerSeat: 60,
        minSeats: 10,
        bestFor: "Large orgs needing SSO and compliance",
      },
    },
  },

  "anthropic-api": {
    displayName: "Anthropic API",
    plans: {
      "pay-as-you-go": {
        name: "Pay as you go",
        pricePerSeat: 0,
        minSeats: 1,
        bestFor: "Developers building on Claude directly",
      },
    },
  },

  "openai-api": {
    displayName: "OpenAI API",
    plans: {
      "pay-as-you-go": {
        name: "Pay as you go",
        pricePerSeat: 0,
        minSeats: 1,
        bestFor: "Developers building on GPT directly",
      },
    },
  },

  gemini: {
    displayName: "Gemini",
    plans: {
      free: {
        name: "Free",
        pricePerSeat: 0,
        minSeats: 1,
        bestFor: "Casual use",
      },
      pro: {
        name: "Gemini Advanced",
        pricePerSeat: 19.99,
        minSeats: 1,
        bestFor: "Power users needing Gemini Ultra",
      },
      business: {
        name: "Google One AI Premium",
        pricePerSeat: 19.99,
        minSeats: 1,
        bestFor: "Individuals wanting Google ecosystem",
      },
    },
  },

  windsurf: {
    displayName: "Windsurf",
    plans: {
      free: {
        name: "Free",
        pricePerSeat: 0,
        minSeats: 1,
        bestFor: "Trying out AI coding",
      },
      pro: {
        name: "Pro",
        pricePerSeat: 15,
        minSeats: 1,
        bestFor: "Individual developers",
      },
      teams: {
        name: "Teams",
        pricePerSeat: 30,
        minSeats: 1,
        bestFor: "Teams needing collaboration",
      },
    },
  },
};

// Alternative tool suggestions per use case
// Used when recommending a switch to a different tool
export const ALTERNATIVES: Record<string, Partial<Record<string, string>>> = {
  cursor: {
    coding: "windsurf", // Cheaper at $15/seat vs $20
  },
  "github-copilot": {
    coding: "cursor", // More capable for same price range
  },
  chatgpt: {
    writing: "claude",   // Claude Pro better for writing
    coding: "cursor",    // Cursor better for coding
    research: "claude",  // Claude better for long context research
  },
  claude: {
    coding: "cursor",    // Cursor purpose-built for coding
  },
};