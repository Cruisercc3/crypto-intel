// The site has no backend for messages. Forms post straight to Formspree from
// the browser, which emails each submission on.
// The form id is masked in this public copy. Put your own Formspree form id here.
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/••••••••"

export async function submitForm(fields: Record<string, string>) {
  const res = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(fields),
  })
  if (!res.ok) {
    const json = await res.json().catch(() => null)
    const msg = json?.errors?.[0]?.message || `The form service returned HTTP ${res.status}`
    throw new Error(msg)
  }
}
