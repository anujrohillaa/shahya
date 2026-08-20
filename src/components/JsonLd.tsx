import React from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Helpers for standard structured schemas
export const getOrganizationSchema = (baseUrl = 'https://shahya.com') => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Shahya',
  url: baseUrl,
  logo: `${baseUrl}/icon.png`,
  description: 'India\'s Direct Zero-Brokerage Flatmate & Room Finder Network.',
  sameAs: [
    'https://twitter.com/shahya_app',
    'https://instagram.com/shahya.app',
    'https://linkedin.com/company/shahya',
  ],
});

export const getWebSiteSchema = (baseUrl = 'https://shahya.com') => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Shahya',
  url: baseUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${baseUrl}/explore?query={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
});

export const getFaqSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
