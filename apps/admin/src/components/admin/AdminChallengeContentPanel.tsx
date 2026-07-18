'use client'

import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  AdminChallenge,
  AdminChallengeRequest,
  AdminChallengeStage,
  AdminChallengeType,
  AdminCompletedType,
  AdminRewardType,
} from '@apis/v1/admin'
import {
  useCreateAdminChallengeMutation,
  useDeleteAdminChallengeMutation,
  useUpdateAdminChallengeMutation,
} from '@apis/v1/admin/mutation'
import { adminQueries, useAdminChallengesQuery } from '@apis/v1/admin/query'
import { getApiErrorMessage } from '@openrun/api-client/error'
import { LoadingLogo } from '@openrun/ui'

type SelectedChallengeId = number | 'new' | null

type ChallengeDraft = {
  name: string
  description: string
  challengeType: AdminChallengeType
  rewardType: AdminRewardType
  completedType: AdminCompletedType
  conditionDate: string
  conditionText: string
  stages: ChallengeStageDraft[]
}

type ChallengeStageDraft = {
  localKey: string
  stageId?: number
  stageNumber: string
  conditionCount: string
  assignedUserChallengeCount: number
  removable: boolean
}

const CHALLENGE_TYPE_OPTIONS: { value: AdminChallengeType; label: string }[] = [
  { value: 'tuto', label: '튜토리얼' },
  { value: 'normal', label: '일반' },
  { value: 'hidden', label: '숨김' },
  { value: 'repetitive', label: '반복' },
]

const REWARD_TYPE_OPTIONS: { value: AdminRewardType; label: string }[] = [
  { value: 'face', label: '얼굴' },
  { value: 'hair', label: '헤어' },
  { value: 'accessory', label: '액세서리' },
  { value: 'top', label: '상의' },
  { value: 'bottom', label: '하의' },
  { value: 'footwear', label: '신발' },
  { value: 'pairs', label: '세트' },
  { value: 'skin', label: '피부' },
]

const COMPLETED_TYPE_OPTIONS: { value: AdminCompletedType; label: string }[] = [
  { value: 'date', label: '날짜' },
  { value: 'place', label: '장소' },
  { value: 'wearing', label: '착용' },
  { value: 'pace', label: '페이스' },
  { value: 'count', label: '횟수' },
]

const FIELD_LABEL_CLASS = 'text-12 font-medium text-[#6e6e73]'
const FIELD_INPUT_CLASS =
  'h-40 rounded-10 border border-black/[0.08] bg-white/80 px-12 text-14 text-[#1d1d1f] outline-none transition focus:border-[#4A5CEF] focus:ring-4 focus:ring-[#4A5CEF]/15'

let stageKeySequence = 0

