import { asLink, LinkField, PrismicDocument } from '@prismicio/client';
import { Link } from 'next-view-transitions';
import { linkResolver } from '@/prismicio';

export type TransitionLinkProps = {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tabIndex?: number;
} & (
  | { field: LinkField | null; document?: never; href?: never }
  | { field?: never; document: PrismicDocument | null; href?: never }
  | { field?: never; document?: never; href: string }
);

export const TransitionLink = ({
  field,
  document: doc,
  href,
  children,
  className,
  onClick,
  tabIndex,
}: TransitionLinkProps) => {
  const url = href ?? asLink(field ?? doc, { linkResolver });

  if (!url) {
    console.warn('TransitionLink: No URL Found');
    return null;
  }

  return (
    <Link href={url} className={className} onClick={onClick} tabIndex={tabIndex}>
      {field?.text ?? children}
    </Link>
  );
};
