interface ProfileStatProps {
  label: string
  value: string
}

export function ProfileStat({ label, value }: ProfileStatProps) {
  return (
    <div className="rounded-lg border bg-muted/40 p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-lg font-semibold tabular-nums">{value}</dd>
    </div>
  )
}
