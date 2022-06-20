import * as trpc from '@trpc/server';
import { z } from 'zod';
import { prisma } from '../../../db/client';

export const questionRouter = trpc
  .router()
  .query('getAllQuestions', {
    async resolve() {
      return await prisma.pollQuestion.findMany({
        include: { answer: true },
        orderBy: { createdAt: 'desc' },
      });
    },
  })
  .mutation('create', {
    input: z.object({
      question: z.string(),
      answers: z.any(),
    }),
    async resolve({ input }) {
      return await prisma.pollQuestion.create({
        data: {
          question: input.question,
          answer: { createMany: { data: input.answers } },
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
  })
  .mutation('create-new', {
    input: z.object({ question: z.string().min(5) }),
    async resolve({ input }) {
      return await prisma.pollQuestion.create({
        data: { question: input.question },
      });
    },
  });
