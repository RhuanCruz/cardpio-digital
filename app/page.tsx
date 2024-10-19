"use client"

import { CardapioDigitalComponent } from "@/components/cardapio-digital"
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return <CardapioDigitalComponent onNavigate={(path) => router.push(path)} />
}