export default function AdminChallengeContentPanel() {
  const queryClient = useQueryClient()
  const challengesQuery = useAdminChallengesQuery()
  const createMutation = useCreateAdminChallengeMutation()
  const updateMutation = useUpdateAdminChallengeMutation()
  const deleteMutation = useDeleteAdminChallengeMutation()
  const [selectedChallengeId, setSelectedChallengeId] = useState<SelectedChallengeId>(null)
  const challenges = useMemo(() => {
    const list = challengesQuery.data?.data ?? []
    // 일반(비반복) 도전과제를 먼저, 반복 도전과제를 뒤에 배치
    return [...list].sort(
      (a, b) => Number(a.challengeType === 'repetitive') - Number(b.challengeType === 'repetitive'),
    )
  }, [challengesQuery.data])
  const selectedChallenge = useMemo(
    () =>
      typeof selectedChallengeId === 'number'
        ? challenges.find((challenge) => challenge.challengeId === selectedChallengeId) ?? null
        : null,
    [challenges, selectedChallengeId],
  )
  const [draft, setDraft] = useState<ChallengeDraft>(() => createEmptyDraft())
  const validationError = getValidationError(draft)
  const mutationError = getErrorMessage(createMutation.error ?? updateMutation.error ?? deleteMutation.error)
  const isSaving = createMutation.isPending || updateMutation.isPending
  const isDeleting = deleteMutation.isPending

  useEffect(() => {
    if (selectedChallengeId !== null || challenges.length === 0) return
    setSelectedChallengeId(challenges[0].challengeId)
  }, [challenges, selectedChallengeId])

  useEffect(() => {
    if (typeof selectedChallengeId !== 'number') return
    if (challenges.length === 0) {
      setSelectedChallengeId(null)
      return
    }
    if (!challenges.some((challenge) => challenge.challengeId === selectedChallengeId)) {
      setSelectedChallengeId(challenges[0].challengeId)
    }
  }, [challenges, selectedChallengeId])

  useEffect(() => {
    if (selectedChallengeId === 'new') {
      setDraft(createEmptyDraft())
      return
    }
    if (selectedChallenge) {
      setDraft(toDraft(selectedChallenge))
    }
  }, [selectedChallenge, selectedChallengeId])

  const refreshChallenges = () => {
    queryClient.invalidateQueries({ queryKey: adminQueries.challenges().queryKey })
  }

  const handleSubmit = () => {
    if (validationError || isSaving) return

    const request = toRequest(draft)
    if (selectedChallengeId === 'new') {
      createMutation.mutate(request, {
        onSuccess: ({ data }) => {
          setSelectedChallengeId(data.challengeId)
          refreshChallenges()
        },
      })
      return
    }

    if (typeof selectedChallengeId === 'number') {
      updateMutation.mutate(
        { challengeId: selectedChallengeId, request },
        {
          onSuccess: ({ data }) => {
            setSelectedChallengeId(data.challengeId)
            refreshChallenges()
          },
        },
      )
    }
  }

  const handleDelete = () => {
    if (!selectedChallenge || !selectedChallenge.deletable || isDeleting) return
    if (!window.confirm(`${selectedChallenge.name} 도전과제를 삭제할까요?`)) return

    deleteMutation.mutate(selectedChallenge.challengeId, {
      onSuccess: () => {
        setSelectedChallengeId(null)
        refreshChallenges()
      },
    })
  }

  if (challengesQuery.isLoading) {
    return (
      <section className='glass-panel flex h-420 items-center justify-center rounded-16'>
        <LoadingLogo />
      </section>
    )
  }

  if (challengesQuery.error) {
    return (
      <section className='glass-panel rounded-16 p-24'>
        <div className='rounded-12 border border-pink/25 bg-pink/[0.08] p-16 text-14 font-medium text-pink'>
          도전과제 목록을 불러오지 못했습니다.
        </div>
      </section>
    )
  }

  return (
    <section className='grid gap-16 lg:grid-cols-[340px_1fr]'>
      <aside className='glass-panel flex flex-col gap-12 rounded-16 p-16'>
        <div className='flex items-center justify-between gap-12'>
          <h2 className='text-16 font-semibold tracking-[-0.01em] text-[#1d1d1f]'>도전과제</h2>
          <span className='font-jost text-12 font-medium text-[#86868b]'>{challenges.length}</span>
        </div>

        <button
          type='button'
          className={clsx(
            'h-40 rounded-10 text-12 font-semibold transition-colors active-press-duration active:scale-[0.99]',
            selectedChallengeId === 'new'
              ? 'bg-[#4A5CEF] text-white'
              : 'border border-black/[0.06] bg-white/70 text-[#4A5CEF] hover:bg-white',
          )}
          onClick={() => setSelectedChallengeId('new')}>
          새 도전과제
        </button>

        <div className='scrollbar-web-hidden flex max-h-[620px] flex-col gap-8 overflow-y-auto'>
          {challenges.length === 0 ? (
            <div className='rounded-10 bg-black/[0.03] p-16 text-12 font-medium text-[#86868b]'>
              등록된 도전과제가 없습니다.
            </div>
          ) : (
            challenges.map((challenge) => (
              <ChallengeListItem
                key={challenge.challengeId}
                challenge={challenge}
                selected={challenge.challengeId === selectedChallengeId}
                onSelect={() => setSelectedChallengeId(challenge.challengeId)}
              />
            ))
          )}
        </div>
      </aside>

      <section className='glass-panel rounded-16 p-16'>
        <ChallengeForm
          draft={draft}
          selectedChallenge={selectedChallenge}
          isNew={selectedChallengeId === 'new'}
          isSaving={isSaving}
          isDeleting={isDeleting}
          validationError={validationError}
          mutationError={mutationError}
          onChange={setDraft}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      </section>
    </section>
  )
}

