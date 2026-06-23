export const siteConfig = {
  name: 'MYSTIC YOGA™',
  tagline: 'Awaken Your Inner Power. Transform Your Life.',
  description: 'Mystic Yoga is an international wellness platform founded by Sunita Singh, dedicated to helping individuals achieve peak health, mental clarity, emotional balance, and spiritual growth.',
  url: 'https://www.mysticyoga.global',
  founder: 'Sunita Singh',
  headquarters: 'Mystic Yoga, 32/F, BLK 7 SUN TUEN MUN CENTRE 55 LUNG MUN RD TUEN MUN, NT',
  phones: ['+852 4464 4381', '+91 91640 81909'],
  email: 'info@mysticyoga.global',
  socials: {
    instagram: 'https://instagram.com/mysticyoga',
    facebook: 'https://facebook.com/mysticyoga',
    youtube: 'https://youtube.com/@mysticyoga',
    linkedin: 'https://linkedin.com/company/mysticyoga',
  },
};

export const whyChooseUs = [
  { title: 'Internationally Certified Yoga Programs', description: 'Globally recognized certifications and training modules.' },
  { title: 'Personalized Wellness Coaching', description: 'Tailored programs designed for your unique needs.' },
  { title: 'Online & Offline Classes Worldwide', description: 'Access classes from anywhere in the world.' },
  { title: 'Corporate Wellness Solutions', description: 'Transform workplace wellbeing and productivity.' },
  { title: 'Meditation & Mindfulness Training', description: 'Cultivate inner peace and mental clarity.' },
  { title: 'Weight Management Programs', description: 'Sustainable transformation through holistic practices.' },
  { title: 'Stress Reduction Techniques', description: 'Evidence-based methods for stress relief.' },
  { title: 'Luxury Wellness Retreats', description: 'Immersive transformational experiences globally.' },
  { title: 'Private Yoga Sessions', description: 'One-on-one personalized guidance and attention.' },
  { title: 'Holistic Lifestyle Transformation', description: 'Complete mind-body-spirit wellness integration.' },
];

export const benefits = [
  { title: 'Improve Flexibility & Strength', icon: 'flexibility', description: 'Enhance physical capabilities and body awareness.' },
  { title: 'Reduce Stress & Anxiety', icon: 'stress', description: 'Find calm through breathwork and mindfulness.' },
  { title: 'Enhance Focus & Productivity', icon: 'focus', description: 'Sharpen mental clarity and cognitive performance.' },
  { title: 'Improve Sleep & Energy Levels', icon: 'sleep', description: 'Restore natural rhythms and vitality.' },
  { title: 'Build Emotional Resilience', icon: 'resilience', description: 'Develop inner strength and emotional balance.' },
  { title: 'Achieve Holistic Wellness', icon: 'wellness', description: 'Complete integration of body, mind, and spirit.' },
];

export const qualifications = [
  'International Yoga Teacher Certifications',
  'Advanced Yoga & Meditation Training',
  'Pranayama & Breathwork Specialist',
  'Mindfulness & Stress Management Expert',
  'Holistic Wellness Coach',
  'Corporate Wellness Consultant',
  'Lifestyle Transformation Mentor',
];

