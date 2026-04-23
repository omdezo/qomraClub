import { PrismaClient } from '@prisma/client';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

const TITLES = [
  {
    slug: 'member',
    tier: 1,
    sortOrder: 0,
    name: { ar: 'عضو قمرة', en: 'Qomra Member' },
    description: {
      ar: 'الخطوة الأولى في رحلة قمرة — عضو نشط في الجماعة يبدأ مسيرته في عالم التصوير.',
      en: 'The first step in the Qomra journey — an active member beginning their photography path.',
    },
    requirements: [
      { ar: 'التسجيل الرسمي في الجماعة', en: 'Official registration in the club' },
      { ar: 'حضور فعاليتين على الأقل', en: 'Attend at least two events' },
      { ar: 'المشاركة في ورشة تعريفية', en: 'Participate in an introductory workshop' },
    ],
    color: '#a0a0a0',
  },
  {
    slug: 'photographer',
    tier: 2,
    sortOrder: 1,
    name: { ar: 'مصور قمرة', en: 'Qomra Photographer' },
    description: {
      ar: 'عضو أثبت شغفه بالتصوير من خلال أعمال متميزة ومشاركة فعالة.',
      en: 'A member who has proven their passion for photography through distinguished work and active participation.',
    },
    requirements: [
      { ar: 'عرض 10 أعمال فوتوغرافية في معرض الجماعة', en: 'Exhibit 10 photographic works in the club gallery' },
      { ar: 'إتمام ورشتين متقدمتين', en: 'Complete two advanced workshops' },
      { ar: 'المشاركة في رحلة تصويرية', en: 'Participate in a photography trip' },
    ],
    color: '#c9a476',
  },
  {
    slug: 'designer',
    tier: 3,
    sortOrder: 2,
    name: { ar: 'مصمم قمرة', en: 'Qomra Designer' },
    description: {
      ar: 'مبدع يجمع بين التصوير والتصميم البصري لصنع محتوى متكامل وهوية فنية.',
      en: 'A creator who combines photography with visual design to craft integrated content and artistic identity.',
    },
    requirements: [
      { ar: 'تقديم 5 مشاريع تصميم متكاملة', en: 'Submit 5 complete design projects' },
      { ar: 'المساهمة في تصميم مواد الجماعة', en: 'Contribute to designing club materials' },
      { ar: 'قيادة ورشة تصميم للأعضاء الجدد', en: 'Lead a design workshop for new members' },
    ],
    color: '#d4a574',
  },
  {
    slug: 'artist',
    tier: 4,
    sortOrder: 3,
    name: { ar: 'فنان قمرة', en: 'Qomra Artist' },
    description: {
      ar: 'فنان تميز بأسلوبه الخاص وبصمته الواضحة في مشهد التصوير الفني.',
      en: 'An artist distinguished by their unique style and clear signature in the fine art photography scene.',
    },
    requirements: [
      { ar: 'إقامة معرض شخصي', en: 'Host a solo exhibition' },
      { ar: 'نشر سلسلة فنية كاملة من 20 عمل', en: 'Publish a complete artistic series of 20 works' },
      { ar: 'الاعتراف بأسلوبه الفني من قبل لجنة التحكيم', en: 'Artistic style recognized by the judging committee' },
    ],
    color: '#e8c49a',
  },
  {
    slug: 'excellence',
    tier: 5,
    sortOrder: 4,
    name: { ar: 'مجيد قمرة', en: 'Qomra Excellence' },
    description: {
      ar: 'عضو حقق الإجادة في مجاله وأصبح مرجعاً في الجماعة.',
      en: 'A member who has achieved excellence in their field and become a reference within the club.',
    },
    requirements: [
      { ar: 'الفوز بجائزة في مسابقة أسبوع قمرة', en: 'Win an award in the Qomra Week competition' },
      { ar: 'تدريس ورشتين متقدمتين', en: 'Teach two advanced workshops' },
      { ar: 'تمثيل الجماعة في فعالية خارجية', en: 'Represent the club in an external event' },
    ],
    color: '#f0c987',
  },
  {
    slug: 'pride',
    tier: 6,
    sortOrder: 5,
    name: { ar: 'فخر قمرة', en: 'Qomra Pride' },
    description: {
      ar: 'أعلى مراتب قمرة — عضو حقق إنجازات استثنائية يفخر بها النادي والجامعة.',
      en: 'The highest Qomra rank — a member who has achieved exceptional accomplishments that the club and university take pride in.',
    },
    requirements: [
      { ar: 'إنجاز إقليمي أو دولي في التصوير', en: 'Regional or international achievement in photography' },
      { ar: 'خدمة مستمرة للجماعة لأكثر من عامين', en: 'Continuous service to the club for more than two years' },
      { ar: 'إسهام محوري في تطوير قمرة', en: 'Pivotal contribution to Qomra\'s development' },
    ],
    color: '#ffd700',
  },
];

async function main() {
  console.log('Seeding titles...');
  const count = await prisma.title.count();
  if (count > 0) {
    console.log(`  Titles already exist (${count}), skipping.`);
    await prisma.$disconnect();
    return;
  }
  for (const t of TITLES) {
    await prisma.title.create({ data: t });
  }
  console.log(`  ✓ Seeded ${TITLES.length} titles`);
  await prisma.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
