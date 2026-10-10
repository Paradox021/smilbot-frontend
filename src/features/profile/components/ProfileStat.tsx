interface ProfileStatProps {
  label: string
  value: string
}

export function ProfileStat({ label, value }: ProfileStatProps) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[13px] tracking-[0.1px] text-muted-foreground">{label}</dt>
      <dd className="font-heading text-xl font-extrabold tabular-nums">{value}</dd>
    </div>
  )
}
