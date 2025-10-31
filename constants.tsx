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
  ),
  tone: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-1-8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm3-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 4.25a.75.75 0 0 1 .75.75 2.5 2.5 0 0 1-5 0 .75.75 0 0 1 1.5 0 1 1 0 0 0 2 0 .75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
  ),
  storybook: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M2 5.25A3.25 3.25 0 0 1 5.25 2H10a.75.75 0 0 1 0 1.5H5.25a1.75 1.75 0 0 0-1.75 1.75v8.5A1.75 1.75 0 0 0 5.25 18H10a.75.75 0 0 1 0 1.5H5.25A3.25 3.25 0 0 1 2 16.75v-11.5Zm16 0A3.25 3.25 0 0 0 14.75 2H10a.75.75 0 0 0 0 1.5h4.75a1.75 1.75 0 0 1 1.75 1.75v8.5a1.75 1.75 0 0 1-1.75 1.75H10a.75.75 0 0 0 0 1.5h4.75a3.25 3.25 0 0 0 3.25-3.25v-11.5Z" clipRule="evenodd" />
    </svg>
  ),
  chevronDown: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
  ),
  search: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
    </svg>
  ),
  insert: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
      <path d="M9.155 5.244a.75.75 0 0 1-.34 1.285l-4.33 2.165a.25.25 0 0 0-.154.22v.004c.005.093.056.176.13.214l1.89 1.05a.75.75 0 1 1-.661 1.322l-1.89-1.05A1.75 1.75 0 0 1 3 12.25v-2.5a1.75 1.75 0 0 1 .86-1.52l4.33-2.165a.75.75 0 0 1 1.285.34Z" />
      <path d="M14.778 6.42a.75.75 0 0 1 .66 1.322l-1.889 1.05a.25.25 0 0 0-.13.214v.004a.25.25 0 0 0 .154.22l4.33 2.165A1.75 1.75 0 0 1 17 14.75v-2.5A1.75 1.75 0 0 1 15.14 10.73l-4.33-2.165a.75.75 0 0 1-.34 1.285l4.33 2.165a.25.25 0 0 0 .154.22v.004c.005.093.056.176.13.214l1.89 1.05a.75.75 0 1 1-.661 1.322l-1.89-1.05A1.75 1.75 0 0 1 13 14.75v-2.5a1.75 1.75 0 0 1 .86-1.52l4.33-2.165Z" />
    </svg>
  ),
  sun: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2Z M10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15Z M5.379 5.379a.75.75 0 0 1 0 1.06L6.44 7.5a.75.75 0 0 1-1.06 1.06L4.32 7.5a.75.75 0 0 1 1.06-1.06Zm8.182 8.182a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 0 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06ZM15 10a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 15 10ZM10 5a.75.75 0 0 1-.75-.75V2.75a.75.75 0 0 1 1.5 0V4.25A.75.75 0 0 1 10 5ZM3.75 10a.75.75 0 0 1-.75.75H1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75ZM7.5 6.44a.75.75 0 0 1 1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 1.06L9.62 6.44a.75.75 0 0 1-1.06 0L7.5 5.38a.75.75 0 0 1 0-1.06ZM12.5 13.56a.75.75 0 0 1 1.06-1.06l1.06-1.06a.75.75 0 1 1 1.06 1.06l-1.06 1.06a.75.75 0 0 1-1.06 0ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  ),
  moon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M7.455 2.164A8.969 8.969 0 0 0 6.545 6a8.969 8.969 0 0 0 9.455 9.455 8.969 8.969 0 0 0 3.836-.91A.75.75 0 0 1 19 15.336a10.47 10.47 0 0 1-5.336 5.336.75.75 0 0 1-.82-1.075 8.969 8.969 0 0 0-.91-3.836A8.969 8.969 0 0 0 6 6.545a8.969 8.969 0 0 0-.91-3.836.75.75 0 0 1 1.075-.82Z" clipRule="evenodd" />
    </svg>
  ),
  export: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
      <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
    </svg>
  )
};

export const FONT_FAMILIES = [
  { name: 'Inter', value: '"Inter", sans-serif' },
  { name: 'Lora', value: '"Lora", serif' },
  { name: 'Source Serif', value: '"Source Serif Pro", serif' },
  { name: 'Roboto Mono', value: '"Roboto Mono", monospace' },
];

export const FONT_SIZES = ['14px', '16px', '18px', '20px', '22px'];