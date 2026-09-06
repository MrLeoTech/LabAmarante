import { BRAND } from '@/branding'

type Variant = 'full' | 'mark' | 'wordmark' | 'footer'

const sizes: Record<Variant, string> = {
  full: 'h-28 w-auto max-w-[280px] object-contain bg-transparent',
  mark: 'h-9 w-9 rounded-lg object-cover object-top bg-transparent',
  wordmark: 'h-8 w-auto max-w-[140px] object-contain object-left bg-transparent',
  footer: 'h-10 w-auto max-w-[160px] object-contain opacity-90 bg-transparent',
}

export function BrandMark({
  variant = 'mark',
  className = '',
  alt,
}: {
  variant?: Variant
  className?: string
  alt?: string
}) {
  return (
    <img
      src={BRAND.logoFull}
      alt={alt ?? `${BRAND.company} · ${BRAND.product}`}
      className={`${sizes[variant]} ${className}`}
      draggable={false}
    />
  )
}

export function BrandPoweredBy({
  className = '',
  light = false,
}: {
  className?: string
  light?: boolean
}) {
  const muted = light ? 'text-white/45' : 'text-slate-500'
  const gold = light ? 'text-[#e8d48b]' : 'text-[#8a7318]'
  return (
    <div className={`flex items-center gap-2 text-[10px] ${muted} ${className}`}>
      <span className="uppercase tracking-wide">Powered by</span>
      <span className={`font-semibold ${gold}`}>{BRAND.product}</span>
      <span className={light ? 'text-white/25' : 'text-slate-300'}>·</span>
      <span>{BRAND.company}</span>
    </div>
  )
}
