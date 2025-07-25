import { createClient } from 'next-sanity';

// Only load write token on the server and ensure it exists
const writeToken = process.env.SANITY_WRITE_TOKEN;
if (!writeToken) {
  throw new Error('SANITY_WRITE_TOKEN must be set in environment for write operations');
}

export const writeClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2023-10-06',
  token: writeToken,
  useCdn: false,            // Never use CDN for writes
  ignoreBrowserTokenWarning: true, // Avoid accidental client-side leaks
});