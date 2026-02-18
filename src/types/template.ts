// types/template.ts
export type DocumentType = 'order' | 'orderConfirmation' | 'invoice'

export type TemplateSettingsType = {
  documentType: DocumentType
  title: string
  companyName: string
  postCode: string
  address: string
  building: string
  tel: string
  inchage: string
}
