'use client'

import clsx from 'clsx'
import { AxiosError } from 'axios'
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
import { ADMIN_CHALLENGES_QUERY_KEY, useAdminChallengesQuery } from '@apis/v1/admin/query'
import { ApiResponse } from '@openrun/api-client'
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

let stageKeySequence = 0

export default function AdminChallengeContentPanel() {
  const queryClient = useQueryClient()
  const challengesQuery = useAdminChallengesQuery()
  const createMutation = useCreateAdminChallengeMutation()
  const updateMutation = useUpdateAdminChallengeMutation()
  const deleteMutation = useDeleteAdminChallengeMutation()
  const [selectedChallengeId, setSelectedChallengeId] = useState<SelectedChallengeId>(null)
  const challenges = useMemo(() => challengesQuery.data?.data ?? [], [challengesQuery.data])
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
    queryClient.invalidateQueries({ queryKey: ADMIN_CHALLENGES_QUERY_KEY })
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
      <section className='flex h-420 items-center justify-center rounded-8 bg-white shadow-floating-primary'>
        <LoadingLogo />
      </section>
    )
  }

  if (challengesQuery.error) {
    return (
      <section className='rounded-8 bg-white p-24 shadow-floating-primary'>
        <div className='rounded-8 border border-pink/30 bg-pink/10 p-16 text-14 font-bold text-pink'>
          도전과제 목록을 불러오지 못했습니다.
        </div>
      </section>
    )
  }

  return (
    <section className='grid gap-16 lg:grid-cols-[340px_1fr]'>
      <aside className='flex flex-col gap-12 rounded-8 bg-white p-16 shadow-floating-primary'>
        <div className='flex items-center justify-between gap-12'>
          <div>
            <h2 className='text-18 font-bold text-black'>도전과제 컨텐츠</h2>
            <p className='mt-4 text-13 text-gray-darkest'>DB에 등록된 도전과제를 관리합니다.</p>
          </div>
          <span className='font-jost text-13 font-bold text-gray-darkest'>{challenges.length}</span>
        </div>

        <button
          type='button'
          className={clsx(
            'h-44 rounded-8 border border-dashed px-12 text-14 font-bold active-press-duration active:scale-[0.98]',
            selectedChallengeId === 'new'
              ? 'border-black bg-black text-white'
              : 'border-black bg-white text-black hover:bg-gray-lighten',
          )}
          onClick={() => setSelectedChallengeId('new')}>
          새 도전과제
        </button>

        <div className='flex max-h-[620px] flex-col gap-8 overflow-y-auto pr-2'>
          {challenges.length === 0 ? (
            <div className='rounded-8 bg-gray-lighten p-16 text-13 font-bold text-gray-darkest'>
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

      <section className='rounded-8 bg-white p-16 shadow-floating-primary'>
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
  return (
    <button
      type='button'
      aria-pressed={selected}
      className={clsx(
        'flex w-full flex-col gap-8 rounded-8 border p-12 text-left active-press-duration active:scale-[0.99]',
        selected ? 'border-primary bg-primary/10' : 'border-gray bg-white hover:border-black/40 hover:bg-gray-lighten',
      )}
      onClick={onSelect}>
      <div className='flex min-w-0 items-start justify-between gap-10'>
        <p className='line-clamp-2 text-14 font-bold text-black'>{challenge.name}</p>
        <span className='font-jost text-12 font-bold text-gray-darkest'>#{challenge.challengeId}</span>
      </div>
      <p className='line-clamp-2 text-12 text-gray-darkest'>{challenge.description}</p>
      <div className='flex flex-wrap gap-4'>
        <StatusPill>{getOptionLabel(CHALLENGE_TYPE_OPTIONS, challenge.challengeType)}</StatusPill>
        <StatusPill>{getOptionLabel(REWARD_TYPE_OPTIONS, challenge.rewardType)}</StatusPill>
        <StatusPill>{`${challenge.stages.length} stage`}</StatusPill>
        <StatusPill>{`${challenge.assignedUserChallengeCount} assigned`}</StatusPill>
      </div>
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
      <div className='flex h-320 items-center justify-center text-14 font-bold text-gray-darkest'>
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
      <div className='flex flex-col gap-10 border-b border-gray pb-16 md:flex-row md:items-start md:justify-between'>
        <div>
          <h3 className='text-18 font-bold text-black'>{isNew ? '새 도전과제' : '도전과제 수정'}</h3>
          <p className='mt-4 text-13 text-gray-darkest'>
            {isNew ? '기존 유저에게는 자동 배정하지 않습니다.' : '진행 기록이 있는 stage는 삭제할 수 없습니다.'}
          </p>
        </div>
        {!isNew && selectedChallenge && (
          <div className='flex flex-wrap gap-6 md:justify-end'>
            <StatusPill>{`${selectedChallenge.assignedUserChallengeCount} assigned`}</StatusPill>
            <StatusPill>{selectedChallenge.deletable ? '삭제 가능' : '삭제 불가'}</StatusPill>
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
        <span className='text-12 font-bold text-black-darken'>설명</span>
        <textarea
          className='min-h-96 rounded-8 border border-gray px-12 py-10 text-14 outline-none focus:border-primary'
          value={draft.description}
          onChange={(event) => onChange({ ...draft, description: event.target.value })}
        />
      </label>

      <StageEditor draft={draft} onChange={onChange} />

      {(validationError || mutationError) && (
        <div className='rounded-8 border border-pink/30 bg-pink/10 p-12 text-13 font-bold text-pink'>
          {validationError ?? mutationError}
        </div>
      )}

      {!isNew && selectedChallenge && !selectedChallenge.deletable && (
        <div className='rounded-8 bg-gray-lighten p-12 text-12 font-bold text-gray-darkest'>
          이미 유저 진행 기록이 있어 도전과제를 삭제할 수 없습니다.
        </div>
      )}

      <div className='flex flex-col-reverse gap-8 border-t border-gray pt-16 md:flex-row md:justify-between'>
        {!isNew && selectedChallenge ? (
          <button
            type='button'
            className='h-44 rounded-8 border border-pink px-16 text-14 font-bold text-pink active-press-duration active:scale-95 hover:bg-pink/10 disabled:border-gray disabled:text-gray-darkest disabled:hover:bg-white'
            disabled={!selectedChallenge.deletable || isDeleting}
            onClick={onDelete}>
            {isDeleting ? '삭제 중' : '삭제'}
          </button>
        ) : (
          <span />
        )}
        <button
          type='submit'
          className='h-44 rounded-8 bg-primary px-20 text-14 font-bold text-white active-press-duration active:scale-95 disabled:bg-gray disabled:text-gray-lighten'
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
    <section className='flex flex-col gap-10 rounded-8 border border-gray p-12'>
      <div className='flex items-center justify-between gap-12'>
        <div>
          <h4 className='text-15 font-bold text-black'>Stage</h4>
          <p className='mt-2 text-12 text-gray-darkest'>단계 번호와 조건 횟수를 관리합니다.</p>
        </div>
        <button
          type='button'
          className='h-34 rounded-8 bg-black px-12 text-12 font-bold text-white active-press-duration active:scale-95'
          onClick={addStage}>
          단계 추가
        </button>
      </div>

      <div className='flex flex-col gap-8'>
        {draft.stages.map((stage) => (
          <div
            key={stage.localKey}
            className='grid gap-8 rounded-8 bg-gray-lighten p-10 md:grid-cols-[1fr_1fr_auto] md:items-end'>
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
              <span className='font-jost text-12 font-bold text-gray-darkest'>
                {stage.assignedUserChallengeCount} assigned
              </span>
              <button
                type='button'
                className='h-36 rounded-8 px-10 text-12 font-bold text-pink active-press-duration active:scale-95 hover:bg-pink/10 disabled:text-gray-darkest disabled:hover:bg-transparent'
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
      <span className='text-12 font-bold text-black-darken'>{label}</span>
      <input
        type={type}
        min={min}
        className='h-44 rounded-8 border border-gray px-12 text-14 outline-none focus:border-primary'
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
      <span className='text-12 font-bold text-black-darken'>{label}</span>
      <select
        className='h-44 rounded-8 border border-gray bg-white px-12 text-14 font-bold outline-none focus:border-primary'
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

function StatusPill({ children }: { children: string | number }) {
  return (
    <span className='rounded-full bg-gray px-7 py-3 text-11 font-bold text-gray-darkest'>
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

function getOptionLabel<OptionValue extends string>(
  options: { value: OptionValue; label: string }[],
  value: OptionValue,
) {
  return options.find((option) => option.value === value)?.label ?? value
}

function getErrorMessage(error: Error | null): string | null {
  if (!error) return null

  const axiosError = error as AxiosError<ApiResponse<unknown>>
  return axiosError.response?.data.message ?? error.message
}
