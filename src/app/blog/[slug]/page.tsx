"use client";

import { useState, use, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Tag,
  Share2,
  Link as LinkIcon,
  Check,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { blogPosts } from "@/lib/data";
import { cn } from "@/lib/utils";
import SectionTitle from "@/components/SectionTitle";

type PageParams = { slug: string };

const fullContent: Record<string, { content: string[]; date: string; readTime: string; tags: string[] }> = {
  "yoga-and-longevity": {
    date: "June 15, 2026",
    readTime: "7 min read",
    tags: ["Longevity", "Yoga Science", "Anti-Aging", "Wellness"],
    content: [
      "The ancient practice of yoga, dating back thousands of years, has long been associated with vitality and prolonged life. Modern science is now catching up, revealing the profound mechanisms through which yoga influences cellular aging and promotes longevity at the molecular level.",
      "At the forefront of this research is the study of telomeres â€” the protective caps at the ends of our chromosomes that shorten as we age. Studies have shown that regular yoga practice can significantly slow telomere shortening, effectively decelerating the biological aging process. This is attributed to yoga's unique ability to reduce oxidative stress and inflammation, two primary drivers of cellular aging.",
      "The practice of yoga nidra, or yogic sleep, has been shown to increase levels of the anti-aging hormone DHEA while decreasing cortisol, the stress hormone that accelerates aging. Participants in an eight-week yoga nidra program experienced a remarkable 43% increase in DHEA levels, suggesting a powerful anti-aging effect at the hormonal level.",
      "Beyond cellular mechanisms, yoga promotes longevity through improved cardiovascular health. The combination of asanas (postures), pranayama (breath control), and meditation has been documented to lower blood pressure, improve heart rate variability, and enhance overall cardiovascular function â€” all factors strongly associated with increased lifespan.",
      "Perhaps most compelling is yoga's impact on brain health. Regular practitioners show increased gray matter density in regions associated with memory, emotional regulation, and decision-making. The neuroplastic effects of yoga may protect against age-related cognitive decline and neurodegenerative diseases.",
      "The anti-inflammatory effects of yoga cannot be overstated. Chronic inflammation is now recognized as a root cause of virtually every age-related disease. Yoga's ability to downregulate pro-inflammatory cytokines while upregulating anti-inflammatory markers provides a powerful defense against the diseases of aging.",
      "Incorporating even 20 minutes of daily yoga practice can initiate these longevity-promoting mechanisms. The key lies in consistency and the integration of all eight limbs of yoga â€” not just the physical postures but also breath work, meditation, and the ethical principles that reduce psychological stress.",
      "As the scientific evidence accumulates, one thing becomes clear: yoga is not merely exercise for the body but a comprehensive system for extending both lifespan and healthspan. The ancient yogis understood intuitively what science is now proving empirically â€” that the path to a long, vibrant life lies in the harmonious integration of body, mind, and spirit.",
    ],
  },
  "morning-yoga-rituals": {
    date: "June 10, 2026",
    readTime: "6 min read",
    tags: ["Morning Routine", "Yoga", "Energy", "Productivity"],
    content: [
      "How you begin your morning sets the tone for the entire day. A carefully crafted morning yoga ritual can transform not just your physical state but your mental clarity, emotional balance, and spiritual connection. Here are ten powerful rituals to elevate your mornings.",
      "Sun Salutations (Surya Namaskar): Begin with 5-10 rounds of Sun Salutations. This dynamic sequence warms the entire body, activates the cardiovascular system, and synchronizes breath with movement. Each round takes approximately 30 seconds, making it an efficient full-body awakening.",
      "Alternate Nostril Breathing (Nadi Shodhana): Follow your Sun Salutations with 5 minutes of alternate nostril breathing. This pranayama technique balances the left and right hemispheres of the brain, harmonizing the nervous system and creating a state of calm alertness that is ideal for the day ahead.",
      "Standing Poses for Grounding: Move into a sequence of standing poses â€” Mountain, Warrior I, Warrior II, and Triangle. Each pose held for 5-8 breaths builds stability, strength, and confidence. These poses activate the root chakra, creating a sense of grounded security.",
      "Heart-Opening Sequence: Include backbends like Cobra, Camel, and Bridge pose to open the chest and heart space. These poses counteract the forward-hunched posture we often adopt during the day and cultivate feelings of openness, compassion, and receptivity.",
      "Twists for Detoxification: Seated twists like Ardha Matsyendrasana (Half Lord of the Fishes) wring out the internal organs, stimulating digestion and detoxification. Twists also release tension stored in the spine, leaving you feeling light and refreshed.",
      "Inversion for Circulation: A brief inversion â€” whether Headstand, Shoulderstand, or simply Legs-Up-The-Wall â€” reverses blood flow, stimulates the lymphatic system, and brings fresh oxygenated blood to the brain, enhancing cognitive function for the day ahead.",
      "Meditation and Intention Setting: Conclude your physical practice with 5-10 minutes of silent meditation. Set a clear intention for the day. This bridges the gap between your inner practice and outer life, ensuring that the peace cultivated on the mat accompanies you throughout your day.",
      "The beauty of these rituals lies in their adaptability. A complete practice can take as little as 15 minutes or extend to an hour. The key is consistency â€” showing up on the mat each morning, regardless of how much time you have, and allowing the practice to evolve naturally with your needs.",
    ],
  },
  "breathwork-stress-relief": {
    date: "June 5, 2026",
    readTime: "8 min read",
    tags: ["Breathwork", "Stress Relief", "Pranayama", "Mental Health"],
    content: [
      "In the midst of our chaotic modern lives, the simplest and most effective tool for stress management is always with us â€” our breath. Ancient yogic breathwork techniques, known collectively as pranayama, offer scientifically validated methods for instantly calming the nervous system and reducing anxiety.",
      "The science behind breathwork is rooted in its direct influence on the autonomic nervous system. Slow, deep breathing activates the vagus nerve â€” the primary parasympathetic nerve â€” signaling the body to shift from fight-or-flight mode to rest-and-digest. This response can be triggered within seconds of conscious breathing.",
      "Box Breathing (Sama Vritti): This technique, used by Navy SEALs and elite performers, involves inhaling for 4 counts, holding for 4, exhaling for 4, and holding empty for 4. This creates a rhythmic pattern that stabilizes heart rate variability and induces calm within minutes.",
      "4-7-8 Breathing: Developed by Dr. Andrew Weil, this technique is particularly effective for sleep and acute anxiety. Inhale through the nose for 4 counts, hold for 7, and exhale through the mouth for 8. The extended exhale activates the parasympathetic nervous system more powerfully than any other pattern.",
      "Alternate Nostril Breathing (Nadi Shodhana): Beyond its balancing effects, this technique has been shown to reduce perceived stress levels by up to 40% in clinical studies. The rhythmic alternation between nostrils harmonizes the cerebral hemispheres and creates a state of coherent brainwave activity.",
      "Lion's Breath (Simhasana): For releasing pent-up stress and tension, Lion's Breath is unparalleled. Inhale deeply through the nose, then open the mouth wide, stick out the tongue, and exhale forcefully with a \"ha\" sound. This practice releases facial tension and clears emotional blockages.",
      "Breath of Fire (Kapalabhati): This energizing technique involves rapid, forceful exhales followed by passive inhales. It generates internal heat, cleanses the respiratory system, and invigorates the mind. A 3-minute practice can elevate alertness and clear brain fog.",
      "The key to effective breathwork lies in regular practice. Just 5-10 minutes daily can rewire your stress response over time, making you more resilient to life's challenges. Start with one technique, master it, and gradually build your breathwork toolkit.",
      "Remember that breathwork is not about forcing or controlling the breath but about befriending it. Approach each session with curiosity rather than expectation, allowing the breath to guide you deeper into states of peace and presence.",
    ],
  },
  "yoga-busy-professionals": {
    date: "May 28, 2026",
    readTime: "6 min read",
    tags: ["Busy Professionals", "Office Yoga", "Productivity", "Wellness"],
    content: [
      "For busy professionals juggling demanding careers, family commitments, and personal growth, finding time for wellness can feel impossible. Yet the very demands of a high-performance lifestyle make yoga not a luxury but a necessity for sustained success.",
      "The 15-Minute Morning Sequence: Wake up 15 minutes earlier for this compact routine. Start with 3 rounds of Sun Salutations (2 minutes), followed by standing poses â€” Mountain, Warrior I on each side, and Triangle (5 minutes). Include a brief backbend sequence â€” Cobra and Bridge (3 minutes), and conclude with 5 minutes of seated meditation and breathwork.",
      "Desk Yoga for the Office: Incorporate micro-practices throughout your workday without leaving your desk. Seated cat-cow stretches release lower back tension. Neck rolls and shoulder shrugs relieve screen-induced stiffness. Wrist and finger stretches prevent repetitive strain injury from typing.",
      "The 3-Minute Breath Reset: Set a timer for every 90 minutes. When it chimes, take 3 minutes for box breathing â€” 4 counts in, 4 hold, 4 out, 4 hold. This resets your nervous system, improves focus, and prevents the accumulation of stress throughout the day.",
      "Walking Meditation Between Meetings: Transform the walk between meeting rooms or the stroll to lunch into a walking meditation. Focus on the sensation of your feet touching the ground, the rhythm of your breath, and the subtle movements of your body. This turns dead time into rejuvenating practice.",
      "Evening Wind-Down Sequence: End your workday with 10 minutes of gentler practice. Forward folds release the spine and calm the mind. Legs-Up-The-Wall pose reverses blood flow and soothes the nervous system. A brief body scan meditation prepares you for restful sleep.",
      "The benefits for professionals are measurable: improved focus and cognitive function, reduced stress and burnout, enhanced creativity and problem-solving, better posture and reduced physical pain, and improved emotional regulation in high-pressure situations.",
      "Companies that have introduced workplace yoga programs report 30% reductions in employee stress, 20% improvements in productivity, and significantly lower turnover rates. Yoga is not just self-care â€” it is a strategic performance enhancement tool.",
      "Begin with just one micro-practice per day. Consistency matters more than duration. A five-minute daily practice will serve you better than a one-hour practice once a month. Your body, mind, and career will thank you.",
    ],
  },
  "mindfulness-everyday-life": {
    date: "May 20, 2026",
    readTime: "7 min read",
    tags: ["Mindfulness", "Daily Practice", "Presence", "Wellness"],
    content: [
      "Mindfulness â€” the practice of paying attention to the present moment without judgment â€” has transformed from an ancient Buddhist meditation into a scientifically validated approach to mental health and wellbeing. Yet many struggle to integrate it into daily life, believing it requires hours of silent retreat.",
      "The truth is that mindfulness can be woven into every activity of your day, transforming mundane routines into profound practices of presence. The key is not to find more time for mindfulness but to bring mindfulness into the time you already have.",
      "Mindful Morning: Begin your day by resisting the urge to check your phone. Instead, stay in bed for three minutes, feeling the breath moving through your body, noticing the quality of light in the room, and setting an intention for the day. This simple practice shifts your neural pathways toward presence before the world makes its demands.",
      "Mindful Showering: Feel the temperature of the water on your skin, the scent of soap, the sound of water hitting the tiles. This sensory immersion is a form of meditation that grounds you in your body and prepares you for the day with full presence.",
      "Mindful Commuting: Whether driving, walking, or taking public transport, turn off audio inputs and simply be with your experience. Notice the rhythm of your movement, the play of light and shadow, the faces of fellow travelers. This transforms commute time from dead time into living presence.",
      "Mindful Eating: Choose one meal per day to eat without any screens or reading material. Observe the colors and textures of your food. Chew slowly, noticing the explosion of flavors. This practice improves digestion, reduces overeating, and cultivates gratitude for nourishment.",
      "Mindful Listening: In conversations, practice listening without planning your response. Give the speaker your complete attention. Notice the impulse to interrupt and let it pass. This single practice will transform your relationships and deepen your connections.",
      "Mindful Pause: Set three random alarms throughout the day. When they ring, pause for one full breath cycle. Notice where you are, what you're feeling, and what's happening around you. These micro-pauses prevent the autopilot mode that leads to stress and reactivity.",
      "The beauty of everyday mindfulness is that it requires no special equipment, no additional time, and no particular skill. It simply requires the willingness to be present. Start with one practice today and watch as presence gradually infuses every aspect of your life.",
    ],
  },
  "yoga-mental-health": {
    date: "May 12, 2026",
    readTime: "8 min read",
    tags: ["Mental Health", "Yoga Therapy", "Emotional Wellness", "Science"],
    content: [
      "The intersection of yoga and mental health represents one of the most promising frontiers in integrative medicine. As global rates of anxiety, depression, and stress-related disorders continue to rise, yoga offers a comprehensive, drug-free approach to emotional wellbeing that addresses root causes rather than symptoms.",
      "The Neurochemistry of Yoga: Yoga practice influences several key neurotransmitter systems. Regular practice increases GABA levels â€” the brain's primary inhibitory neurotransmitter â€” by up to 27%. Low GABA levels are strongly associated with anxiety disorders. This neurochemical shift may explain why yoga is as effective as some anti-anxiety medications in clinical trials.",
      "Serotonin and the Happiness Molecule: The combination of physical movement, breath control, and meditative focus in yoga stimulates serotonin production. Unlike pharmaceutical approaches that block serotonin reuptake, yoga enhances the body's natural ability to produce and regulate this crucial mood-stabilizing neurotransmitter.",
      "Cortisol Regulation: Chronic stress keeps cortisol levels chronically elevated, contributing to depression, anxiety, and cognitive decline. Yoga has been shown to reduce cortisol levels by 30-40% in regular practitioners. The emphasis on conscious breathing and relaxation directly counteracts the stress response.",
      "Emotional Regulation Through the Vagus Nerve: Yoga's emphasis on slow, deep breathing stimulates the vagus nerve, enhancing what researchers call \"vagal tone.\" High vagal tone is associated with better emotional regulation, greater resilience to stress, and improved social connection.",
      "Trauma-Informed Yoga: Specialized yoga approaches for trauma survivors have shown remarkable results. By combining gentle movement with interoception â€” the awareness of internal body sensations â€” trauma-informed yoga helps survivors rebuild a safe relationship with their bodies and regulate hyper-aroused nervous systems.",
      "Mindfulness-Based Stress Reduction (MBSR): This standardized program, developed by Dr. Jon Kabat-Zinn, combines yoga and meditation in an eight-week protocol that has been shown to reduce symptoms of anxiety, depression, and chronic pain by 50-70% in clinical studies.",
      "The Social Connection: Group yoga classes provide a structured environment for social connection without the pressure of verbal interaction. This shared practice creates a sense of belonging and community that is itself protective against depression and anxiety.",
      "Yoga is not a replacement for professional mental health care, but it is a powerful complementary practice. For those struggling with mild to moderate anxiety, depression, or stress, a consistent yoga practice can be transformative. As always, consult with healthcare providers to determine the approach that is right for you.",
    ],
  },
};

export default function BlogPostPage({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [copied, setCopied] = useState(false);

  const postIndex = blogPosts.findIndex((p) => p.slug === slug);
  const post = blogPosts[postIndex];
  const contentData = fullContent[slug];

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return blogPosts
      .filter(
        (p) => p.slug !== slug && p.category === post.category
      )
      .slice(0, 3);
  }, [slug, post]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  if (!post || !contentData) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
            <span className="font-serif text-4xl text-gold">~</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-wine mb-3">
            Article Not Found
          </h1>
          <p className="text-wine/60 text-sm leading-relaxed mb-8">
            The wellness article you&apos;re looking for may have moved or no
            longer exists.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-wine to-purple text-white text-sm font-semibold hover:bg-wine/90 transition-all duration-300 shadow-lg shadow-wine/20"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Top Navigation */}
      <div className="sticky top-0 z-20 bg-ivory/80 backdrop-blur-xl border-b border-wine/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-wine/50 hover:text-wine text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-wine/30 font-medium">
              Share
            </span>
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-lg hover:bg-wine/5 text-wine/50 hover:text-wine transition-all"
              title="Copy link"
            >
              {copied ? <Check size={16} /> : <LinkIcon size={16} />}
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(
                    post.title + " - " + window.location.href
                  )}`
                )
              }
              className="p-2 rounded-lg hover:bg-wine/5 text-wine/50 hover:text-wine transition-all"
              title="Share on WhatsApp"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <article>
        {/* Hero Header */}
        <header className="relative py-16 md:py-20 overflow-hidden gradient-primary">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 40%, #D4A373 1px, transparent 1px), radial-gradient(circle at 70% 60%, #F8F5F0 1px, transparent 1px)",
                backgroundSize: "50px 50px, 70px 70px",
              }}
            />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-ivory/10 border border-ivory/20 text-ivory/80 text-xs font-semibold tracking-wide uppercase mb-4">
                {post.category}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-ivory leading-tight">
                {post.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-ivory/60 text-sm">
                <span className="flex items-center gap-1.5">
                  <User size={14} />
                  Sunita Singh
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {contentData.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {contentData.readTime}
                </span>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Featured Image Placeholder */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={cn(
              "relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl",
              "bg-gradient-to-br from-wine/30 via-gold/20 to-purple/10"
            )}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <div className="w-12 h-12 rounded-full bg-white/20" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="prose prose-lg max-w-none"
          >
            {contentData.content.map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="text-wine/70 leading-relaxed mb-6 text-base md:text-lg"
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 pt-8 border-t border-wine/10 flex flex-wrap items-center gap-3"
          >
            <Tag size={16} className="text-wine/30" />
            {contentData.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-semibold tracking-wide"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Author Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-10 p-6 rounded-2xl bg-white border border-wine/5 flex items-start gap-4"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-wine to-gold flex-shrink-0 flex items-center justify-center text-ivory font-serif font-bold text-lg">
              SS
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-wine">
                Sunita Singh
              </h4>
              <p className="text-wine/50 text-sm mt-1 leading-relaxed">
                Founder of MYSTIC YOGA&trade;, international yoga teacher,
                meditation guide, and holistic wellness coach with over a decade
                of experience transforming lives worldwide.
              </p>
            </div>
          </motion.div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 md:py-20 gradient-rose">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle
              title="Related Articles"
              subtitle="Continue your wellness journey"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((rp, i) => {
                const rpIndex = blogPosts.findIndex(
                  (bp) => bp.slug === rp.slug
                );
                const rpData = fullContent[rp.slug];
                return (
                  <motion.article
                    key={rp.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 * i }}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-wine/10 transition-all duration-500"
                  >
                    <Link href={`/blog/${rp.slug}`} className="block">
                      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-wine/20 via-gold/20 to-purple/10">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                            <div className="w-7 h-7 rounded-full bg-white/25" />
                          </div>
                        </div>
                      </div>
                      <div className="p-5">
                        <span className="text-xs text-wine font-semibold tracking-wide uppercase">
                          {rp.category}
                        </span>
                        <h3 className="font-serif text-base font-bold text-wine group-hover:text-wine transition-colors duration-300 mt-1 leading-snug">
                          {rp.title}
                        </h3>
                        <p className="text-wine/60 text-sm mt-2 line-clamp-2">
                          {rp.excerpt}
                        </p>
                        <span className="inline-flex items-center gap-1 text-wine text-xs font-semibold mt-3 group/link">
                          Read More
                          <ChevronRight
                            size={14}
                            className="transition-transform duration-300 group-hover/link:translate-x-0.5"
                          />
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto px-4"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-wine">
            Ready to Deepen Your Practice?
          </h2>
          <p className="mt-3 text-wine/60 text-sm max-w-md mx-auto">
            Join our global community and access exclusive wellness resources,
            classes, and guidance.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-wine hover:bg-wine/90 text-ivory text-sm font-semibold transition-all duration-300 shadow-lg shadow-wine/20"
          >
            Explore MYSTIC YOGA&trade;
            <ArrowLeft size={16} className="rotate-180" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
