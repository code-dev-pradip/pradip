export type Project = {
  name: string;
  link: string;
  description: string;
  tech: string[];
  image: string;
};

export const profile = {
  name: 'Pradip Hari Bathwar',
  title: 'Senior Webflow Developer · Product Designer',
  yearsExperience: '5+ years experience',
  location: 'Mumbai, Maharashtra, India',
  email: 'pradipbathwar@gmail.com',
  phone: '+91 9082638708',
  headline:
    'I design thoughtful product experiences and build them into high-performing, animation-rich websites.',
  about:
    'Multidisciplinary UI/UX and product designer with strong Webflow, front-end creative-tech, and interaction design expertise. I work end-to-end from product strategy to polished interface implementation, including custom animation systems, WebGL interactions, and scalable CMS-driven builds.'
};

export const socials = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/pradip-bathwar-21023a242',
    icon: ''
  },
  {
    name: 'Dribbble',
    href: 'https://dribbble.com/pradipbathwar',
    icon: ''
  },
  {
    name: 'GitHub',
    href: 'https://github.com/code-dev-pradip',
    icon: ''
  },
  {
    name: 'Call',
    href: 'tel:+919082638708',
    icon: ''
  }
];

export const skills = [
  'Webflow',
  'UI/UX Design',
  'Product Design',
  'HTML',
  'CSS',
  'JavaScript',
  'GSAP',
  'Three.js',
  'Google Model Viewer',
  'React.js',
  'Finsweet',
  'Wireframing',
  'Prototyping',
  'Design Systems'
];

export const tools = [
  'Figma',
  'VS Code',
  'Notion',
  'Slack',
  'Webflow Designer',
  'React',
  'Next.js'
];

export const projects: Project[] = [
  {
    name: 'GlamAR',
    link: 'https://www.glamar.io/',
    description:
      '3D, AR/VR, and immersive commerce experiences blending storytelling with smooth interaction design.',
    tech: ['Webflow', 'Three.js', 'GSAP', 'JavaScript'],
    image: '/images/webflow/6827671f8d3b2addba8d9283_glamar.avif'
  },
  {
    name: 'Boltic',
    link: 'https://www.boltic.io/',
    description:
      'Product-led website work focused on UX clarity, clean visual structure, and conversion-ready flows.',
    tech: ['UX/UI', 'Webflow', 'HTML', 'CSS', 'JavaScript'],
    image: '/images/webflow/6827671f98652cec19b5c9b8_boltic.avif'
  },
  {
    name: 'Fynix',
    link: 'https://fynix.webflow.io/',
    description:
      'Modern service landing experience with expressive interactions and responsive content structure.',
    tech: ['Webflow', 'JavaScript', 'Motion Design'],
    image: '/images/webflow/6827671ffdf831a2a3ff6d9d_fynix.avif'
  },
  {
    name: 'Pixelbin',
    link: 'https://www.pixelbin.io/',
    description:
      'Developer-focused website implementation supporting SDK/API narratives and technical storytelling.',
    tech: ['Webflow', 'Developer SDK Narrative', 'Webhooks', 'Smart CDN'],
    image: '/images/webflow/6827671f544130f1665158e2_pixelbin.avif'
  },
  {
    name: 'Gauze',
    link: 'https://www.gauze.md/',
    description:
      'Brand-forward digital presence with custom interaction patterns and component consistency.',
    tech: ['Webflow', 'Custom Animation', 'UX/UI Design'],
    image: '/images/webflow/6827671fcbbcb24d31a38428_gauze.avif'
  },
  {
    name: 'Fynd Academy',
    link: 'https://www.fynd.academy/',
    description:
      'Education-focused landing ecosystem with clear content hierarchy and responsive behavior.',
    tech: ['Webflow', 'Learning Platform UX', 'Responsive UI'],
    image: '/images/webflow/6827672174c177166368638b_fyndacademy.avif'
  }
];

export const certifications = [
  '/images/webflow/68235321935a65380f6f5cd9_certificate1.avif',
  '/images/webflow/68235321bfa0f46d31d624e8_certificate2.avif',
  '/images/webflow/68235321ad6094ae2528d3fb_certificate3.avif',
  '/images/webflow/68235321d60518cc257902f7_certificate4.avif'
];

export const experience = [
  {
    role: 'Webflow Developer',
    company: 'Designing',
    period: 'Sep 2024 - Present',
    detail:
      'Own the complete design-to-development workflow for front-end delivery: custom components, animation systems, 3D integration, AR/VR experiences, and production-ready HTML/CSS/JavaScript implementation.'
  }
];

export const education = {
  degree: 'Bachelor of Commerce (B.Com)',
  school: 'University of Mumbai',
  year: '2022'
};
