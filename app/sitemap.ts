import { MetadataRoute } from 'next'
import { services } from '@/lib/data/services'
import { blogPosts } from '@/lib/data/blog-posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bloompsychologynorthaustin.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    // Landing pages
    {
      url: `${baseUrl}/new-mom-program`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/book`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/book-new-mom-program`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    // Resources
    {
      url: `${baseUrl}/resources/postpartum-checklist`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    // Other pages
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/newsletter`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Service pages
  const servicePages = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  // Virtual therapy pages
  const virtualTherapyPages = [
    '/virtual-therapy',
    '/virtual-therapy/how-it-works',
    '/virtual-therapy/technology-privacy', 
    '/virtual-therapy/is-virtual-right-for-you'
  ].map(url => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  // Texas service area pages
  const texasServicePages = [
    '/texas-service-areas',
    '/texas-service-areas/dallas',
    '/texas-service-areas/houston', 
    '/texas-service-areas/austin-metro',
    '/texas-service-areas/san-antonio',
    '/texas-service-areas/why-travel-to-austin'
  ].map(url => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Additional resource pages
  const resourcePages = [
    '/resources/grounding-techniques',
    '/resources/new-mom-guide',
    '/resources/self-assessment'
  ].map(url => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Blog posts
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...servicePages, ...virtualTherapyPages, ...texasServicePages, ...resourcePages, ...blogPages]
}