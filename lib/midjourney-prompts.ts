import { BlogPost } from './data/blog-posts';

export interface MidjourneyPrompt {
  blogId: string;
  title: string;
  prompt: string;
  style: string;
  aspectRatio: string;
}

// Base style for all Bloom Psychology images
const BLOOM_STYLE = "soft watercolor illustration, calming pastel colors, gentle feminine aesthetic, professional psychology practice, warm and inviting, minimal and elegant";

// Specific styles for different blog categories
const CATEGORY_STYLES = {
  postpartum: "new mother holding baby, peaceful nursery, soft natural light, maternal warmth",
  anxiety: "woman in meditation pose, serene environment, breathing deeply, calm atmosphere",
  therapy: "cozy therapy office, comfortable armchair, warm lighting, safe space",
  parenting: "parent and child connection, playful interaction, family bonding",
  selfcare: "woman practicing self-care, relaxation, mindfulness, personal wellness",
  work: "professional woman, office setting, work-life balance, confident posture"
};

export function generateMidjourneyPrompt(post: BlogPost): MidjourneyPrompt {
  // Determine category based on keywords in title and excerpt
  let categoryStyle = CATEGORY_STYLES.therapy; // default
  
  const content = `${post.title} ${post.excerpt}`.toLowerCase();
  
  if (content.includes('postpartum') || content.includes('new mom') || content.includes('baby')) {
    categoryStyle = CATEGORY_STYLES.postpartum;
  } else if (content.includes('anxiety') || content.includes('stress')) {
    categoryStyle = CATEGORY_STYLES.anxiety;
  } else if (content.includes('parent') || content.includes('child')) {
    categoryStyle = CATEGORY_STYLES.parenting;
  } else if (content.includes('self-care') || content.includes('self care')) {
    categoryStyle = CATEGORY_STYLES.selfcare;
  } else if (content.includes('work') || content.includes('career')) {
    categoryStyle = CATEGORY_STYLES.work;
  }
  
  // Extract key themes from the post
  const keywords = extractKeywords(post.title, post.excerpt);
  
  // Build the prompt
  const prompt = `${categoryStyle}, ${BLOOM_STYLE}, ${keywords.join(', ')}, no text, no words --ar 16:9 --v 6`;
  
  return {
    blogId: post.id.toString(),
    title: post.title,
    prompt: prompt,
    style: BLOOM_STYLE,
    aspectRatio: "16:9"
  };
}

function extractKeywords(title: string, excerpt: string): string[] {
  // Extract meaningful keywords for image generation
  const keywords: string[] = [];
  
  // Add mood/emotion keywords
  if (title.includes('Joy') || excerpt.includes('joy')) keywords.push('joyful expression');
  if (title.includes('Support') || excerpt.includes('support')) keywords.push('supportive environment');
  if (title.includes('Micro-Moments')) keywords.push('small precious moments');
  if (title.includes('Return to Work')) keywords.push('professional transition');
  
  // Add visual elements
  keywords.push('soft bokeh background');
  keywords.push('natural lighting');
  keywords.push('bloom flowers subtly in background');
  
  return keywords;
}

// Generate prompts for all blog posts
export function generateAllPrompts(posts: BlogPost[]): MidjourneyPrompt[] {
  return posts.map(post => generateMidjourneyPrompt(post));
}

// Format prompts for easy copying to Discord
export function formatPromptsForDiscord(prompts: MidjourneyPrompt[]): string {
  return prompts.map(p => 
    `**Blog Post:** ${p.title}\n**Prompt:** /imagine ${p.prompt}\n---`
  ).join('\n\n');
}