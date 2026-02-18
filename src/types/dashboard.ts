export interface WidgetData {
  id: number
  key: string
  imgSrc: string
  label: string
  styleClass: string
  count?: number
}

export interface WidgetGridResponse {
  data: WidgetData
}
