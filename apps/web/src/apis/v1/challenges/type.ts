export type ChallengeInfo = {
  challengeId: number
  userChallengeId: number
  challengeName: string
  completedDate: string | null
  challengeDescription: string
  currentCount: number
  conditionCount: number
  conditionDate: string | null
  conditionText: string | null
  challengeType: string
  completedType: string
  stageCount: number
  progressStat: number
  accomplished: boolean
  nftCompleted: boolean
}

export type RepetitiveChallengeDetail = {
  challengeId: number
  challengeName: string
  challengeDescription: string
  challengeTrees: Array<{
    userChallengeId: number | null
    completedDate: string | null
    nftCompleted: boolean
    currentCount: number
    currentProgress: number
    stageId: number
    stageNumber: number
    conditionAsCount: number
  }>
}
