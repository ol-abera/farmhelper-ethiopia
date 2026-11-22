export function errMsg(e: unknown) {
  if (e instanceof Error) return e.message;
  return 'Something went wrong';
}
