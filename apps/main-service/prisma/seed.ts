import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
  // Tạo users
  const users = await Promise.all(
    Array.from({ length: 5 }, async () => {
      const email = faker.internet.email();
      const username = faker.internet.username();
      return prisma.user.create({
        data: {
          email,
          username,
          password: '12345678',
          image: faker.image.avatar(),
          bio: faker.lorem.sentence(),
          demo: true,
        },
      });
    }),
  );

  // Tạo articles
  const articles = await Promise.all(
    Array.from({ length: 20 }, async () => {
      const title = faker.lorem.sentences();
      const author = users[Math.floor(Math.random() * users.length)];
      const articleTags = Array.from({ length: 4 }, () => faker.lorem.slug(2));

      return prisma.article.create({
        data: {
          title,
          description: faker.lorem.paragraph(),
          body: faker.lorem.paragraphs(),
          slug: slugify(title, { lower: true, strict: true }),
          authorId: author.id,
          tagList: {
            connectOrCreate: articleTags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        },
      });
    }),
  );

  // Tạo comments
  await Promise.all(
    Array.from({ length: 50 }, async () => {
      const article = articles[Math.floor(Math.random() * articles.length)];
      const author = users[Math.floor(Math.random() * users.length)];

      return prisma.comment.create({
        data: {
          body: faker.lorem.paragraph(),
          articleId: article.id,
          authorId: author.id,
        },
      });
    }),
  );

  // Tạo favorites
  await Promise.all(
    Array.from({ length: 30 }, async () => {
      const article = articles[Math.floor(Math.random() * articles.length)];
      const user = users[Math.floor(Math.random() * users.length)];

      return prisma.article.update({
        where: { id: article.id },
        data: {
          favoritedBy: {
            connect: { id: user.id },
          },
        },
      });
    }),
  );

  // Tạo follows
  await Promise.all(
    Array.from({ length: 20 }, async () => {
      const follower = users[Math.floor(Math.random() * users.length)];
      const following = users[Math.floor(Math.random() * users.length)];

      if (follower.id !== following.id) {
        return prisma.user.update({
          where: { id: follower.id },
          data: {
            following: {
              connect: { id: following.id },
            },
          },
        });
      }
    }),
  );

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
