import * as trpc from '@trpc/server';
import { z } from 'zod';
import { prisma } from '../../../db/client';
import { createRouter } from './context';

export const questionRouter = createRouter()
  .query('getAllQuestions', {
    async resolve() {
      return await prisma.pollQuestion.findMany({
        include: { answer: true },
        orderBy: { createdAt: 'desc' },
      });
    },
  })
  .query('getAllQuestionsByUser', {
    async resolve({ ctx }) {
      return await prisma.pollQuestion.findMany({
        include: { answer: true },
        where: { ownerToken: ctx.token },
        orderBy: { createdAt: 'desc' },
      });
    },
  })
  .query('getQuestionById', {
    input: z.object({ id: z.string().nullish() }),
    async resolve({ input, ctx }) {
      const res = await prisma.pollQuestion.findFirst({
        include: { answer: true },
        where: { id: input?.id },
      });

      return { question: res, owner: res.ownerToken === ctx.token };
    },
  })
  .mutation('create', {
    input: z.object({
      question: z.string(),
      answers: z.any(),
    }),
    async resolve({ input, ctx }) {
      return await prisma.pollQuestion.create({
        data: {
          question: input.question,
          answer: { createMany: { data: input.answers } },
          ownerToken: ctx.token,
        },
      });
    },
  })
  .query('getAnswersByQuestionId', {
    async resolve({ input }) {
      return await prisma.answerTab.findMany({ where: { questionId: input } });
    },
  })
  .query('getAllAnswers', {
    async resolve() {
      return await prisma.answerTab.findMany();
    },
  })
  .mutation('incrementAnswerPick', {
    input: z.string(),
    async resolve({ input }) {
      return await prisma.answerTab.update({
        where: { id: input },
        data: { pick: { increment: 1 } },
      });
    },
  });
