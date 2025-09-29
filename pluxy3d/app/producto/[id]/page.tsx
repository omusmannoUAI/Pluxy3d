import { redirect } from "next/navigation"

// Legacy route: redirect to canonical /productos/id/:id
export default function LegacyProductPage({ params }: any) {
  redirect(`/productos/id/${params.id}`)
}
