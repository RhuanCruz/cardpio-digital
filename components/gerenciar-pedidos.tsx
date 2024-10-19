import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type GerenciarPedidosComponentProps = {
  onNavigate: (path: string) => void
}

type CartItem = {
  item: {
    id: number
    name: string
    price: string
  }
  quantity: number
  preference: string
}

type Order = {
  id: string
  items: CartItem[]
  total: number
  status: 'pendente' | 'preparando' | 'pronto'
  tableNumber: string
  createdAt: number
}

export function GerenciarPedidosComponent({ onNavigate }: GerenciarPedidosComponentProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [currentTime, setCurrentTime] = useState(Date.now())

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders')
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }

    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const updateOrderStatus = (orderId: string, newStatus: 'pendente' | 'preparando' | 'pronto') => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
  }

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
  }

  const renderOrder = (order: Order) => {
    const elapsedTime = currentTime - order.createdAt
    const isReady = order.status === 'pronto'
    const timeColor = isReady ? 'text-green-500' : 'text-gray-700'

    return (
      <div key={order.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Pedido #{order.id} - Mesa {order.tableNumber}</h2>
        <p className="mb-2">Status: {order.status}</p>
        <p className={`mb-2 ${timeColor}`}>
          Tempo de espera: {isReady ? 'Finalizado' : formatTime(elapsedTime)}
        </p>
        <ul className="mb-4">
          {order.items.map((item, index) => (
            <li key={index} className="mb-2">
              <div>{item.item.name} x {item.quantity} - R$ {(parseFloat(item.item.price.replace('R$ ', '').replace(',', '.')) * item.quantity).toFixed(2)}</div>
              {item.preference && (
                <div className="text-sm text-gray-600 ml-4">Preferência: {item.preference}</div>
              )}
            </li>
          ))}
        </ul>
        <p className="font-bold mb-4">Total: R$ {order.total.toFixed(2)}</p>
        <div className="flex space-x-2">
          <Button onClick={() => updateOrderStatus(order.id, 'pendente')} variant={order.status === 'pendente' ? 'default' : 'outline'}>Pendente</Button>
          <Button onClick={() => updateOrderStatus(order.id, 'preparando')} variant={order.status === 'preparando' ? 'default' : 'outline'}>Preparando</Button>
          <Button onClick={() => updateOrderStatus(order.id, 'pronto')} variant={order.status === 'pronto' ? 'default' : 'outline'}>Pronto</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Pedidos</h1>
      <Button onClick={() => onNavigate('/')} className="mb-6">Voltar ao Cardápio</Button>
      
      <Tabs defaultValue="pendente" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pendente">Pendentes</TabsTrigger>
          <TabsTrigger value="preparando">Preparando</TabsTrigger>
          <TabsTrigger value="pronto">Prontos</TabsTrigger>
        </TabsList>
        <TabsContent value="pendente">
          {orders.filter(order => order.status === 'pendente').map(renderOrder)}
        </TabsContent>
        <TabsContent value="preparando">
          {orders.filter(order => order.status === 'preparando').map(renderOrder)}
        </TabsContent>
        <TabsContent value="pronto">
          {orders.filter(order => order.status === 'pronto').map(renderOrder)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
