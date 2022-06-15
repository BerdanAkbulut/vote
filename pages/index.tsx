import Head from 'next/head';
import Image from 'next/image';
import { prisma } from '../db/client';

import type { NextPage } from 'next';
const Home: NextPage = (props:any) => {
  return (
    <div>
      <h1 className="font-bold">bed</h1>
      <code>
        {props.questions}
      </code>
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const questions = await prisma.question.findMany();

  return {
    props: {
      questions: JSON.stringify(questions),
    },
  };
};
