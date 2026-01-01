import { redirect } from 'next/navigation'
import { use } from 'react'

export default function CountryPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  redirect(`/user/${slug}/overview`)
}