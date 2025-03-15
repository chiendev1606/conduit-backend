import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

export const generateUser = async () => {
  const email = faker.internet.email();
  const username = faker.internet.username();
  return prisma.user.create({
    data: {
      username: username,
      email: email,
      password: '12345678',
      image: 'https://api.realworld.io/images/demo-avatar.png',
      demo: true,
    },
  });
};

export const generateArticle = async (id: number) => {
  const title = faker.lorem.sentence();
  return prisma.article.create({
    data: {
      title: title,
      description: faker.lorem.paragraph(),
      body: faker.lorem.paragraphs(),
      tagList: {
        create: Array.from({ length: 4 }, () => ({ name: faker.lorem.word() })),
      },
      slug: slugify(title),
      authorId: id,
    },
  });
};

export const generateComment = async (id: number, articleId: number) =>
  prisma.comment.create({
    data: {
      body: faker.lorem.paragraph(),
      articleId,
      authorId: id,
    },
  });

export const main = async () => {
  const users = await Promise.all(
    Array.from({ length: 5 }, () => generateUser()),
  );
  users?.map((user) => user);

  // eslint-disable-next-line no-restricted-syntax
  for await (const user of users) {
    const articles = await Promise.all(
      Array.from({ length: 16 }, () => generateArticle(user.id)),
    );

    // eslint-disable-next-line no-restricted-syntax
    for await (const article of articles) {
      await Promise.all(
        users.map((userItem) => generateComment(userItem.id, article.id)),
      );
    }
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.log(err);
    await prisma.$disconnect();
    process.exit(1);
  });
