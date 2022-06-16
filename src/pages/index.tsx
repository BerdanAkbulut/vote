import Head from 'next/head';
import Image from 'next/image';
import { prisma } from '../../db/client';
import { trpc } from '../utils/trpc';
import type { NextPage } from 'next';
const Home: NextPage = (props:any) => {
  const {data,isLoading} = trpc.useQuery(['getAllQuestions']);
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="font-bold">bed</h1>
      <code>
        {props.questions}
        <p>{data[0]?.question}</p>
      </code>
    </div>
  );
};

export default Home;


