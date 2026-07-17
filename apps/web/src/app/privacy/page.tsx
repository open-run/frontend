import type { Metadata } from 'next'
import {
  DetailList,
  InfoPanel,
  LegalDocumentPage,
  LegalSection,
  MailButton,
  MailLink,
  SimpleList,
  SUPPORT_EMAIL,
} from '@components/legal/LegalDocumentPage'

const collectedData = [
  {
    title: '계정 및 로그인 정보',
    body: '소셜 로그인 과정에서 처리되는 이메일 주소, 사용자 ID, 닉네임, 지갑 주소, 로그인 제공자 정보가 포함될 수 있습니다.',
  },
  {
    title: '위치 정보',
    body: '사용자가 위치 권한을 허용한 경우 현재 위치, 벙 생성 또는 탐색에 필요한 위도와 경도, 장소 검색 결과를 처리할 수 있습니다.',
  },
  {
    title: '러닝 및 피트니스 정보',
    body: '러닝 페이스, 러닝 빈도, 거리, 챌린지 진행도, 챌린지 완료 여부처럼 운동 경험을 제공하기 위한 정보가 포함됩니다. 의료 또는 치료 목적의 건강 정보는 수집하지 않습니다.',
  },
  {
    title: '사용자 콘텐츠',
    body: '프로필 이미지, 아바타 이미지, 벙 이름, 벙 설명, 해시태그, 모임 이미지, 애프터런 설명처럼 사용자가 직접 입력하거나 업로드한 콘텐츠가 포함될 수 있습니다.',
  },
  {
    title: '지갑 및 디지털 리워드 정보',
    body: '디지털 리워드 지급과 소유 확인을 위해 지갑 주소, NFT 이름, token ID, transaction hash, 리워드 상태 등 블록체인 관련 정보를 처리할 수 있습니다.',
  },
  {
    title: '서비스 이용 데이터',
    body: '화면 조회, 로그인 시작/성공/실패, 벙 생성/참여/완료, 리워드 수령, 아바타 저장 등 제품 상호 작용 이벤트를 서비스 분석과 개선 목적으로 처리할 수 있습니다.',
  },
]

const thirdParties = [
  {
    title: 'Reown / WalletConnect',
    body: '지갑 연결, 소셜 로그인, 스마트 월렛 연결 기능 제공을 위해 사용됩니다. OpenRun은 개인키나 복구 구문을 요청하거나 저장하지 않습니다.',
  },
  {
    title: 'Google, Apple, GitHub, Discord 등 로그인 제공자',
    body: '사용자가 선택한 소셜 로그인 또는 인증 흐름을 처리하기 위해 사용될 수 있습니다.',
  },
  {
    title: 'Vercel 및 클라우드 인프라',
    body: '웹 서비스 호스팅, API 제공, 이미지 및 데이터 저장, 로그 처리 등 서비스 운영에 필요한 인프라로 사용됩니다.',
  },
]

