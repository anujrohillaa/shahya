const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with realistic FlatMate data...');

  // Clean existing data
  await prisma.notification.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.savedListing.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.conversation.deleteMany({});
  await prisma.listingPreference.deleteMany({});
  await prisma.listingAmenity.deleteMany({});
  await prisma.listingPhoto.deleteMany({});
  await prisma.listing.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@flatmate.com',
      phone: '+919999999999',
      name: 'FlatMate Admin',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'ADMIN',
      status: 'ACTIVE',
      isPhoneVerified: true,
      isEmailVerified: true,
      isIdVerified: true,
      bio: 'FlatMate Platform Administrator & Trust & Safety Team',
    }
  });

  const rahul = await prisma.user.create({
    data: {
      email: 'rahul.sharma@example.com',
      phone: '+919876543210',
      name: 'Rahul Sharma',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      age: 26,
      gender: 'MALE',
      occupation: 'WORKING_PROFESSIONAL',
      companyCollege: 'Google Gurgaon',
      bio: 'Software Engineer at Google. Clean, easygoing, loves playing badminton on weekends and cooking pasta.',
      isPhoneVerified: true,
      isEmailVerified: true,
      isIdVerified: true,
      smoking: 'NO',
      drinking: 'OCCASIONALLY',
      foodPreference: 'VEG',
      sleepSchedule: 'LATE',
      cleanliness: 'VERY_IMPORTANT',
      pets: 'OKAY_WITH_PETS',
      genderPreference: 'MALE',
    }
  });

  const priya = await prisma.user.create({
    data: {
      email: 'priya.patel@example.com',
      phone: '+919876543211',
      name: 'Priya Patel',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      age: 24,
      gender: 'FEMALE',
      occupation: 'WORKING_PROFESSIONAL',
      companyCollege: 'Swiggy Design Team',
      bio: 'UI/UX Designer. Quiet, respectful of privacy, plant lover, and weekend baker. Looking for female flatmate in Bangalore.',
      isPhoneVerified: true,
      isEmailVerified: true,
      smoking: 'NO',
      drinking: 'NO',
      foodPreference: 'VEG',
      sleepSchedule: 'EARLY',
      cleanliness: 'VERY_IMPORTANT',
      pets: 'HAVE_PETS',
      genderPreference: 'FEMALE',
    }
  });

  const ananya = await prisma.user.create({
    data: {
      email: 'ananya.roy@example.com',
      phone: '+919876543212',
      name: 'Ananya Roy',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      age: 27,
      gender: 'FEMALE',
      occupation: 'WORKING_PROFESSIONAL',
      companyCollege: 'Zomato HQ',
      bio: 'Product Manager. Loves travelling, coffee discussions, and keeping the apartment organized.',
      isPhoneVerified: true,
      isEmailVerified: true,
      isIdVerified: true,
      smoking: 'NO',
      drinking: 'OCCASIONALLY',
      foodPreference: 'BOTH',
      sleepSchedule: 'FLEXIBLE',
      cleanliness: 'VERY_IMPORTANT',
      pets: 'OKAY_WITH_PETS',
      genderPreference: 'ANY',
    }
  });

  const rohan = await prisma.user.create({
    data: {
      email: 'rohan.verma@example.com',
      phone: '+919876543213',
      name: 'Rohan Verma',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      age: 28,
      gender: 'MALE',
      occupation: 'WORKING_PROFESSIONAL',
      companyCollege: 'Flipkart',
      bio: 'Tech Lead. Early riser, fitness enthusiast, loves quiet evenings and board games.',
      isPhoneVerified: true,
      isEmailVerified: true,
      smoking: 'NO',
      drinking: 'OCCASIONALLY',
      foodPreference: 'NON_VEG',
      sleepSchedule: 'EARLY',
      cleanliness: 'NORMAL',
      pets: 'OKAY_WITH_PETS',
      genderPreference: 'MALE',
    }
  });

  const sneha = await prisma.user.create({
    data: {
      email: 'sneha.kapoor@example.com',
      phone: '+919876543214',
      name: 'Sneha Kapoor',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      age: 25,
      gender: 'FEMALE',
      occupation: 'WORKING_PROFESSIONAL',
      companyCollege: 'Fintech Corp Delhi',
      bio: 'Brand Strategist in Saket. Social on weekends, very clean living style.',
      isPhoneVerified: true,
      isEmailVerified: true,
      smoking: 'OCCASIONALLY',
      drinking: 'YES',
      foodPreference: 'BOTH',
      sleepSchedule: 'LATE',
      cleanliness: 'NORMAL',
      pets: 'OKAY_WITH_PETS',
      genderPreference: 'FEMALE',
    }
  });

  const vikram = await prisma.user.create({
    data: {
      email: 'vikram.malhotra@example.com',
      phone: '+919876543215',
      name: 'Vikram Malhotra',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      age: 29,
      gender: 'MALE',
      occupation: 'SELF_EMPLOYED',
      companyCollege: 'AI Consultancy',
      bio: 'Founder & Consultant. Works from home mostly, quiet and respects personal space.',
      isPhoneVerified: true,
      isEmailVerified: true,
      smoking: 'NO',
      drinking: 'NO',
      foodPreference: 'VEG',
      sleepSchedule: 'FLEXIBLE',
      cleanliness: 'VERY_IMPORTANT',
      pets: 'NOT_OKAY',
      genderPreference: 'MALE',
    }
  });

  const tanvi = await prisma.user.create({
    data: {
      email: 'tanvi.deshmukh@example.com',
      phone: '+919876543216',
      name: 'Tanvi Deshmukh',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      age: 23,
      gender: 'FEMALE',
      occupation: 'STUDENT',
      companyCollege: 'Symbiosis Pune',
      bio: 'MBA Student. Studious, peaceful, fond of books and tea.',
      isPhoneVerified: true,
      isEmailVerified: true,
      smoking: 'NO',
      drinking: 'NO',
      foodPreference: 'VEG',
      sleepSchedule: 'EARLY',
      cleanliness: 'VERY_IMPORTANT',
      pets: 'OKAY_WITH_PETS',
      genderPreference: 'FEMALE',
    }
  });

  // 2. Create Listings (Have a Place & Need a Place)

  // Listing 1: Rahul's 3BHK in Gurgaon Sector 43
  const listing1 = await prisma.listing.create({
    data: {
      userId: rahul.id,
      type: 'HAVE_PLACE',
      title: 'Spacious Master Bedroom in Luxury 3BHK Apartment',
      description: 'Private master bedroom with attached washroom and personal balcony in a gated society with 24x7 security, power backup, gym, and swimming pool. Walking distance from Millennium City Centre Metro Station and 5 mins from DLF Cyber Hub. Fully set up kitchen with chimney, microwave, and refrigerator. Looking for a clean, chill flatmate.',
      propertyType: 'APARTMENT',
      roomType: 'PRIVATE_ROOM',
      bedrooms: 3,
      bathrooms: 3,
      currentLiving: 2,
      vacancies: 1,
      rent: 14500,
      securityDeposit: 29000,
      utilityEstimate: 1200,
      brokerage: 0,
      city: 'Gurgaon',
      locality: 'Sector 43',
      landmark: 'Near Millennium City Centre Metro',
      address: 'DLF Phase IV / Sector 43, Gurgaon',
      latitude: 28.4595,
      longitude: 77.0266,
      availableFrom: new Date('2026-09-01'),
      moveInImmediate: false,
      minimumStay: '3_MONTHS',
      preferredGender: 'MALE',
      preferredTenant: 'WORKING_PROFESSIONAL',
      status: 'ACTIVE',
      viewsCount: 248,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      photos: {
        create: [
          { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80', isCover: true, order: 0 },
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80', isCover: false, order: 1 },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80', isCover: false, order: 2 },
          { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80', isCover: false, order: 3 },
        ]
      },
      amenities: {
        create: [
          { name: 'WIFI' },
          { name: 'AC' },
          { name: 'WASHING_MACHINE' },
          { name: 'REFRIGERATOR' },
          { name: 'KITCHEN' },
          { name: 'PARKING' },
          { name: 'GYM' },
          { name: 'POWER_BACKUP' },
          { name: 'GATED_SOCIETY' },
          { name: 'BALCONY' },
        ]
      },
      preferences: {
        create: [
          { tag: 'NON_SMOKER' },
          { tag: 'VEGETARIAN_FRIENDLY' },
          { tag: 'WORKING_PROFESSIONAL' },
          { tag: 'CLEAN_HABITS' },
        ]
      }
    }
  });

  // Listing 2: Priya's 2BHK in Indiranagar, Bangalore
  const listing2 = await prisma.listing.create({
    data: {
      userId: priya.id,
      type: 'HAVE_PLACE',
      title: 'Sunlit Private Room in 2BHK in 100ft Road, Indiranagar',
      description: 'Cozy private room with huge french windows, wardrobe, and double bed in high-demand Indiranagar. Extremely peaceful leafy street yet 2 minutes from Toit and top cafes. High-speed 300 Mbps WiFi, fully functional kitchen, daily maid & cook in place. Female flatmate preferred.',
      propertyType: 'BUILDER_FLOOR',
      roomType: 'PRIVATE_ROOM',
      bedrooms: 2,
      bathrooms: 2,
      currentLiving: 1,
      vacancies: 1,
      rent: 18000,
      securityDeposit: 36000,
      utilityEstimate: 1800,
      brokerage: 0,
      city: 'Bangalore',
      locality: 'Indiranagar',
      landmark: 'Near 100 Feet Road',
      latitude: 12.9784,
      longitude: 77.6408,
      availableFrom: new Date('2026-08-25'),
      moveInImmediate: true,
      minimumStay: '6_MONTHS',
      preferredGender: 'FEMALE',
      preferredTenant: 'WORKING_PROFESSIONAL',
      status: 'ACTIVE',
      viewsCount: 382,
      expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      photos: {
        create: [
          { url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&auto=format&fit=crop&q=80', isCover: true, order: 0 },
          { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80', isCover: false, order: 1 },
          { url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?w=800&auto=format&fit=crop&q=80', isCover: false, order: 2 },
        ]
      },
      amenities: {
        create: [
          { name: 'WIFI' },
          { name: 'AC' },
          { name: 'WASHING_MACHINE' },
          { name: 'REFRIGERATOR' },
          { name: 'KITCHEN' },
          { name: 'BALCONY' },
          { name: 'POWER_BACKUP' },
        ]
      },
      preferences: {
        create: [
          { tag: 'NON_SMOKER' },
          { tag: 'FEMALE_ONLY' },
          { tag: 'PET_FRIENDLY' },
          { tag: 'QUIET_HOURS' },
        ]
      }
    }
  });

  // Listing 3: Ananya's 3BHK in DLF Phase 5, Golf Course Road, Gurgaon
  const listing3 = await prisma.listing.create({
    data: {
      userId: ananya.id,
      type: 'HAVE_PLACE',
      title: 'Premium Room in High-Rise Society on Golf Course Road',
      description: 'Looking for a flatmate in a 3BHK flat in DLF Park Place / Carlton Estate. Includes clubhouse access, swimming pool, tennis court, and covered basement parking. The room has floor-to-ceiling windows with scenic city views.',
      propertyType: 'APARTMENT',
      roomType: 'PRIVATE_ROOM',
      bedrooms: 3,
      bathrooms: 3,
      currentLiving: 2,
      vacancies: 1,
      rent: 19500,
      securityDeposit: 39000,
      utilityEstimate: 2000,
      brokerage: 0,
      city: 'Gurgaon',
      locality: 'Golf Course Road',
      landmark: 'Near Sector 54 Metro',
      latitude: 28.4354,
      longitude: 77.1084,
      availableFrom: new Date('2026-09-05'),
      moveInImmediate: false,
      minimumStay: '3_MONTHS',
      preferredGender: 'ANY',
      preferredTenant: 'WORKING_PROFESSIONAL',
      status: 'ACTIVE',
      viewsCount: 195,
      expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      photos: {
        create: [
          { url: 'https://images.unsplash.com/photo-1502005229762-ae1b460020e2?w=800&auto=format&fit=crop&q=80', isCover: true, order: 0 },
          { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80', isCover: false, order: 1 },
          { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop&q=80', isCover: false, order: 2 },
        ]
      },
      amenities: {
        create: [
          { name: 'WIFI' },
          { name: 'AC' },
          { name: 'WASHING_MACHINE' },
          { name: 'GYM' },
          { name: 'GATED_SOCIETY' },
          { name: 'POWER_BACKUP' },
          { name: 'PARKING' },
        ]
      },
      preferences: {
        create: [
          { tag: 'WORKING_PROFESSIONAL' },
          { tag: 'CLEAN_HABITS' },
        ]
      }
    }
  });

  // Listing 4: Sneha's 2BHK in Saket, South Delhi
  const listing4 = await prisma.listing.create({
    data: {
      userId: sneha.id,
      type: 'HAVE_PLACE',
      title: 'Private Room with Balcony in Saket, South Delhi',
      description: 'Beautiful 2BHK located close to Select Citywalk and Saket Metro. Safe residential area with park facing balcony. Fully furnished with sofa, smart TV, kitchen appliances, and geyser.',
      propertyType: 'BUILDER_FLOOR',
      roomType: 'PRIVATE_ROOM',
      bedrooms: 2,
      bathrooms: 2,
      currentLiving: 1,
      vacancies: 1,
      rent: 16000,
      securityDeposit: 30000,
      utilityEstimate: 1500,
      brokerage: 0,
      city: 'Delhi',
      locality: 'Saket',
      landmark: 'Near Select Citywalk Mall',
      latitude: 28.5244,
      longitude: 77.2167,
      availableFrom: new Date('2026-08-30'),
      moveInImmediate: true,
      minimumStay: 'FLEXIBLE',
      preferredGender: 'FEMALE',
      preferredTenant: 'ANY',
      status: 'ACTIVE',
      viewsCount: 310,
      expiresAt: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000),
      photos: {
        create: [
          { url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop&q=80', isCover: true, order: 0 },
          { url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&auto=format&fit=crop&q=80', isCover: false, order: 1 },
        ]
      },
      amenities: {
        create: [
          { name: 'WIFI' },
          { name: 'AC' },
          { name: 'TV' },
          { name: 'KITCHEN' },
          { name: 'REFRIGERATOR' },
          { name: 'BALCONY' },
        ]
      },
      preferences: {
        create: [
          { tag: 'FEMALE_ONLY' },
          { tag: 'VEG_OR_NONVEG' },
        ]
      }
    }
  });

  // Listing 5: Rohan's 3BHK in HSR Layout, Bangalore
  const listing5 = await prisma.listing.create({
    data: {
      userId: rohan.id,
      type: 'HAVE_PLACE',
      title: 'Master Bedroom in 3BHK Villa, Sector 2 HSR Layout',
      description: 'Independent floor in HSR Sector 2 with dedicated car parking, high-speed fiber internet, and rooftop garden. Looking for a male professional who values cleanliness and peace.',
      propertyType: 'INDEPENDENT_HOUSE',
      roomType: 'PRIVATE_ROOM',
      bedrooms: 3,
      bathrooms: 3,
      currentLiving: 2,
      vacancies: 1,
      rent: 16500,
      securityDeposit: 35000,
      utilityEstimate: 1400,
      brokerage: 0,
      city: 'Bangalore',
      locality: 'HSR Layout',
      landmark: 'Near BDA Complex HSR',
      latitude: 12.9121,
      longitude: 77.6446,
      availableFrom: new Date('2026-09-01'),
      moveInImmediate: false,
      minimumStay: '6_MONTHS',
      preferredGender: 'MALE',
      preferredTenant: 'WORKING_PROFESSIONAL',
      status: 'ACTIVE',
      viewsCount: 220,
      expiresAt: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
      photos: {
        create: [
          { url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80', isCover: true, order: 0 },
          { url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop&q=80', isCover: false, order: 1 },
        ]
      },
      amenities: {
        create: [
          { name: 'WIFI' },
          { name: 'AC' },
          { name: 'WASHING_MACHINE' },
          { name: 'REFRIGERATOR' },
          { name: 'PARKING' },
          { name: 'POWER_BACKUP' },
        ]
      },
      preferences: {
        create: [
          { tag: 'NON_SMOKER' },
          { tag: 'MALE_ONLY' },
          { tag: 'WORKING_PROFESSIONAL' },
        ]
      }
    }
  });

  // Listing 6: Vikram's 2BHK in Noida Sector 62
  const listing6 = await prisma.listing.create({
    data: {
      userId: vikram.id,
      type: 'HAVE_PLACE',
      title: 'Furnished Room in Sector 62 near Stellar IT Park',
      description: 'Private AC room in quiet society with power backup and security. Ideal for engineers working in Sector 62 / Sector 63 IT parks. No brokerage.',
      propertyType: 'APARTMENT',
      roomType: 'PRIVATE_ROOM',
      bedrooms: 2,
      bathrooms: 2,
      currentLiving: 1,
      vacancies: 1,
      rent: 11000,
      securityDeposit: 22000,
      utilityEstimate: 1000,
      brokerage: 0,
      city: 'Noida',
      locality: 'Sector 62',
      landmark: 'Near Fortis Hospital & Stellar Park',
      latitude: 28.6279,
      longitude: 77.3649,
      availableFrom: new Date('2026-08-20'),
      moveInImmediate: true,
      minimumStay: '3_MONTHS',
      preferredGender: 'MALE',
      preferredTenant: 'WORKING_PROFESSIONAL',
      status: 'ACTIVE',
      viewsCount: 165,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      photos: {
        create: [
          { url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80', isCover: true, order: 0 },
        ]
      },
      amenities: {
        create: [
          { name: 'WIFI' },
          { name: 'AC' },
          { name: 'POWER_BACKUP' },
          { name: 'GATED_SOCIETY' },
          { name: 'KITCHEN' },
        ]
      },
      preferences: {
        create: [
          { tag: 'NON_SMOKER' },
          { tag: 'VEGETARIAN' },
        ]
      }
    }
  });

  // Listing 7: Tanvi's "NEED_PLACE" Flatmate Seeker Listing in Pune
  const listing7 = await prisma.listing.create({
    data: {
      userId: tanvi.id,
      type: 'NEED_PLACE',
      title: 'Looking for Private Room or Female Flatmate in Koregaon Park / Viman Nagar',
      description: 'Hi! I am an MBA student at Symbiosis looking for a private room in a 2BHK/3BHK flat or a female flatmate to rent a flat together in KP or Viman Nagar. Non-smoker, vegetarian, studious and clean. Budget is ₹10k - ₹15k/month.',
      rent: 14000,
      minBudget: 10000,
      maxBudget: 15000,
      brokerage: 0,
      city: 'Pune',
      locality: 'Koregaon Park',
      landmark: 'Near North Main Road',
      moveInImmediate: false,
      availableFrom: new Date('2026-09-01'),
      minimumStay: 'FLEXIBLE',
      preferredGender: 'FEMALE',
      preferredTenant: 'ANY',
      status: 'ACTIVE',
      viewsCount: 142,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      photos: {
        create: [
          { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80', isCover: true, order: 0 },
        ]
      },
      amenities: {
        create: [
          { name: 'WIFI' },
          { name: 'WASHING_MACHINE' },
          { name: 'KITCHEN' },
        ]
      },
      preferences: {
        create: [
          { tag: 'FEMALE_ONLY' },
          { tag: 'VEGETARIAN' },
          { tag: 'NON_SMOKER' },
        ]
      }
    }
  });

  // 3. Create Conversations & Messages
  const convo1 = await prisma.conversation.create({
    data: {
      listingId: listing1.id,
      user1Id: rohan.id,
      user2Id: rahul.id,
      lastMessageText: 'Sounds great Rahul! Can I come see the room this Saturday around 11 AM?',
      lastMessageAt: new Date(),
      messages: {
        create: [
          {
            senderId: rohan.id,
            text: 'Hi Rahul, is the master bedroom in Sector 43 still available?',
            isRead: true,
            createdAt: new Date(Date.now() - 3600000 * 4),
          },
          {
            senderId: rahul.id,
            text: 'Hey Rohan! Yes, it is still available. When are you looking to move in?',
            isRead: true,
            createdAt: new Date(Date.now() - 3600000 * 3),
          },
          {
            senderId: rohan.id,
            text: 'Looking to move by 1st September. I work at Flipkart and usually have a quiet schedule.',
            isRead: true,
            createdAt: new Date(Date.now() - 3600000 * 2),
          },
          {
            senderId: rahul.id,
            text: 'That aligns well with our move-in timeline. We are 2 devs living here currently.',
            isRead: true,
            createdAt: new Date(Date.now() - 3600000),
          },
          {
            senderId: rohan.id,
            text: 'Sounds great Rahul! Can I come see the room this Saturday around 11 AM?',
            isRead: false,
            createdAt: new Date(),
          }
        ]
      }
    }
  });

  // 4. Saved Listings
  await prisma.savedListing.create({
    data: {
      userId: rohan.id,
      listingId: listing1.id,
    }
  });

  await prisma.savedListing.create({
    data: {
      userId: rahul.id,
      listingId: listing2.id,
    }
  });

  // 5. Notifications
  await prisma.notification.create({
    data: {
      userId: rahul.id,
      title: 'New Message',
      message: 'Rohan Verma sent you a message regarding "Spacious Master Bedroom in Sector 43".',
      link: `/messages/${convo1.id}`,
      type: 'MESSAGE',
      isRead: false,
    }
  });

  // 6. Moderation Reports (Demo report for Admin Panel)
  await prisma.report.create({
    data: {
      reporterId: vikram.id,
      listingId: listing6.id,
      reason: 'DUPLICATE',
      description: 'I noticed a similar listing posted twice under another profile last week.',
      status: 'NEW',
    }
  });

  console.log('Database seeded successfully! Demo accounts created:');
  console.log('- Admin: admin@flatmate.com (password: password123)');
  console.log('- User: rahul.sharma@example.com (password: password123)');
  console.log('- User: priya.patel@example.com (password: password123)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
