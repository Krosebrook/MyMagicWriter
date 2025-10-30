
import React from 'react';

export const SYSTEM_INSTRUCTION = "You are a world-class writing assistant. You speak in the Chaos Club voice: punchy, clever, warm-edgy, stigma-free, inclusive. Normalize struggle, celebrate progress, no clinical diagnosis or medical claims. No toxic positivity. Be kind, concise, and practical. When asked to rewrite or iterate, you should only return the modified text, without any preamble or explanation.";

export const ICONS = {
  sparkle: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M10.868 2.884c.321.64.321 1.415 0 2.055L7.84 9.94a.75.75 0 0 1-1.06 0L4.72 7.884a.75.75 0 0 1 0-1.06l3.06-3.06a.75.75 0 0 1 1.06 0Zm3.714 6.052a.75.75 0 0 1-1.06 0L10.46 5.884a.75.75 0 0 1 0-1.06l3.06-3.06a.75.75 0 0 1 1.06 0l2.056 2.056a.75.75 0 0 1 0 1.06l-3.06 3.06Z" />
      <path d="m10.745 12.432 2.023 2.023a.75.75 0 0 1 0 1.06l-3.06 3.06a.75.75 0 0 1-1.06 0l-2.056-2.056a.75.75 0 0 1 0-1.06l3.06-3.06a.75.75 0 0 1 1.06 0Z" />
    </svg>
  ),
  send: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M3.105 3.105a.75.75 0 0 1 .954-.318l12 5a.75.75 0 0 1 0 1.426l-12 5A.75.75 0 0 1 3 13V4a.75.75 0 0 1 .105-.395Z" />
    </svg>
  ),
  lightbulb: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M10 2a.75.75 0 0 1 .75.75v1.25a.75.75 0 0 1-1.5 0V2.75A.75.75 0 0 1 10 2ZM10 18a.75.75 0 0 1 .75.75v.25a.75.75 0 0 1-1.5 0v-.25A.75.75 0 0 1 10 18ZM14.828 5.172a.75.75 0 0 1 0 1.06l-.884.884a.75.75 0 0 1-1.06-1.06l.884-.884a.75.75 0 0 1 1.06 0ZM6.95 13.05a.75.75 0 0 1 0 1.06l-.884.884a.75.75 0 0 1-1.06-1.06l.884-.884a.75.75 0 0 1 1.06 0Zm10.299-5.878a.75.75 0 0 1 1.06 0l.884.884a.75.75 0 0 1-1.06 1.06l-.884-.884a.75.75 0 0 1 0-1.06ZM3.711 6.232a.75.75 0 0 1 1.06 0l.884.884a.75.75 0 0 1-1.06 1.06L3.71 7.293a.75.75 0 0 1 0-1.061Zm0 6.817a.75.75 0 0 1 1.06 0l-.884.884a.75.75 0 1 1-1.06-1.06l.884-.884ZM15.889 6.232a.75.75 0 0 1 1.06 1.06l-.884.884a.75.75 0 0 1-1.06-1.06l.884-.884ZM6.066 15.934a.75.75 0 0 1 1.06 0l-.884.884a.75.75 0 0 1-1.06-1.06l.884-.884ZM18 10a.75.75 0 0 1-.75.75h-1.25a.75.75 0 0 1 0-1.5h1.25A.75.75 0 0 1 18 10ZM4.75 10a.75.75 0 0 1-.75.75H2a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 4.75 10Z" />
      <path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12ZM8.5 7.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 0-.75.75v.5a.75.75 0 0 1-1.5 0v-.5A2.25 2.25 0 0 1 8.5 9.25v-2Z" />
    </svg>
  )
};