export const services = [
  {
    title: 'Personal Yoga Training',
    description: 'Customized one-on-one yoga sessions tailored to your goals, body type, and wellness needs.',
    features: ['Weight Loss Yoga', 'Flexibility Training', 'Strength Building Yoga', 'Therapeutic Yoga', 'Posture Correction', 'Senior Citizen Yoga'],
    image: '/images/yoga-personal.jpg',
  },
  {
    title: 'Meditation & Mindfulness',
    description: 'Transform your inner world through guided practices that cultivate peace, clarity, and emotional balance.',
    features: ['Guided Meditation', 'Mindfulness Practices', 'Breathwork Sessions', 'Stress Relief Programs', 'Sleep Improvement Techniques'],
    image: '/images/meditation.jpg',
  },
  {
    title: 'Corporate Wellness Programs',
    description: 'Strategic wellness solutions that boost employee wellbeing, engagement, and organizational success.',
    features: ['Stress Management', 'Better Focus', 'Increased Productivity', 'Improved Team Engagement', 'Workplace Wellbeing'],
    image: '/images/corporate.jpg',
  },
  {
    title: "Women's Wellness Programs",
    description: 'Holistic wellness designed for women at every life stage, from pregnancy to menopause and beyond.',
    features: ['Hormonal Balance', 'Pregnancy Yoga', 'Postnatal Recovery', 'Menopause Support', 'Emotional Wellness'],
    image: '/images/women-wellness.jpg',
  },
  {
    title: 'International Online Classes',
    description: 'Live interactive sessions with personalized guidance, connecting a global community of wellness seekers.',
    features: ['Live Interactive Sessions', 'Recorded Classes', 'Personal Guidance', 'Global Community Access'],
    image: '/images/online-classes.jpg',
  },
  {
    title: 'Luxury Wellness Retreats',
    description: 'Immersive transformational experiences in breathtaking locations around the world.',
    features: ['Yoga', 'Meditation', 'Detox Programs', 'Sound Healing', 'Nature Therapy', 'Wellness Workshops'],
    image: '/images/retreats.jpg',
  },
];

export const classPackages = [
  { name: '4 Classes', price: 600, currency: 'HKD', duration: '1 Month', popular: false, bestValue: false, image: '/images/600.png', features: ['Live Interactive Sessions', 'Suitable for Beginners', 'Flexible Scheduling', 'Valid for 1 Month'] },
  { name: '10 Classes', price: 1200, currency: 'HKD', duration: '2 Months', popular: false, bestValue: false, image: '/images/1200.png', features: ['Live Interactive Sessions', 'Personalized Guidance', 'Access to Recorded Sessions', 'Valid for 2 Months'] },
  { name: '20 Classes', price: 2000, currency: 'HKD', duration: '3 Months', popular: true, bestValue: false, image: '/images/2000.png', features: ['Comprehensive Yoga Training', 'Meditation & Breathwork Sessions', 'Progress Tracking', 'Priority Class Booking', 'Valid for 3 Months'] },
  { name: '30 Classes', price: 2500, currency: 'HKD', duration: '4 Months', popular: false, bestValue: true, image: '/images/2500.png', features: ['Complete Wellness Program', 'Unlimited Guidance During Course Period', 'Meditation & Mindfulness Sessions', 'Personalized Practice Recommendations', 'Priority Support', 'Valid for 4 Months'] },
];

export const membershipPlans = [
  { name: 'Silver', price: 2000, currency: 'HKD', period: 'Month', type: 'Silver', popular: false, image: '/images/silver.png', features: ['12 Live Classes Monthly', 'Recorded Sessions', 'Community Access', 'Basic Wellness Guidance'] },
  { name: 'Gold', price: 3000, currency: 'HKD', period: 'Month', type: 'Gold', popular: true, image: '/images/gold.png', features: ['Unlimited Yoga Classes', 'Meditation Programs', 'Nutrition Guidance', 'Monthly Wellness Assessment', 'Priority Support'] },
  { name: 'Platinum', price: 5000, currency: 'HKD', period: 'Month', type: 'Platinum', popular: false, image: '/images/platinum.png', features: ['Unlimited Classes', 'Personal Coaching', 'Customized Wellness Plan', 'Monthly Private Consultation', 'VIP Community Access'] },
  { name: 'Elite Transformation', price: 9000, currency: 'HKD', period: '12 Weeks', type: 'Elite', popular: false, image: '/images/elite.png', features: ['Personal Coaching', 'Yoga Training', 'Meditation Training', 'Nutrition Guidance', 'Lifestyle Assessment', 'Weekly Accountability Sessions', 'Transformation Tracking'] },
];

