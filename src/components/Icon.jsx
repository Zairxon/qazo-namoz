// Обёртка над @tabler/icons-react (tree-shaking — в бандл только эти иконки).
// Тот же <i class="app-icon">-контейнер, что в BuildFlow: размер иконки
// наследуется из font-size на <i>, цвет — currentColor.
import {
  IconSunrise,
  IconSun,
  IconSunLow,
  IconSunset,
  IconMoonStars,
  IconStar,
  IconStarFilled,
  IconPlus,
  IconCheck,
  IconTrash,
  IconX,
  IconCalendar,
  IconCalculator,
  IconHistory,
  IconLayoutDashboard,
  IconPalette,
  IconClock,
  IconCircleCheck,
  IconArrowBackUp,
  IconChevronRight,
  IconInfoCircle,
  IconSparkles,
  IconBuildingMosque,
  IconMoon,
  IconPray,
} from '@tabler/icons-react'

const ICONS = {
  'sunrise': IconSunrise,
  'sun': IconSun,
  'sun-low': IconSunLow,
  'sunset': IconSunset,
  'moon-stars': IconMoonStars,
  'star': IconStar,
  'star-filled': IconStarFilled,
  'plus': IconPlus,
  'check': IconCheck,
  'trash': IconTrash,
  'x': IconX,
  'calendar': IconCalendar,
  'calculator': IconCalculator,
  'history': IconHistory,
  'dashboard': IconLayoutDashboard,
  'palette': IconPalette,
  'clock': IconClock,
  'circle-check': IconCircleCheck,
  'undo': IconArrowBackUp,
  'chevron-right': IconChevronRight,
  'info': IconInfoCircle,
  'sparkles': IconSparkles,
  'mosque': IconBuildingMosque,
  'moon': IconMoon,
  'pray': IconPray,
}

export default function Icon({ name, className, stroke, ...rest }) {
  const key = String(name || '').replace(/^ti-/, '')
  const Cmp = ICONS[key]
  if (!Cmp) {
    if (import.meta.env.DEV) console.warn('[Icon] неизвестная иконка:', name)
    return null
  }
  const cls = ['app-icon', className].filter(Boolean).join(' ')
  return (
    <i className={cls} aria-hidden="true" {...rest}>
      <Cmp stroke={stroke} />
    </i>
  )
}
