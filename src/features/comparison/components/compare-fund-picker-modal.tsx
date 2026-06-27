import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { CatalogFund } from '@/core/domain/catalog';
import { getFunds } from '@/features/funds/services/get-funds';
import { ThemedText } from '@/shared/components/themed-text';
import { Button } from '@/shared/components/ui/button';
import { useTheme } from '@/shared/hooks/use-theme';
import { Layout, Radius, Spacing } from '@/shared/theme/theme';

export type CompareFundPickerModalProps = {
  visible: boolean;
  selectedIsins: readonly string[];
  canAddMore: boolean;
  onClose: () => void;
  onSelectFund: (fund: CatalogFund) => void;
};

export function CompareFundPickerModal({
  visible,
  selectedIsins,
  canAddMore,
  onClose,
  onSelectFund,
}: CompareFundPickerModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [funds, setFunds] = useState<CatalogFund[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpen = async () => {
    if (funds.length > 0 || isLoading) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const catalog = await getFunds();
      setFunds(catalog);
    } catch {
      setErrorMessage('No se pudo cargar el catálogo para comparar fondos.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFunds = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return funds
      .filter((fund) => !selectedIsins.includes(fund.isin))
      .filter((fund) => {
        if (!normalized) {
          return true;
        }

        return (
          fund.name.toLowerCase().includes(normalized) ||
          fund.isin.toLowerCase().includes(normalized) ||
          fund.categoryLabel.toLowerCase().includes(normalized)
        );
      })
      .slice(0, 40);
  }, [funds, query, selectedIsins]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onShow={() => {
        void handleOpen();
      }}
      onRequestClose={onClose}
    >
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + Spacing.sm,
              borderBottomColor: theme.border,
            },
          ]}
        >
          <ThemedText type="sectionTitle">Añadir fondo</ThemedText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cerrar selector de fondos"
            onPress={onClose}
          >
            <MaterialCommunityIcons name="close" size={20} color={theme.text} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + Spacing.lg },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {!canAddMore ? (
            <ThemedText type="caption" themeColor="textSecondary">
              Ya has seleccionado el máximo de fondos para comparar.
            </ThemedText>
          ) : (
            <>
              <TextInput
                accessibilityLabel="Buscar fondo para comparar"
                placeholder="Busca por nombre, ISIN o categoría"
                placeholderTextColor={theme.textSecondary}
                value={query}
                onChangeText={setQuery}
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    borderColor: theme.border,
                    backgroundColor: theme.surface,
                  },
                ]}
              />

              {isLoading ? <ActivityIndicator color={theme.primary} /> : null}
              {errorMessage ? (
                <ThemedText type="caption" themeColor="textSecondary">
                  {errorMessage}
                </ThemedText>
              ) : null}

              {filteredFunds.map((fund) => (
                <Pressable
                  key={fund.isin}
                  accessibilityRole="button"
                  accessibilityLabel={`Añadir ${fund.name} a la comparación`}
                  onPress={() => {
                    onSelectFund(fund);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.row,
                    { borderColor: theme.border, backgroundColor: theme.surface },
                    pressed && styles.rowPressed,
                  ]}
                >
                  <View style={styles.rowCopy}>
                    <ThemedText type="bodyBold" numberOfLines={2}>
                      {fund.name}
                    </ThemedText>
                    <ThemedText type="caption" themeColor="textSecondary">
                      {fund.categoryLabel} · {fund.isin}
                    </ThemedText>
                  </View>
                  <MaterialCommunityIcons
                    name="plus-circle-outline"
                    size={20}
                    color={theme.deepOcean}
                  />
                </Pressable>
              ))}
            </>
          )}

          <Button label="Cerrar" variant="secondary" onPress={onClose} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  rowPressed: {
    opacity: 0.85,
  },
  rowCopy: {
    flex: 1,
    gap: 2,
  },
});
