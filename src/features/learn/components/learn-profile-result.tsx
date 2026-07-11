import { View } from 'react-native';



import type { EducationalProfile } from '@/core/domain/educational-profile';

import {

  getEducationalProfileSummary,

  getFinancialReadinessLabel,

  getInvestmentHorizonLabel,

  getInvestorStyleLabel,

  getKnowledgeLevelLabel,

  getLearningGoalLabel,

  getRiskOrientationLabel,

} from '@/features/learn/services/build-educational-profile';

import { LegalNotice } from '@/shared/components/legal/legal-notice';

import { TextHeading, TextLabel, TextParagraph } from '@/shared/components/text';

import { Badge } from '@/shared/components/ui';



export type LearnProfileResultProps = {

  profile: EducationalProfile;

};



type ProfileMetricProps = {

  label: string;

  value: string;

};



function ProfileMetric({ label, value }: ProfileMetricProps) {

  return (

    <View className="gap-xs">

      <TextParagraph variant="secondary" themeColor="textSecondary">

        {label}

      </TextParagraph>

      <TextParagraph variant="emphasis">{value}</TextParagraph>

    </View>

  );

}



function getFinancialReadinessBadgeVariant(

  readiness: EducationalProfile['financialReadiness'],

): 'mint' | 'warning' | 'muted' {

  switch (readiness) {

    case 'ready':

      return 'mint';

    case 'not-ready':

      return 'warning';

    case 'caution':

    default:

      return 'muted';

  }

}



/**

 * Summarizes the orientative educational profile after questionnaire completion.

 */

export function LearnProfileResult({ profile }: LearnProfileResultProps) {

  const summary = getEducationalProfileSummary(profile);



  return (

    <View className="gap-lg">

      <View className="gap-sm">

        <TextLabel variant="meta" themeColor="deepOcean">

          Tu perfil orientativo

        </TextLabel>

        <TextHeading variant="section" className="tracking-[-0.2px]">

          Gracias por tomarte este momento

        </TextHeading>

        <TextParagraph variant="secondary" themeColor="textSecondary" className="leading-6">

          {summary}

        </TextParagraph>

      </View>



      <View className="gap-md rounded-card border border-border-subtle bg-soft-teal-surface-faint p-md">

        <View className="flex-row flex-wrap gap-sm">

          <Badge label={getRiskOrientationLabel(profile.riskOrientation)} variant="mint" />

          <Badge label={getKnowledgeLevelLabel(profile.knowledgeLevel)} variant="muted" />

          <Badge

            label={getInvestorStyleLabel(profile.investorStyle)}

            variant="muted"

          />

          <Badge

            label={getFinancialReadinessLabel(profile.financialReadiness)}

            variant={getFinancialReadinessBadgeVariant(profile.financialReadiness)}

          />

        </View>



        <View className="gap-md">

          <ProfileMetric

            label="Horizonte"

            value={getInvestmentHorizonLabel(profile.investmentHorizon)}

          />

          <ProfileMetric

            label="Próximo paso sugerido"

            value={getLearningGoalLabel(profile.learningGoal)}

          />

        </View>

      </View>



      <LegalNotice

        title="Perfil educativo, no asesoramiento"

        body="Este resultado es orientativo. Se guarda en tu dispositivo y, de forma anónima, una copia resumida en nuestros servidores para orientar el producto (sin cuenta ni datos personales). No constituye una recomendación de inversión ni un test de idoneidad. Toda inversión conlleva riesgo y la rentabilidad pasada no garantiza resultados futuros."

      />

    </View>

  );

}

