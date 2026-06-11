import { 
  PrismaClient, 
  EventStatus, 
  BoothStatus, 
  POStatus 
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ==========================================
  // 1. Seed Fandoms
  // ==========================================
  console.log('Seeding Fandoms...');
  const fandomGenshin = await prisma.fandom.upsert({
    where: { name: 'Genshin Impact' },
    update: {},
    create: { name: 'Genshin Impact' },
  });

  const fandomHololive = await prisma.fandom.upsert({
    where: { name: 'Hololive' },
    update: {},
    create: { name: 'Hololive' },
  });

  const fandomBlueArchive = await prisma.fandom.upsert({
    where: { name: 'Blue Archive' },
    update: {},
    create: { name: 'Blue Archive' },
  });

  // ==========================================
  // 2. Seed Events
  // ==========================================
  console.log('Seeding Events...');
  // Using a deterministic ID or unique name would be better, 
  // but since we don't have a unique constraint on event name, 
  // we will find the first one or create it.
  let mainEvent = await prisma.event.findFirst({
    where: { name: 'Comic Frontier 19' }
  });

  if (!mainEvent) {
    mainEvent = await prisma.event.create({
      data: {
        name: 'Comic Frontier 19',
        location: 'ICE BSD',
        city: 'Tangerang',
        country: 'Indonesia',
        startDate: new Date('2026-07-20T00:00:00Z'),
        endDate: new Date('2026-07-21T00:00:00Z'),
        status: EventStatus.UPCOMING,
      },
    });
  }

  // ==========================================
  // 3. Seed Vendors & Merchandise
  // ==========================================
  console.log('Seeding Vendors...');
  
  // Create or Find Vendor: Mochi Arts Studio
  let vendorMochi = await prisma.vendor.findFirst({
    where: { name: 'Mochi Arts Studio' }
  });

  if (!vendorMochi) {
    vendorMochi = await prisma.vendor.create({
      data: {
        name: 'Mochi Arts Studio',
        description: 'Selling cute anime and gaming merchandise!',
        merchandises: {
          create: [
            {
              name: 'Nahida Acrylic Stand',
              salesStatus: 'PO_OTS',
              fandoms: { connect: [{ id: fandomGenshin.id }] },
            },
            {
              name: 'Hoshino Keychain',
              salesStatus: 'OTS_ONLY',
              fandoms: { connect: [{ id: fandomBlueArchive.id }] },
            }
          ],
        },
      },
    });
  }

  // Create or Find Vendor: Starlight Circle
  let vendorStarlight = await prisma.vendor.findFirst({
    where: { name: 'Starlight Circle' }
  });

  if (!vendorStarlight) {
    vendorStarlight = await prisma.vendor.create({
      data: {
        name: 'Starlight Circle',
        description: 'VTuber goods and artbooks.',
        merchandises: {
          create: [
            {
              name: 'Gura Shark Plushie',
              salesStatus: 'PO_ONLY',
              fandoms: { connect: [{ id: fandomHololive.id }] },
            }
          ],
        },
      },
    });
  }

  // ==========================================
  // 4. Seed VendorEvents (Linking Vendors to the Event)
  // ==========================================
  console.log('Linking Vendors to Event...');
  
  await prisma.vendorEvent.upsert({
    where: {
      vendorId_eventId: {
        vendorId: vendorMochi.id,
        eventId: mainEvent.id,
      },
    },
    update: {
      boothNumber: 'A-12',
      boothStatus: BoothStatus.CONFIRMED,
      poAvailable: true,
      poLink: 'https://forms.gle/mochi-po-link',
    },
    create: {
      eventId: mainEvent.id,
      vendorId: vendorMochi.id,
      boothNumber: 'A-12',
      boothStatus: BoothStatus.CONFIRMED,
      poAvailable: true,
      poLink: 'https://forms.gle/mochi-po-link',
    },
  });

  await prisma.vendorEvent.upsert({
    where: {
      vendorId_eventId: {
        vendorId: vendorStarlight.id,
        eventId: mainEvent.id,
      },
    },
    update: {
      boothNumber: 'B-05',
      boothStatus: BoothStatus.CONFIRMED,
      poAvailable: false,
    },
    create: {
      eventId: mainEvent.id,
      vendorId: vendorStarlight.id,
      boothNumber: 'B-05',
      boothStatus: BoothStatus.CONFIRMED,
      poAvailable: false,
    },
  });

  // ==========================================
  // 5. Seed Pre-Order Timelines
  // ==========================================
  console.log('Seeding Pre-Order Timelines...');
  
  // Safely wipe old PreOrders for this specific vendor+event to prevent duplicates, 
  // then recreate the single source of truth.
  await prisma.preOrder.deleteMany({
    where: {
      vendorId: vendorMochi.id,
      eventId: mainEvent.id,
    },
  });

  await prisma.preOrder.create({
    data: {
      vendorId: vendorMochi.id,
      eventId: mainEvent.id,
      startDate: new Date('2026-06-01T00:00:00Z'),
      endDate: new Date('2026-07-15T00:00:00Z'),
      poUrl: 'https://forms.gle/mochi-po-link',
      status: POStatus.ACTIVE,
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });