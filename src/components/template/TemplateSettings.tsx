import { useEffect } from 'react'
import type { TemplateSettingsType } from "../../types/template"
import './TemplateSettings.css'

type Props = {
  settings: TemplateSettingsType
  setSettings: React.Dispatch<React.SetStateAction<TemplateSettingsType>>
  mode: 'order' | 'invoice'
}

export const TemplateSettings = ({ settings, setSettings, mode }: Props) => {

  const handleChange = (
    key: keyof TemplateSettingsType,
    value: string
  ) => {
    setSettings({
      ...settings,
      [key]: value,
    })
  }

  const handleDocumentTypeChange = (
    type: TemplateSettingsType['documentType']
  ) => {
    setSettings({
      ...settings,
      documentType: type,
      title:
        type === 'order'
          ? '注文書'
          : type === 'orderConfirmation'
          ? '注文請書'
          : '請求書',
    })
  }

  useEffect(() => {
    if (mode === 'order') {
      if (settings.documentType === 'invoice') {
        setSettings(s => ({
          ...s,
          documentType: 'order',
          title: '注文書',
        }))
      }
    } else {
      if (settings.documentType !== 'invoice') {
        setSettings(s => ({
          ...s,
          documentType: 'invoice',
          title: '請求書',
        }))
      }
    }
  }, [mode])

  return (
    <div className="template-card compact">
  {/* 1行目：帳票種別 + タイトル + 担当 */}
  <div className="row row-3col">
    <div className="field">
      <span className="label">帳票</span>
      {mode === 'order' ? (
        <select
          value={settings.documentType}
          onChange={(e) =>
            handleDocumentTypeChange(
              e.target.value as TemplateSettingsType['documentType']
            )
          }
        >
          <option value="order">注文書</option>
          <option value="orderConfirmation">注文請書</option>
        </select>
      ) : (
        <span className="badge">請求書</span>
      )}
    </div>

    <div className="field">
      <span className="label">タイトル</span>
      <input
        value={settings.title}
        onChange={(e) => handleChange("title", e.target.value)}
        placeholder="注文書 / 請求書"
      />
    </div>

    <div className="field">
      <span className="label">担当</span>
      <input
        value={settings.inchage}
        onChange={(e) => handleChange("inchage", e.target.value)}
        placeholder="担当者名"
      />
    </div>
  </div>

  {/* 会社情報（折りたたみ） */}
  {settings.documentType !== 'orderConfirmation' && (
    <details>
      <summary>会社情報（詳細）</summary>

      <div className="row">
        <span className="label">会社名</span>
        <input
          value={settings.companyName}
          onChange={(e) => handleChange("companyName", e.target.value)}
        />
      </div>

      <div className="row">
        <span className="label">郵便番号</span>
        <input
          value={settings.postCode}
          onChange={(e) => handleChange("postCode", e.target.value)}
        />
      </div>

      <div className="row">
        <span className="label">住所</span>
        <input
          value={settings.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />
      </div>

      <div className="row">
        <span className="label">建物</span>
        <input
          value={settings.building}
          onChange={(e) => handleChange("building", e.target.value)}
        />
      </div>

      <div className="row">
        <span className="label">電話番号</span>
        <input
          value={settings.tel}
          onChange={(e) => handleChange("tel", e.target.value)}
        />
      </div>

      <div className="row">
        <span className="label">登録番号</span>
        <input
          value={settings.num}
          onChange={(e) => handleChange("num", e.target.value)}
        />
      </div>
    </details>
  )}
</div>
)
}