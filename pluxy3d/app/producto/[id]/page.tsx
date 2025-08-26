import { redirect } from "next/navigation"

// Deprecated route: redirect to canonical /productos/id/:id
export default function LegacyProductPage({ params }: { params: { id: string } }) {
  redirect(`/productos/id/${params.id}`)
}
