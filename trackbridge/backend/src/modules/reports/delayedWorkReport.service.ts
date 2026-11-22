import { computeWarnings } from '../ai/earlyWarning.service.js';

export async function delayedWorkData() {
  return computeWarnings();
}
