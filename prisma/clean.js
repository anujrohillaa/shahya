const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Purging mock test data from database...');

  // Delete all mock listings, photos, amenities, messages, conversations, reports, notifications
  await prisma.notification.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.blockedUser.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.conversation.deleteMany({});
  await prisma.savedListing.deleteMany({});
  await prisma.listingPreference.deleteMany({});
  await prisma.listingAmenity.deleteMany({});
  await prisma.listingPhoto.deleteMany({});
  await prisma.listing.deleteMany({});
  
  // Keep admin user or delete all demo users
  await prisma.user.deleteMany({});

  console.log('✅ Database is completely clean and ready for real production users and listings!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
