import { Header, type HeaderProps, type HeaderTitleVariant } from '@/shared/components/headers/header';

export type HeaderScreenTitleVariant = HeaderTitleVariant;

export type HeaderScreenProps = Omit<HeaderProps, 'showBrand'> & {
  title: string;
};

/**
 * @deprecated Use {@link Header} with `title` and without `showBrand`.
 */
export function HeaderScreen({ title, ...props }: HeaderScreenProps) {
  return <Header title={title} {...props} />;
}
