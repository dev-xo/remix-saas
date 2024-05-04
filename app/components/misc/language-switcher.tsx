import { useNavigate } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '#app/components/ui/select'

export function LanguageSwitcher() {
  const navigate = useNavigate()
  const pathname = location.pathname.replace(/\/$/, '')

  const { i18n } = useTranslation()
  const language = i18n.resolvedLanguage

  const langs = [
    { text: 'English', value: 'en' },
    { text: 'Spanish', value: 'es' },
  ]
  const formatLanguage = (lng: string) => {
    return langs.find((lang) => lang.value === lng)?.text
  }

  return (
    <Select onValueChange={(value) => navigate(`${pathname}?lng=${value}`)}>
      <SelectTrigger className="h-6 rounded border-primary/20 bg-secondary !px-2 hover:border-primary/40">
        <div className="flex items-start gap-2">
          <Languages className="h-[14px] w-[14px]" />
          <span className="text-xs font-medium">{formatLanguage(language || 'en')}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {langs.map(({ text, value }) => (
          <SelectItem
            key={value}
            value={value}
            className={`text-sm font-medium text-primary/60`}>
            {text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
