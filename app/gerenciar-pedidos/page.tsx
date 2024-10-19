"use client"

import { GerenciarPedidosComponent } from "@/components/gerenciar-pedidos"
import { useRouter } from 'next/navigation'

export default function GerenciarPedidosPage() {
  const router = useRouter()

  return <GerenciarPedidosComponent onNavigate={(path) => router.push(path)} />
}
