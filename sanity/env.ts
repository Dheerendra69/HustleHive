// Only exports public Sanity configuration to avoid leaking tokens
const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;

if (!projectId) {
  throw new Error('SANITY_PROJECT_ID is required');
}
if (!dataset) {
  throw new Error('SANITY_DATASET is required');
}

export const env = {
  SANITY_PROJECT_ID: projectId,
  SANITY_DATASET: dataset,
};