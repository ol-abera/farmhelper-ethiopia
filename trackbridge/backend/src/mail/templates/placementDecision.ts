export const placementDecision = (ok: boolean, reason: string) =>
  ok ? `Your internship placement was approved. ${reason}` : `Your application was not approved: ${reason}`;
