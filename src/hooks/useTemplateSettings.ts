import { useEffect, useState } from "react"
import type { TemplateSettingsType } from "../types/template"

const defaultSettings: TemplateSettingsType = {
  title: "",
  companyName: "ネイバーズ株式会社",
  postCode: "104-0045",
  address: "東京都中央区築地二丁目12-10",
  building: "ビルネット築地ビル4階A",
  tel: "03-6281-5088",
  inchage: ""
}

export const useTemplateSettings = () => {
  const [settings, setSettings] = useState<TemplateSettingsType>(defaultSettings)

  useEffect(() => {
    const saved = localStorage.getItem("templateSettings")
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("templateSettings", JSON.stringify(settings))
  }, [settings])

  return { settings, setSettings }
}