function ChallengeListItem({
  challenge,
  selected,
  onSelect,
}: {
  challenge: AdminChallenge
  selected: boolean
  onSelect: () => void
}) {
  const isRepetitive = challenge.challengeType === 'repetitive'

  return (
    <button
      type='button'
      aria-pressed={selected}
      className={clsx(
        'flex w-full flex-col gap-6 rounded-10 p-12 text-left transition-colors duration-150 active-press-duration active:scale-[0.99]',
        selected ? 'bg-[#4A5CEF]' : 'hover:bg-black/[0.04]',
      )}
      onClick={onSelect}>
      <div className='flex min-w-0 items-center justify-between gap-10'>
        <p className={clsx('truncate text-14 font-semibold', selected ? 'text-white' : 'text-[#1d1d1f]')}>
          {challenge.name}
        </p>
        <StatusPill tone={selected ? 'inverted' : isRepetitive ? 'accent' : 'neutral'}>
          {isRepetitive ? '반복' : '일반'}
        </StatusPill>
      </div>
      <p className={clsx('line-clamp-2 text-12 leading-relaxed', selected ? 'text-white/75' : 'text-[#86868b]')}>
        {challenge.description}
      </p>
    </button>
  )
}

function ChallengeForm({
  draft,
  selectedChallenge,
  isNew,
  isSaving,
  isDeleting,
  validationError,
  mutationError,
  onChange,
  onSubmit,
  onDelete,
}: {
  draft: ChallengeDraft
  selectedChallenge: AdminChallenge | null
  isNew: boolean
  isSaving: boolean
  isDeleting: boolean
  validationError: string | null
  mutationError: string | null
  onChange: (draft: ChallengeDraft) => void
  onSubmit: () => void
  onDelete: () => void
}) {
  const selectedChallengeMissing = !isNew && !selectedChallenge

  if (selectedChallengeMissing) {
    return (
      <div className='flex h-320 items-center justify-center text-14 font-medium text-[#86868b]'>
        도전과제를 선택하거나 새 도전과제를 만들어주세요.
      </div>
    )
  }

  return (
    <form
      className='flex flex-col gap-16'
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}>
      <div className='flex flex-col gap-10 border-b border-black/[0.06] pb-16 md:flex-row md:items-start md:justify-between'>
        <div>
          <h3 className='text-16 font-semibold tracking-[-0.01em] text-[#1d1d1f]'>
            {isNew ? '새 도전과제' : '도전과제 수정'}
          </h3>
          <p className='mt-2 text-12 text-[#86868b]'>
            {isNew ? '기존 유저에게는 자동 배정하지 않습니다.' : '진행 기록이 있는 stage는 삭제할 수 없습니다.'}
          </p>
        </div>
        {!isNew && selectedChallenge && (
          <div className='flex flex-wrap gap-6 md:justify-end'>
            <StatusPill>{`배정 ${selectedChallenge.assignedUserChallengeCount}`}</StatusPill>
          </div>
        )}
      </div>

      <div className='grid gap-12 md:grid-cols-2'>
        <AdminTextField
          label='이름'
          value={draft.name}
          onChange={(value) => onChange({ ...draft, name: value })}
        />
        <SelectField
          label='도전과제 타입'
          value={draft.challengeType}
          options={CHALLENGE_TYPE_OPTIONS}
          onChange={(value) => onChange({ ...draft, challengeType: value })}
        />
        <SelectField
          label='보상 타입'
          value={draft.rewardType}
          options={REWARD_TYPE_OPTIONS}
          onChange={(value) => onChange({ ...draft, rewardType: value })}
        />
        <SelectField
          label='완료 조건'
          value={draft.completedType}
          options={COMPLETED_TYPE_OPTIONS}
          onChange={(value) => onChange({ ...draft, completedType: value })}
        />
        <AdminTextField
          label='조건 날짜'
          type='datetime-local'
          value={draft.conditionDate}
          onChange={(value) => onChange({ ...draft, conditionDate: value })}
        />
        <AdminTextField
          label='조건 텍스트'
          value={draft.conditionText}
          placeholder='장소, 착용 조건, 페이스 등'
          onChange={(value) => onChange({ ...draft, conditionText: value })}
        />
      </div>

      <label className='flex flex-col gap-6'>
        <span className={FIELD_LABEL_CLASS}>설명</span>
        <textarea
          className='min-h-96 rounded-10 border border-black/[0.08] bg-white/80 px-12 py-10 text-14 leading-relaxed text-[#1d1d1f] outline-none transition focus:border-[#4A5CEF] focus:ring-4 focus:ring-[#4A5CEF]/15'
          value={draft.description}
          onChange={(event) => onChange({ ...draft, description: event.target.value })}
        />
      </label>

      <StageEditor draft={draft} onChange={onChange} />

      {(validationError || mutationError) && (
        <div className='rounded-12 border border-pink/25 bg-pink/[0.08] p-12 text-12 font-medium text-pink'>
          {validationError ?? mutationError}
        </div>
      )}

      {!isNew && selectedChallenge && !selectedChallenge.deletable && (
        <div className='rounded-12 bg-black/[0.04] p-12 text-12 font-medium text-[#86868b]'>
          이미 유저 진행 기록이 있어 도전과제를 삭제할 수 없습니다.
        </div>
      )}

      <div className='flex flex-col-reverse gap-8 border-t border-black/[0.06] pt-16 md:flex-row md:justify-between'>
        {!isNew && selectedChallenge ? (
          <button
            type='button'
            className='h-40 rounded-full px-16 text-14 font-medium text-pink transition-colors active-press-duration active:scale-95 hover:bg-pink/[0.08] disabled:text-[#c7c7cc] disabled:hover:bg-transparent'
            disabled={!selectedChallenge.deletable || isDeleting}
            onClick={onDelete}>
            {isDeleting ? '삭제 중' : '삭제'}
          </button>
        ) : (
          <span />
        )}
        <button
          type='submit'
          className='cta-gradient h-40 rounded-full px-24 text-14 font-semibold text-white active-press-duration active:scale-[0.98] disabled:bg-[#d2d2d7] disabled:shadow-none'
          disabled={validationError != null || isSaving}>
          {isSaving ? '저장 중' : isNew ? '생성' : '저장'}
        </button>
      </div>
    </form>
  )
}

