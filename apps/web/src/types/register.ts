export type RegisterStep = 0 | 1 | 2 | 3 | 4

export type SingleNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type Pace = string
export type WeekCount = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export type UserRegister = {
  nickname: string
  runningPace?: Pace
  runningFrequency?: WeekCount
}