export default function PrivacyPage() {
  return (
    <LegalDocumentPage
      activePath='/privacy'
      label='DATA ROUTE'
      title='개인정보 처리방침'
      description='OpenRun은 러닝 모임, 위치 기반 탐색, 챌린지 진행, 지갑 연결, 디지털 리워드 제공에 필요한 개인정보를 처리합니다.'
      quickFacts={[
        { label: 'COLLECT', value: '계정 · 위치 · 러닝 · 콘텐츠 · 리워드' },
        { label: 'TRACKING', value: '광고 추적 목적 사용 안 함' },
        { label: 'CONTACT', value: SUPPORT_EMAIL },
      ]}
      aside={
        <>
          <InfoPanel title='REQUEST' tone='dark'>
            개인정보 열람, 정정, 삭제, 계정 탈퇴 요청은 이메일로 접수합니다.
            <MailButton>개인정보 요청하기</MailButton>
          </InfoPanel>
          <InfoPanel title='LOCATION'>
            위치 권한은 iOS 설정에서 언제든지 변경할 수 있습니다.
          </InfoPanel>
          <InfoPanel title='NO ADS'>
            수집한 개인정보를 타사 광고 추적이나 데이터 판매 목적으로 사용하지 않습니다.
          </InfoPanel>
        </>
      }>
      <LegalSection checkpoint='CP-01' title='요약'>
        <SimpleList
          items={[
            'OpenRun은 러닝 벙, 챌린지, 위치 기반 탐색, 지갑 연결, 디지털 리워드 기능에 필요한 정보만 처리합니다.',
            '현재 위치는 권한을 허용한 경우에만 사용합니다.',
            '광고 추적, 데이터 판매, 금융 수익 제공 목적으로 개인정보를 사용하지 않습니다.',
            '계정 삭제는 앱의 프로필 > 설정 > 계정 탈퇴에서 진행할 수 있고, 개인정보 요청은 이메일로 접수합니다.',
          ]}
        />
      </LegalSection>

      <LegalSection checkpoint='CP-02' title='처리하는 개인정보 항목'>
        <p>
          사용자가 권한을 허용하지 않거나 해당 기능을 사용하지 않으면 일부 정보는 수집되지 않을 수 있습니다.
        </p>
        <DetailList items={collectedData} />
      </LegalSection>

      <LegalSection checkpoint='CP-03' title='개인정보 이용 목적'>
        <SimpleList
          items={[
            '회원 식별, 로그인, 계정 관리',
            '러닝 벙 생성, 참여, 완료 처리',
            '주변 정보 제공, 장소 검색, 위치 기반 기능 제공',
            '챌린지 진행도 관리와 디지털 리워드 지급',
            '프로필, 아바타, 사용자 콘텐츠 표시',
            '서비스 안정성 확인, 오류 대응, 제품 사용성 분석과 개선',
            '개인정보 열람, 삭제, 계정 탈퇴 등 사용자 요청 처리',
          ]}
        />
      </LegalSection>

      <LegalSection checkpoint='CP-04' title='사용자 선택과 권한 변경'>
        <p>
          현재 위치는 주변 벙 탐색, 장소 검색, 벙 생성 위치 설정에 사용됩니다. 사용자는 iOS 설정에서 위치 권한을 언제든지 변경할 수
          있습니다.
        </p>
        <p>
          디지털 리워드와 지갑 연결 기능은 사용자가 지갑 연결을 진행할 때 사용됩니다. OpenRun은 개인키나 복구 구문을 요청하거나
          저장하지 않습니다.
        </p>
      </LegalSection>

      <LegalSection checkpoint='CP-05' title='외부 서비스 및 처리위탁'>
        <p>
          OpenRun은 서비스 운영에 필요한 범위에서 외부 서비스를 사용합니다. 일부 제공업체는 해외 인프라를 사용할 수 있으며, 각
          제공업체는 해당 서비스 제공에 필요한 범위에서 데이터를 처리합니다.
        </p>
        <DetailList items={thirdParties} />
      </LegalSection>

      <LegalSection checkpoint='CP-06' title='보관 기간 및 삭제'>
        <p>
          계정 정보는 계정 삭제 완료 시 삭제하거나 비식별 처리합니다. 보안, 오류 대응, 부정 이용 방지, 분쟁 대응에 필요한 로그는
          운영상 필요한 기간 동안 보관한 뒤 삭제합니다. 백업 데이터는 백업 주기에 따라 순차적으로 삭제됩니다.
        </p>
        <p>
          블록체인에 기록된 transaction hash, token ID 등 공개 원장 정보는 OpenRun이 임의로 삭제할 수 없는 특성이 있습니다. 앱 내
          계정 정보와 연결된 서비스 데이터는 요청에 따라 삭제 또는 연결 해제할 수 있습니다.
        </p>
      </LegalSection>

      <LegalSection checkpoint='CP-07' title='이용자의 권리'>
        <p>사용자는 본인의 개인정보에 대해 열람, 정정, 삭제, 처리 정지, 계정 탈퇴를 요청할 수 있습니다.</p>
        <p>
          계정 탈퇴는 앱의 프로필 &gt; 설정 &gt; 계정 탈퇴에서 진행할 수 있습니다. 별도 개인정보 요청은 <MailLink /> 로 접수할 수
          있으며, OpenRun은 본인 확인 후 관련 법령에 따라 처리합니다.
        </p>
      </LegalSection>

      <LegalSection checkpoint='CP-08' title='만 14세 미만 아동'>
        <p>
          OpenRun은 만 14세 미만 아동을 주된 대상으로 하지 않습니다. 만 14세 미만 사용자는 보호자의 동의 없이 서비스를 이용할 수
          없습니다. 관련 요청이 접수되면 필요한 확인 절차 후 조치합니다.
        </p>
      </LegalSection>

      <LegalSection checkpoint='CP-09' title='안전성 확보 조치'>
        <SimpleList
          items={[
            '서비스 접근 권한 제한과 인증 토큰 관리',
            '전송 구간 암호화',
            '개인정보 접근 범위 최소화',
            '불필요한 개인정보 수집 제한',
            '서비스 운영 로그와 분석 데이터의 목적 제한',
          ]}
        />
      </LegalSection>

      <LegalSection checkpoint='CP-10' title='변경 고지'>
        <p>
          개인정보 처리방침이 변경되는 경우 이 페이지를 통해 변경 내용을 안내합니다. 중요한 변경이 있는 경우 앱 또는 서비스 내
          적절한 방법으로 추가 안내할 수 있습니다.
        </p>
      </LegalSection>
    </LegalDocumentPage>
  )
}

export const metadata: Metadata = {
  title: '개인정보 처리방침',
  description: 'OpenRun 개인정보 처리방침',
}
