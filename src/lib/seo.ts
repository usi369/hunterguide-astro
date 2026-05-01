export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}

export function generateSEOMeta(props: SEOProps) {
  const {
    title,
    description,
    image = 'https://monchan3.xsrv.jp/og-image.png',
    url = 'https://monchan-encyclopedia.pages.dev',
    type = 'website',
  } = props;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      image,
      url,
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image,
    },
  };
}

export function generateStructuredData(data: any) {
  return JSON.stringify(data);
}
