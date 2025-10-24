import { Card } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  icon: string
  color: string
}

export function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <Card className={`p-6 ${color} border-0`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </Card>
  )
}
