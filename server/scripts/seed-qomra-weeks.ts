import { PrismaClient } from '@prisma/client';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

// Curated photography URLs from Unsplash for the past Qomra Week editions
const week7Photos = [
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80', titleAr: 'صدى الجبال', titleEn: 'Mountain Echo', photographerAr: 'أحمد العلوي', photographerEn: 'Ahmed Al-Alawi', isWinner: true, winnerPlace: 1 },
  { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80', titleAr: 'ليل النجوم', titleEn: 'Starry Night', photographerAr: 'سارة المعمري', photographerEn: 'Sara Al-Maamari', isWinner: true, winnerPlace: 2 },
  { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80', titleAr: 'ضباب الفجر', titleEn: 'Dawn Mist', photographerAr: 'محمد البلوشي', photographerEn: 'Mohammed Al-Balushi', isWinner: true, winnerPlace: 3 },
  { url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80', titleAr: 'انعكاس البحيرة', titleEn: 'Lake Reflection', photographerAr: 'فاطمة الكندي', photographerEn: 'Fatima Al-Kindi' },
  { url: 'https://images.unsplash.com/photo-1518173946687-a243cf1c8c8e?auto=format&fit=crop&w=1200&q=80', titleAr: 'الطريق الطويل', titleEn: 'The Long Road', photographerAr: 'يوسف الحارثي', photographerEn: 'Yousef Al-Harthi' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80', titleAr: 'بورتريه صامت', titleEn: 'Silent Portrait', photographerAr: 'منى السعدي', photographerEn: 'Mona Al-Saadi' },
  { url: 'https://images.unsplash.com/photo-1520962922320-2038eebab146?auto=format&fit=crop&w=1200&q=80', titleAr: 'لحظة المدينة', titleEn: 'City Moment', photographerAr: 'خالد الحبسي', photographerEn: 'Khaled Al-Habsi' },
  { url: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=1200&q=80', titleAr: 'بستان الأمل', titleEn: 'Garden of Hope', photographerAr: 'ريم البوسعيدي', photographerEn: 'Reem Al-Busaidi' },
  { url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80', titleAr: 'صحراء الذهب', titleEn: 'Golden Desert', photographerAr: 'سالم الزدجالي', photographerEn: 'Salim Al-Zadjali' },
  { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80', titleAr: 'الحياة اليومية', titleEn: 'Daily Life', photographerAr: 'مريم الريامي', photographerEn: 'Mariam Al-Riyami' },
  { url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1200&q=80', titleAr: 'شلال الذكرى', titleEn: 'Memory Falls', photographerAr: 'نواف الوهيبي', photographerEn: 'Nawaf Al-Wahaibi' },
  { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80', titleAr: 'هدوء الصباح', titleEn: 'Morning Calm', photographerAr: 'هدى البطاشي', photographerEn: 'Huda Al-Battashi' },
];

const week8Photos = [
  { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80', titleAr: 'القمم البعيدة', titleEn: 'Distant Peaks', photographerAr: 'أحمد الفارسي', photographerEn: 'Ahmed Al-Farsi', isWinner: true, winnerPlace: 1 },
  { url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80', titleAr: 'وجوه قمرة', titleEn: 'Faces of Qomra', photographerAr: 'لطيفة الشكيلي', photographerEn: 'Latifa Al-Shukaili', isWinner: true, winnerPlace: 2 },
  { url: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80', titleAr: 'تجريد العمارة', titleEn: 'Architecture Abstract', photographerAr: 'بدر الكلباني', photographerEn: 'Badr Al-Kalbani', isWinner: true, winnerPlace: 3 },
  { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', titleAr: 'الطبيعة الصامتة', titleEn: 'Still Nature', photographerAr: 'عائشة المقبالي', photographerEn: 'Aisha Al-Maqbali' },
  { url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80', titleAr: 'بحر الأحلام', titleEn: 'Sea of Dreams', photographerAr: 'حمد الراشدي', photographerEn: 'Hamad Al-Rashdi' },
  { url: 'https://images.unsplash.com/photo-1470770841497-74b4aaeed3d5?auto=format&fit=crop&w=1200&q=80', titleAr: 'صيف عمان', titleEn: 'Omani Summer', photographerAr: 'زينب الهنائي', photographerEn: 'Zainab Al-Hinai' },
  { url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80', titleAr: 'نسيم المساء', titleEn: 'Evening Breeze', photographerAr: 'سعيد العبري', photographerEn: 'Saeed Al-Abri' },
  { url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80', titleAr: 'ضوء النافذة', titleEn: 'Window Light', photographerAr: 'شيخة المسروري', photographerEn: 'Shaikha Al-Masrouri' },
  { url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80', titleAr: 'ظل الشجرة', titleEn: 'Tree Shadow', photographerAr: 'عبدالله الراشدي', photographerEn: 'Abdullah Al-Rashdi' },
  { url: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?auto=format&fit=crop&w=1200&q=80', titleAr: 'خطوط الأفق', titleEn: 'Horizon Lines', photographerAr: 'ميساء البدوي', photographerEn: 'Maysa Al-Badawi' },
  { url: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?auto=format&fit=crop&w=1200&q=80', titleAr: 'ذكريات الطفولة', titleEn: 'Childhood Memories', photographerAr: 'حسام الحوسني', photographerEn: 'Husam Al-Hosani' },
  { url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=1200&q=80', titleAr: 'صورة من الماضي', titleEn: 'Picture from the Past', photographerAr: 'لمياء العامري', photographerEn: 'Lamya Al-Amri' },
];

async function main() {
  console.log('Seeding Qomra Week 7 & 8...\n');

  // Week 7
  const week7 = await prisma.qomraWeekEdition.upsert({
    where: { editionNumber: 7 },
    update: {},
    create: {
      editionNumber: 7,
      year: 2022,
      title: { ar: 'أسبوع قمرة السابع', en: 'Qomra Week 7' },
      theme: { ar: 'الإنسان والمكان', en: 'People & Place' },
      description: {
        ar: 'النسخة السابعة من أسبوع قمرة احتفت بالعلاقة بين الإنسان والمكان، وأظهرت كيف يصنع التصوير قصصاً من اللحظات العابرة.',
        en: 'The seventh edition of Qomra Week celebrated the relationship between people and place, showing how photography crafts stories from fleeting moments.',
      },
      coverImageUrl: week7Photos[0].url,
      totalParticipants: 87,
      totalPhotos: week7Photos.length,
      startDate: new Date('2022-04-15'),
      endDate: new Date('2022-04-22'),
      winners: [
        { place: 1, name: { ar: 'أحمد العلوي', en: 'Ahmed Al-Alawi' }, prize: { ar: 'الجائزة الذهبية', en: 'Gold Prize' } },
        { place: 2, name: { ar: 'سارة المعمري', en: 'Sara Al-Maamari' }, prize: { ar: 'الجائزة الفضية', en: 'Silver Prize' } },
        { place: 3, name: { ar: 'محمد البلوشي', en: 'Mohammed Al-Balushi' }, prize: { ar: 'الجائزة البرونزية', en: 'Bronze Prize' } },
      ],
      judges: [
        { name: { ar: 'د. خالد الزدجالي', en: 'Dr. Khaled Al-Zadjali' }, title: { ar: 'مصور محترف', en: 'Professional Photographer' } },
        { name: { ar: 'فاطمة العامري', en: 'Fatima Al-Amri' }, title: { ar: 'فنانة بصرية', en: 'Visual Artist' } },
      ],
      isCurrent: false,
      isPublished: true,
    },
  });
  console.log(`  ✓ Week 7 edition created (id: ${week7.id})`);

  // Delete existing photos for week 7 and recreate
  await prisma.qomraWeekPhoto.deleteMany({ where: { editionNumber: 7 } });
  for (let i = 0; i < week7Photos.length; i++) {
    const p = week7Photos[i];
    await prisma.qomraWeekPhoto.create({
      data: {
        editionId: week7.id,
        editionNumber: 7,
        title: { ar: p.titleAr, en: p.titleEn },
        photographerName: { ar: p.photographerAr, en: p.photographerEn },
        imageUrl: p.url,
        thumbnailUrl: p.url,
        isWinner: !!p.isWinner,
        winnerPlace: p.winnerPlace || 0,
        sortOrder: i,
        isPublished: true,
      },
    });
  }
  console.log(`  ✓ Week 7: ${week7Photos.length} photos seeded`);

  // Week 8
  const week8 = await prisma.qomraWeekEdition.upsert({
    where: { editionNumber: 8 },
    update: {},
    create: {
      editionNumber: 8,
      year: 2023,
      title: { ar: 'أسبوع قمرة الثامن', en: 'Qomra Week 8' },
      theme: { ar: 'بعدسة قمرة', en: 'Through the Qomra Lens' },
      description: {
        ar: 'الإصدار الثامن استكشف تنوع الرؤى الفنية لأعضاء قمرة، من البورتريه إلى الطبيعة، ومن الشارع إلى التجريد.',
        en: 'The eighth edition explored the diverse artistic visions of Qomra members — from portraits to landscapes, from streets to abstract.',
      },
      coverImageUrl: week8Photos[0].url,
      totalParticipants: 104,
      totalPhotos: week8Photos.length,
      startDate: new Date('2023-04-10'),
      endDate: new Date('2023-04-17'),
      winners: [
        { place: 1, name: { ar: 'أحمد الفارسي', en: 'Ahmed Al-Farsi' }, prize: { ar: 'الجائزة الذهبية', en: 'Gold Prize' } },
        { place: 2, name: { ar: 'لطيفة الشكيلي', en: 'Latifa Al-Shukaili' }, prize: { ar: 'الجائزة الفضية', en: 'Silver Prize' } },
        { place: 3, name: { ar: 'بدر الكلباني', en: 'Badr Al-Kalbani' }, prize: { ar: 'الجائزة البرونزية', en: 'Bronze Prize' } },
      ],
      judges: [
        { name: { ar: 'م. سلطان المنذري', en: 'Eng. Sultan Al-Mundhri' }, title: { ar: 'مصور صحفي', en: 'Photojournalist' } },
        { name: { ar: 'د. منى الراشدي', en: 'Dr. Mona Al-Rashdi' }, title: { ar: 'أستاذة الفنون البصرية', en: 'Visual Arts Professor' } },
        { name: { ar: 'حمد البلوشي', en: 'Hamad Al-Balushi' }, title: { ar: 'مصور قمرة سابق', en: 'Former Qomra Photographer' } },
      ],
      isCurrent: false,
      isPublished: true,
    },
  });
  console.log(`  ✓ Week 8 edition created (id: ${week8.id})`);

  await prisma.qomraWeekPhoto.deleteMany({ where: { editionNumber: 8 } });
  for (let i = 0; i < week8Photos.length; i++) {
    const p = week8Photos[i];
    await prisma.qomraWeekPhoto.create({
      data: {
        editionId: week8.id,
        editionNumber: 8,
        title: { ar: p.titleAr, en: p.titleEn },
        photographerName: { ar: p.photographerAr, en: p.photographerEn },
        imageUrl: p.url,
        thumbnailUrl: p.url,
        isWinner: !!p.isWinner,
        winnerPlace: p.winnerPlace || 0,
        sortOrder: i,
        isPublished: true,
      },
    });
  }
  console.log(`  ✓ Week 8: ${week8Photos.length} photos seeded`);

  console.log('\nDone.');
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
