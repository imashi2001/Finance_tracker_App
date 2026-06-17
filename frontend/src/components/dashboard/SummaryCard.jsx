import Card from '../common/Card'

export default function SummaryCard({ icon: Icon, label, tone = 'emerald', value }) {
  const toneClasses = {
    blue: 'bg-blue-50 text-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    rose: 'bg-rose-50 text-rose-700',
    slate: 'bg-slate-100 text-slate-700',
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-2xl ${toneClasses[tone]}`}>
          <Icon className="text-xl" />
        </div>
      </div>
    </Card>
  )
}
