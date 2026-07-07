import { Header, type HeaderProps } from '@/shared/components/headers/header';

export type HeaderAppProps = Omit<HeaderProps, 'showBrand' | 'title' | 'subtitle'>;

/**
 * @deprecated Use {@link Header} with `showBrand`.
 */
export function HeaderApp(props: HeaderAppProps) {
  return <Header showBrand {...props} />;
}
