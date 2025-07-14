'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Book, Smartphone, Globe, Headphones, Users, ArrowLeft, ExternalLink, Heart } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function FourthTrimesterGuidePage() {
  const resources = {
    books: [
      {
        title: "Good Moms Have Scary Thoughts",
        author: "Karen Kleiman",
        description: "Normalizes intrusive thoughts and provides reassurance for new mothers",
        link: "https://www.amazon.com/Good-Moms-Have-Scary-Thoughts/dp/1641701250"
      },
      {
        title: "The Fourth Trimester",
        author: "Kimberly Ann Johnson",
        description: "A comprehensive guide to postpartum recovery and healing",
        link: "https://www.amazon.com/Fourth-Trimester-Postpartum-Restored-Guidance/dp/1611804003"
      },
      {
        title: "Cribsheet",
        author: "Emily Oster",
        description: "Data-driven guide to better, more relaxed parenting",
        link: "https://www.amazon.com/Cribsheet-Data-Driven-Relaxed-Parenting-Preschool/dp/0525559256"
      },
      {
        title: "Self-Compassion",
        author: "Kristin Neff",
        description: "Learn to be kind to yourself during challenging times",
        link: "https://www.amazon.com/Self-Compassion-Kristin-Neff/dp/0061733512"
      },
      {
        title: "Operating Instructions",
        author: "Anne Lamott",
        description: "A journal of a son's first year - honest and humorous",
        link: "https://www.amazon.com/Operating-Instructions-Journal-Sons-First/dp/1400079098"
      },
      {
        title: "What No One Tells You",
        author: "Dr. Alexandra Sacks",
        description: "A guide to your emotions from pregnancy to motherhood",
        link: "https://www.amazon.com/What-No-One-Tells-You/dp/1501197932"
      }
    ],
    apps: [
      {
        name: "Expectful",
        description: "Meditations specifically designed for mothers",
        platform: "iOS/Android",
        link: "https://expectful.com"
      },
      {
        name: "Sanvello",
        description: "Mood tracking and coping skills",
        platform: "iOS/Android",
        link: "https://www.sanvello.com"
      },
      {
        name: "Peanut",
        description: "Connect with other moms in your area",
        platform: "iOS/Android",
        link: "https://www.peanut-app.io"
      },
      {
        name: "Headspace",
        description: "General mindfulness and meditation",
        platform: "iOS/Android",
        link: "https://www.headspace.com"
      },
      {
        name: "Marco Polo",
        description: "Video messages for staying connected",
        platform: "iOS/Android",
        link: "https://www.marcopolo.me"
      },
      {
        name: "Wonder Weeks",
        description: "Track baby's developmental leaps and fussy periods",
        platform: "iOS/Android",
        link: "https://www.thewonderweeks.com"
      }
    ],
    websites: [
      {
        name: "Postpartum Support International",
        description: "Global network of postpartum support resources",
        link: "https://www.postpartum.net"
      },
      {
        name: "The Blue Dot Project",
        description: "Maternal mental health awareness and support",
        link: "https://thebluedotproject.org"
      },
      {
        name: "Mother.ly",
        description: "Evidence-based parenting content and community",
        link: "https://www.mother.ly"
      },
      {
        name: "MOPS (Mothers of Preschoolers)",
        description: "Local and online support groups for mothers",
        link: "https://www.mops.org"
      },
      {
        name: "Dinner Elf",
        description: "Chef meal prep service in Austin, Dallas, San Antonio & Denver",
        link: "https://www.dinnerelf.com"
      },
      {
        name: "Home Chef",
        description: "Easy meals that can be prepared in 30 minutes or less",
        link: "https://www.homechef.com"
      },
      {
        name: "Meal Train",
        description: "Organize meal support from friends and family",
        link: "https://www.mealtrain.com"
      }
    ],
    podcasts: [
      {
        name: "The Longest Shortest Time",
        description: "Honest conversations about parenting",
        host: "Hillary Frank"
      },
      {
        name: "Motherhood Sessions",
        description: "Therapy sessions with real moms",
        host: "Dr. Alexandra Sacks"
      },
      {
        name: "The Birth Hour",
        description: "Birth stories and postpartum experiences",
        host: "Bryn Huntpalmer"
      },
      {
        name: "Unruffled",
        description: "Self-care and mindfulness for parents",
        host: "Janet Lansbury"
      },
      {
        name: "Mom and Mind",
        description: "Maternal mental health education",
        host: "Katayune Kaeni"
      }
    ],
    professional: [
      {
        title: "Perinatal Therapists",
        description: "Find certified perinatal mental health professionals",
        link: "https://www.postpartum.net/professionals/professional-directory/",
        cta: "Find a Therapist"
      },
      {
        title: "Postpartum Doulas",
        description: "In-home support for new families",
        link: "https://www.dona.org/what-is-a-doula/find-a-doula/",
        cta: "Find a Doula"
      },
      {
        title: "Parent Coaches",
        description: "Guidance for parenting challenges",
        link: null,
        cta: "Learn More"
      },
      {
        title: "Support Groups",
        description: "Partners in Parenting (Austin) or find free groups worldwide",
        link: "https://www.postpartum.net/get-help/psi-online-support-meetings/",
        cta: "Find Groups"
      },
      {
        title: "Psychiatric Support",
        description: "Medication management when needed",
        link: "https://www.postpartum.net/professionals/professional-directory/",
        cta: "Find a Psychiatrist"
      },
      {
        title: "Lactation Consultants (IBCLC)",
        description: "Expert feeding support, latch issues, pumping questions",
        link: "https://uslca.org/resources/find-an-ibclc/",
        cta: "Find an IBCLC"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <Link 
            href="/wellness-hub"
            className="inline-flex items-center text-bloom-dark/70 hover:text-bloom-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Growth Studio
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-bloom-pink-50 text-bloom-pink-dark px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Course Participant Exclusive
            </div>
            
            <h1 className="text-4xl md:text-5xl font-playfair text-bloom-dark mb-6">
              Your 4th Trimester <span className="text-bloompink">Resource Guide</span>
            </h1>
            
            <p className="text-xl text-bloom-dark/80 max-w-3xl mx-auto mb-8">
              Carefully curated resources to support your continued growth and healing 
              beyond our course. Each recommendation has been selected for its evidence-based 
              approach and alignment with our therapeutic philosophy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Books Section */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-bloom-sage-100 rounded-xl flex items-center justify-center">
                <Book className="w-6 h-6 text-bloom-sage" />
              </div>
              <h2 className="text-3xl font-playfair text-bloom-dark">Books for Continued Growth</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {resources.books.map((book, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-soft hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold text-bloom-dark mb-1">{book.title}</h3>
                  <p className="text-sm text-bloom-sage mb-3">by {book.author}</p>
                  <p className="text-bloom-dark/70 mb-4">{book.description}</p>
                  <a 
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-bloom-sage hover:text-bloom-sage-dark transition-colors text-sm font-medium"
                  >
                    View on Amazon
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Apps Section */}
      <section className="py-12 px-6 bg-white/50">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-bloom-pink-100 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-bloompink" />
              </div>
              <h2 className="text-3xl font-playfair text-bloom-dark">Apps for Daily Support</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.apps.map((app, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-white to-bloom-pink-50/20 rounded-xl p-6 border border-bloom-pink-50"
                >
                  <h3 className="font-semibold text-bloom-dark mb-2">{app.name}</h3>
                  <p className="text-bloom-dark/70 mb-3">{app.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-bloom-dark/60">{app.platform}</span>
                    <a 
                      href={app.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-bloompink hover:text-bloom-pink-dark transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Websites Section */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-bloom-cream-100 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-bloom-cream-dark" />
              </div>
              <h2 className="text-3xl font-playfair text-bloom-dark">Websites & Online Resources</h2>
            </div>
            
            <div className="space-y-4">
              {resources.websites.map((site, index) => (
                <motion.a
                  key={index}
                  href={site.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="block bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-bloom-dark group-hover:text-bloom-sage transition-colors">
                        {site.name}
                      </h3>
                      <p className="text-bloom-dark/70 mt-1">{site.description}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-bloom-dark/30 group-hover:text-bloom-sage transition-colors" />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Podcasts Section */}
      <section className="py-12 px-6 bg-gradient-to-br from-bloom-sage-50/30 to-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-bloom-sage-100 rounded-xl flex items-center justify-center">
                <Headphones className="w-6 h-6 text-bloom-sage" />
              </div>
              <h2 className="text-3xl font-playfair text-bloom-dark">Podcasts for Ongoing Learning</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.podcasts.map((podcast, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-soft"
                >
                  <Headphones className="w-8 h-8 text-bloom-sage mb-3" />
                  <h3 className="font-semibold text-bloom-dark mb-1">{podcast.name}</h3>
                  <p className="text-sm text-bloom-dark/60 mb-2">Hosted by {podcast.host}</p>
                  <p className="text-bloom-dark/70">{podcast.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Professional Support Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-bloom-pink-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-bloompink" />
              </div>
              <h2 className="text-3xl font-playfair text-bloom-dark">Professional Support Options</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {resources.professional.map((prof, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-white to-bloom-pink-50/20 rounded-xl p-6 border border-bloom-pink-50"
                >
                  <h3 className="font-semibold text-bloom-dark mb-2">{prof.title}</h3>
                  <p className="text-bloom-dark/70 mb-4">{prof.description}</p>
                  {prof.link ? (
                    <a 
                      href={prof.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-bloompink text-white px-4 py-2 rounded-lg hover:bg-bloom-pink-dark transition-colors text-sm font-medium"
                    >
                      {prof.cta}
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  ) : (
                    <Button variant="outline" size="sm">
                      {prof.cta}
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-bloom-pink-100 to-bloom-sage-100">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-playfair text-bloom-dark mb-4">
              Remember, You're Not Alone
            </h2>
            <p className="text-lg text-bloom-dark/80 mb-8 max-w-2xl mx-auto">
              These resources are here to supplement your journey. If you need immediate support 
              or have questions about your course materials, please reach out to me directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/wellness-hub" variant="pink">
                Return to Growth Studio
              </Button>
              <Button href="mailto:jana@bloompsychology.com" variant="outline">
                Email Dr. Jana
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}