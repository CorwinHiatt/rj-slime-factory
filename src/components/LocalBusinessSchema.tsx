export default function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'RJ Slime Factory',
    description:
      'Premium handcrafted slime shop in Bend, Oregon. Cloud slime, butter slime, clear slime, crunchy slime, and more. Satisfying textures, amazing scents, shipped nationwide.',
    url: 'https://rjslime.xyz',
    logo: 'https://rjslime.xyz/favicon.svg',
    image: 'https://rjslime.xyz/og-image.png',
    telephone: '',
    email: 'hello@rjslimefactory.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bend',
      addressRegion: 'OR',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 44.0582,
      longitude: -121.3153,
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    priceRange: '$',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Credit Card, Debit Card',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    founder: {
      '@type': 'Person',
      name: 'River Jordan Hiatt',
    },
    sameAs: [
      'https://instagram.com/rjslimefactory',
      'https://tiktok.com/@rjslimefactory',
      'https://youtube.com/@rjslimefactory',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Handcrafted Slime Collection',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Cloud Slime',
          description: 'Drizzly, airy cloud slime handmade in Bend, Oregon',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Butter Slime',
          description: 'Smooth, spreadable butter slime with custom scents',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Clear Slime',
          description: 'Crystal-clear stretchy slime with add-ins',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Crunchy Slime',
          description: 'Satisfying crunchy slime with bingsu beads and foam',
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductListSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'RJ Slime Factory - Handcrafted Slime Collection',
    description:
      'Browse premium handcrafted slime from Bend, Oregon. Cloud, butter, clear, crunchy, fluffy, jelly, foam, and glitter slime.',
    url: 'https://rjslime.xyz/shop',
    numberOfItems: 12,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Product',
          name: 'Cotton Candy Cloud Slime',
          description: 'Dreamy, drizzly cloud slime with an airy cotton candy texture.',
          offers: { '@type': 'Offer', price: '14.99', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Product',
          name: 'Midnight Galaxy Glitter Slime',
          description: 'Deep purple glitter slime with holographic star confetti.',
          offers: { '@type': 'Offer', price: '15.99', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Product',
          name: 'Strawberry Butter Slime',
          description: 'Ultra-smooth butter slime that spreads like frosting.',
          offers: { '@type': 'Offer', price: '14.99', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RJ Slime Factory',
    url: 'https://rjslime.xyz',
    description:
      'Premium handcrafted slime made in Bend, Oregon. Shop cloud slime, butter slime, clear slime, and more.',
    publisher: {
      '@type': 'Organization',
      name: 'RJ Slime Factory',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rjslime.xyz/favicon.svg',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