export const testimonials = [
  { name: 'Sarah M.', location: 'Hong Kong', rating: 5, text: "Sunita's yoga sessions transformed my physical health and reduced my stress levels dramatically." },
  { name: 'David L.', location: 'Singapore', rating: 5, text: "The meditation techniques I learned through Mystic Yoga helped me regain focus and confidence." },
  { name: 'Priya K.', location: 'Dubai', rating: 5, text: "I lost weight, improved my flexibility, and developed a completely new outlook on life." },
  { name: 'Jennifer W.', location: 'London', rating: 5, text: "One of the most professional and transformational yoga programs I have ever experienced." },
  { name: 'Michael C.', location: 'New York', rating: 5, text: "The corporate wellness program revolutionized our team's productivity and wellbeing." },
  { name: 'Aisha R.', location: 'Mumbai', rating: 5, text: "Sunita's holistic approach to wellness has been truly life-changing for me." },
];

export const blogPosts = [
  { title: 'The Science Behind Yoga and Longevity', slug: 'yoga-and-longevity', excerpt: 'Discover how yoga practices influence cellular aging and promote longevity through scientific mechanisms.', category: 'Wellness', image: '/images/hero-main.jpg' },
  { title: '10 Powerful Morning Yoga Rituals', slug: 'morning-yoga-rituals', excerpt: 'Start your day with these transformative yoga sequences designed to energize body and mind.', category: 'Yoga', image: '/images/yoga-personal.jpg' },
  { title: 'Breathwork for Stress Relief', slug: 'breathwork-stress-relief', excerpt: 'Master ancient breathing techniques that instantly calm your nervous system and reduce anxiety.', category: 'Meditation', image: '/images/meditation.jpg' },
  { title: 'Yoga for Busy Professionals', slug: 'yoga-busy-professionals', excerpt: 'Effective 15-minute yoga routines for professionals with demanding schedules.', category: 'Wellness', image: '/images/online-classes.jpg' },
  { title: 'Mindfulness in Everyday Life', slug: 'mindfulness-everyday-life', excerpt: 'Simple mindfulness practices that can be seamlessly integrated into your daily routine.', category: 'Mindfulness', image: '/images/retreats.jpg' },
  { title: 'The Connection Between Yoga and Mental Health', slug: 'yoga-mental-health', excerpt: 'Exploring how regular yoga practice positively impacts mental health and emotional wellbeing.', category: 'Health', image: '/images/women-wellness.jpg' },
];

export const faqs = [
  { question: 'What style of yoga do you teach?', answer: 'We offer a holistic blend of Hatha, Vinyasa, Yin, and Therapeutic yoga, customized to individual needs and goals.', category: 'Classes' },
  { question: 'Do I need prior experience to join?', answer: 'Not at all! Our programs cater to all levels, from absolute beginners to advanced practitioners.', category: 'Classes' },
  { question: 'Are classes available online?', answer: 'Yes, we offer live interactive online classes that you can join from anywhere in the world.', category: 'Classes' },
  { question: 'What should I wear to a yoga class?', answer: 'Wear comfortable, stretchable clothing that allows free movement. No special equipment is required for beginners.', category: 'Classes' },
  { question: 'How do I book a private session?', answer: 'You can book a private session through our contact form or by calling us directly at +852 4464 4381.', category: 'Booking' },
  { question: 'What is the duration of a typical class?', answer: 'Group classes are 60 minutes, while private sessions can be customized from 45 to 90 minutes.', category: 'Classes' },
  { question: 'Do you offer corporate wellness programs?', answer: 'Yes, we provide comprehensive corporate wellness solutions including on-site and virtual programs.', category: 'Corporate' },
  { question: 'What are the membership benefits?', answer: 'Members enjoy unlimited classes, personalized guidance, wellness assessments, and exclusive community access.', category: 'Membership' },
];
