import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { TextLegal } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';

export type LegalNoticeProps = {
  title?: string;
  body: string;
  learnMoreLabel?: string;
  onLearnMorePress?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function LegalNotice({
  title = 'Información educativa',
  body,
  learnMoreLabel = 'Más información legal',
  onLearnMorePress,
  className,
  style,
}: LegalNoticeProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={`${title}. ${body}`}
      className={['gap-xs rounded-card border px-md py-sm', className].filter(Boolean).join(' ')}
      style={[
        {
          backgroundColor: theme.backgroundSoft,
          borderColor: theme.border,
        },
        style,
      ]}
    >
      <View className="flex-row items-center gap-xs">
        <MaterialCommunityIcons name="information-outline" size={14} color={theme.textSecondary} />
        <TextLegal themeColor="textSecondary">{title}</TextLegal>
      </View>

      <TextLegal themeColor="textSecondary">{body}</TextLegal>

      {onLearnMorePress ? (
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={learnMoreLabel}
          onPress={onLearnMorePress}
          className="mt-xs self-start active:opacity-75"
        >
          <TextLegal themeColor="primary" className="underline">
            {learnMoreLabel}
          </TextLegal>
        </Pressable>
      ) : null}
    </View>
  );
}
