// src\hooks\useTemplateSettings.ts
import { useState } from 'react'
import type { TemplateSettingsType } from '../types/template'

export function useTemplateSettings() {
  const [settings, setSettings] = useState<TemplateSettingsType>({
    documentType: 'order',
    title: '注文書',
    companyName: 'ネイバーズ株式会社',
    postCode: '104-0045',
    address: '東京都中央区築地2丁目12-20',
    building: 'ビルネット築地ビル4階A',
    tel: '03-6281-5088',
    inchage: '',
  })

  return { settings, setSettings }
}
