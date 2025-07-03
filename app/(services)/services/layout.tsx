import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mental Health Services | Bloom Psychology North Austin',
  description: 'Comprehensive mental health services for women, mothers, and families. Specializing in perinatal mental health, therapy for women, postpartum support, and more.',
  keywords: [
    'therapy services austin',
    'mental health services',
    'perinatal mental health',
    'postpartum therapy',
    'women\'s therapy',
    'individual therapy',
    'virtual therapy texas'
  ],
  openGraph: {
    title: 'Mental Health Services - Bloom Psychology',
    description: 'Expert mental health care for women, mothers, and families in Austin and throughout Texas.',
    url: 'https://bloompsychologynorthaustin.com/services',
    siteName: 'Bloom Psychology',
    type: 'website',
  },
  alternates: {
    canonical: 'https://bloompsychologynorthaustin.com/services',
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}