function StageEditor({
  draft,
  onChange,
}: {
  draft: ChallengeDraft
  onChange: (draft: ChallengeDraft) => void
}) {
  const addStage = () => {
    const nextStageNumber = getNextStageNumber(draft.stages)
    onChange({
      ...draft,
      stages: [
        ...draft.stages,
        {
          localKey: getStageKey(),
          stageNumber: String(nextStageNumber),
          conditionCount: '1',
          assignedUserChallengeCount: 0,
          removable: true,
        },
      ],
    })
  }

  const updateStage = (localKey: string, updates: Partial<ChallengeStageDraft>) => {
    onChange({
      ...draft,
      stages: draft.stages.map((stage) => (stage.localKey === localKey ? { ...stage, ...updates } : stage)),
    })
  }

  const removeStage = (localKey: string) => {
    onChange({
      ...draft,
      stages: draft.stages.filter((stage) => stage.localKey !== localKey),
    })
  }

  return (
    <section className='flex flex-col gap-10 rounded-16 border border-black/[0.06] bg-white/50 p-12'>
      <div className='flex items-center justify-between gap-12'>
        <div>
          <h4 className='text-14 font-semibold text-[#1d1d1f]'>Stage</h4>
          <p className='mt-2 text-12 text-[#86868b]'>단계 번호와 조건 횟수를 관리합니다.</p>
        </div>
        <button
          type='button'
          className='h-30 rounded-full px-12 text-12 font-semibold text-[#4A5CEF] transition-colors active-press-duration active:scale-95 hover:bg-[#4A5CEF]/[0.08]'
          onClick={addStage}>
          단계 추가
        </button>
      </div>

      <div className='flex flex-col gap-8'>
        {draft.stages.map((stage) => (
          <div
            key={stage.localKey}
            className='grid gap-8 rounded-12 border border-black/[0.05] bg-white/80 p-10 md:grid-cols-[1fr_1fr_auto] md:items-end'>
            <AdminTextField
              label='단계 번호'
              type='number'
              min={1}
              value={stage.stageNumber}
              onChange={(value) => updateStage(stage.localKey, { stageNumber: value })}
            />
            <AdminTextField
              label='조건 횟수'
              type='number'
              min={1}
              value={stage.conditionCount}
              onChange={(value) => updateStage(stage.localKey, { conditionCount: value })}
            />
            <div className='flex items-center gap-8 md:pb-1'>
              <span className='font-jost text-10 font-medium text-[#86868b]'>
                배정 {stage.assignedUserChallengeCount}
              </span>
              <button
                type='button'
                className='h-32 rounded-full px-10 text-12 font-medium text-pink transition-colors active-press-duration active:scale-95 hover:bg-pink/[0.08] disabled:text-[#c7c7cc] disabled:hover:bg-transparent'
                disabled={!stage.removable}
                onClick={() => removeStage(stage.localKey)}>
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function AdminTextField({
  label,
  value,
  type = 'text',
  min,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  type?: string
  min?: number
  placeholder?: string
  onChange: (value: string) => void
}) {
  return (
    <label className='flex flex-col gap-6'>
      <span className={FIELD_LABEL_CLASS}>{label}</span>
      <input
        type={type}
        min={min}
        className={FIELD_INPUT_CLASS}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function SelectField<OptionValue extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: OptionValue
  options: { value: OptionValue; label: string }[]
  onChange: (value: OptionValue) => void
}) {
  return (
    <label className='flex flex-col gap-6'>
      <span className={FIELD_LABEL_CLASS}>{label}</span>
      <select
        className={clsx(FIELD_INPUT_CLASS, 'font-medium')}
        value={value}
        onChange={(event) => onChange(event.target.value as OptionValue)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

type StatusPillTone = 'neutral' | 'accent' | 'inverted'

const STATUS_PILL_TONE_CLASS: Record<StatusPillTone, string> = {
  neutral: 'bg-black/[0.05] text-[#6e6e73]',
  accent: 'bg-[#4A5CEF]/10 text-[#4A5CEF]',
  inverted: 'bg-white/25 text-white',
}

function StatusPill({ children, tone = 'neutral' }: { children: string | number; tone?: StatusPillTone }) {
  return (
    <span className={clsx('flex-shrink-0 rounded-full px-8 py-2 text-10 font-medium', STATUS_PILL_TONE_CLASS[tone])}>
      {children}
    </span>
  )
}

function createEmptyDraft(): ChallengeDraft {
  return {
    name: '',
    description: '',
    challengeType: 'normal',
    rewardType: 'face',
    completedType: 'count',
    conditionDate: '',
    conditionText: '',
    stages: [
      {
        localKey: getStageKey(),
        stageNumber: '1',
        conditionCount: '1',
        assignedUserChallengeCount: 0,
        removable: true,
      },
    ],
  }
}

function toDraft(challenge: AdminChallenge): ChallengeDraft {
  return {
    name: challenge.name,
    description: challenge.description,
    challengeType: challenge.challengeType,
    rewardType: challenge.rewardType,
    completedType: challenge.completedType,
    conditionDate: toDateTimeInputValue(challenge.conditionDate),
    conditionText: challenge.conditionText ?? '',
    stages: challenge.stages.map(toStageDraft),
  }
}

function toStageDraft(stage: AdminChallengeStage): ChallengeStageDraft {
  return {
    localKey: getStageKey(),
    stageId: stage.stageId,
    stageNumber: String(stage.stageNumber),
    conditionCount: String(stage.conditionCount),
    assignedUserChallengeCount: stage.assignedUserChallengeCount,
    removable: stage.removable,
  }
}

function toRequest(draft: ChallengeDraft): AdminChallengeRequest {
  return {
    name: draft.name.trim(),
    description: draft.description.trim(),
    challengeType: draft.challengeType,
    rewardType: draft.rewardType,
    completedType: draft.completedType,
    conditionDate: toApiDateTimeValue(draft.conditionDate),
    conditionText: draft.conditionText.trim() === '' ? null : draft.conditionText.trim(),
    stages: draft.stages
      .map((stage) => ({
        stageId: stage.stageId,
        stageNumber: Number(stage.stageNumber),
        conditionCount: Number(stage.conditionCount),
      }))
      .sort((a, b) => a.stageNumber - b.stageNumber),
  }
}

function getValidationError(draft: ChallengeDraft): string | null {
  if (draft.name.trim() === '') return '이름을 입력해주세요.'
  if (draft.description.trim() === '') return '설명을 입력해주세요.'
  if (draft.stages.length === 0) return 'stage를 하나 이상 추가해주세요.'

  const stageNumbers = new Set<number>()
  for (const stage of draft.stages) {
    const stageNumber = Number(stage.stageNumber)
    const conditionCount = Number(stage.conditionCount)
    if (!Number.isInteger(stageNumber) || stageNumber <= 0) return '단계 번호는 양수여야 합니다.'
    if (!Number.isInteger(conditionCount) || conditionCount <= 0) return '조건 횟수는 양수여야 합니다.'
    if (stageNumbers.has(stageNumber)) return '단계 번호는 중복될 수 없습니다.'
    stageNumbers.add(stageNumber)
  }

  return null
}

function getNextStageNumber(stages: ChallengeStageDraft[]) {
  return stages.reduce((max, stage) => Math.max(max, Number(stage.stageNumber) || 0), 0) + 1
}

function getStageKey() {
  stageKeySequence += 1
  return `admin-stage-${stageKeySequence}`
}

function toDateTimeInputValue(value: string | null) {
  if (!value) return ''
  return value.slice(0, 16)
}

function toApiDateTimeValue(value: string) {
  if (!value) return null
  return value.length === 16 ? `${value}:00` : value
}

function getErrorMessage(error: Error | null): string | null {
  if (!error) return null

  return getApiErrorMessage(error) ?? error.message
}
