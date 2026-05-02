import { useState } from 'react'
import { DayPicker, DayPickerProps } from 'react-day-picker'
import { ko } from 'react-day-picker/locale'
import 'react-day-picker/style.css'

type OmitDayPickerProps = 'mode' | 'showOutsideDays' | 'locale' | 'selected' | 'onSelect'

export default function DatePicker({
  defaultValue,
  onDateClick,
  ...rest
}: {
  defaultValue?: Date
  onDateClick: (date: Date | undefined) => void
} & Omit<DayPickerProps, OmitDayPickerProps>) {
  const [date, setDate] = useState<Date | undefined>(defaultValue)

  return (
    <div>
      <DayPicker
        mode='single'
        showOutsideDays
        locale={ko}
        selected={date}
        onSelect={(date) => {
          setDate(date)
          onDateClick(date)
        }}
        {...rest}
      />
      <style>{`
        .rdp-nav {
          width: 100%;
          justify-content: space-between;
        }
        .rdp-month_caption {
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Pretendard', sans-serif;
        }
        .rdp-month_label {
          text-align: center;
        }
        .rdp-button_previous > svg,
        .rdp-button_next > svg {
          width: 18px;
          height: 18px;
          fill: #607d8a;
        }
        .rdp-button_previous {
          margin-left: 4px;
        }
        .rdp-weekday {
          font-size: 14px;
          font-weight: 700;
          font-family: 'Pretendard', sans-serif;
        }
        .rdp-day {
          color: #757575;
        }
        .rdp-outside {
          color: #9e9e9e;
        }
        .rdp-day {
          font-size: 14px;
        }
        .rdp-today > button {
          color: #212121 !important;
          background: rgb(238, 238, 238);
          border-radius: 10px;
        }
        .rdp-selected > button {
          background: #212121;
          color: white !important;
          border-radius: 10px;
          border: none !important;
        }
        .rdp-weekday[aria-label='토요일'] {
          color: #64b5f6;
        }
        .rdp-weekday[aria-label='일요일'] {
          color: #e57373;
        }
      `}</style>
    </div>
  )
}
