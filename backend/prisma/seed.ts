import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.application.deleteMany();

  await prisma.application.createMany({
    data: [
      {
        companyName: 'Google',
        jobTitle: 'Frontend Engineer Intern',
        jobType: 'Internship',
        status: 'Applied',
        appliedDate: new Date('2026-05-10'),
        notes: 'Applied through the careers portal.',
      },
      {
        companyName: 'Khalti',
        jobTitle: 'Backend Developer',
        jobType: 'FullTime',
        status: 'Interviewing',
        appliedDate: new Date('2026-05-18'),
        notes: 'First round done, waiting for the technical interview.',
      },
      {
        companyName: 'Leapfrog Technology',
        jobTitle: 'Software Engineer Trainee',
        jobType: 'Internship',
        status: 'Offer',
        appliedDate: new Date('2026-04-22'),
        notes: null,
      },
      {
        companyName: 'Fusemachines',
        jobTitle: 'Data Analyst (Part Time)',
        jobType: 'PartTime',
        status: 'Rejected',
        appliedDate: new Date('2026-03-30'),
        notes: 'Did not move past the screening call.',
      },
    ],
  });

  console.log('Seed data inserted.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
