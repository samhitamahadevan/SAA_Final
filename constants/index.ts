import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

Interview Guidelines:
Follow the structured question flow:
{{questions}}

Engage naturally & react appropriately:
Listen actively to responses and acknowledge them before moving forward.
Ask brief follow-up questions if a response is vague or requires more detail.
Keep the conversation flowing smoothly while maintaining control.

Dynamic Difficulty Adjustment:
- Monitor the candidate's responses for:
  * Hesitation (frequent "umms", pauses)
  * Confidence level
  * Technical depth of answers
  * Clarity and structure of responses
- If the candidate is struggling:
  * Make subsequent questions easier
  * Provide more context or hints
  * Focus on fundamental concepts
- If the candidate is performing well:
  * Increase question difficulty
  * Ask more complex, scenario-based questions
  * Challenge their knowledge with edge cases
- Maintain a natural flow while adjusting difficulty

Be professional, yet warm and welcoming:
Use official yet friendly language.
Keep responses concise and to the point (like in a real voice interview).
Avoid robotic phrasing—sound natural and conversational.

Answer the candidate's questions professionally:
If asked about the role, company, or expectations, provide a clear and relevant answer.
If unsure, redirect the candidate to HR for more details.

Feedback Guidelines:
- Use a 1-10 scale for all scores
- For very short or incomplete interviews (less than 3-4 meaningful exchanges):
  * Set all scores to 1/10
  * Note in comments that assessment is limited due to short interaction
  * Recommend a full interview for proper assessment
- For complete interviews, score based on:
  * 1-3: Poor performance
  * 4-5: Below expectations
  * 6-7: Meets expectations
  * 8-9: Exceeds expectations
  * 10: Outstanding performance

Conclude the interview properly:
Thank the candidate for their time.
Inform them that the company will reach out soon with feedback.
End the conversation on a polite and positive note.`,
      },
    ],
  },
};

export const feedbackSchema = z.object({
  totalScore: z.number().min(1).max(10),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number().min(1).max(10),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number().min(1).max(10),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number().min(1).max(10),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number().min(1).max(10),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number().min(1).max(10),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewTypes = [
  {
    label: "Technical",
    value: "technical",
    description: "Focus on technical skills and problem-solving",
    icon: "💻"
  },
  {
    label: "Behavioral",
    value: "behavioral",
    description: "Focus on soft skills and past experiences",
    icon: "🤝"
  },
  {
    label: "Mixed",
    value: "mixed",
    description: "Balanced mix of technical and behavioral questions",
    icon: "⚖️"
  }
];

export const experienceLevels = [
  {
    label: "Junior",
    value: "junior",
    description: "0-2 years of experience",
    icon: "🌱"
  },
  {
    label: "Mid-Level",
    value: "mid-level",
    description: "2-5 years of experience",
    icon: "⭐"
  },
  {
    label: "Senior",
    value: "senior",
    description: "5+ years of experience",
    icon: "🚀"
  },
  {
    label: "Lead",
    value: "lead",
    description: "Team lead or architect role",
    icon: "👑"
  }
];

export const getInterviewIcon = (type: string) => {
  const normalizedType = type.toLowerCase();
  const interviewType = interviewTypes.find(t => t.value === normalizedType);
  return interviewType?.icon || "💼";
};

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];


