export function saveListOrder(ids: number[], currentId?: number) {
  sessionStorage.setItem("lastListIds", JSON.stringify(ids));
  if (currentId !== undefined) {
    sessionStorage.setItem("lastCurrentId", String(currentId));
  }
}
export function loadListOrder(): number[] {
  try { return JSON.parse(sessionStorage.getItem("lastListIds") || "[]"); }
  catch { return []; }
}
