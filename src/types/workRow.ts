export type WorkRow = {
  要員名: string
  案件名: string
  顧客名: string
  作業期間: string
  数量: number
  単位: string
  単価: number
  清算幅?: string
  清算単価?: number
  清算単位?: string
  勤務条件?: string
  勤務時間?: string
  支払いサイト?: string
  支払い?: string
  日付: string
  No: string
  顧客先代表取締役名: string
  その他?: string

  //追加
  請求先名: string
  請求日: string
  支払日: string
  納期: string
  振込先: string
  価格: number
  基準時間: number
  実働時間: number
  超過時間: number
  控除時間: number
  諸経費: number
  立替金: number
  特記事項: string

}
