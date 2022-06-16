import Head from 'next/head';
import Image from 'next/image';
import { prisma } from '../../db/client';
import { trpc } from '../utils/trpc';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
const Home: NextPage = (props: any) => {
  const [q1, setQ1] = useState<any>();
  useEffect(() => {
    setQ1(trpc.useQuery(['getAllQuestions']));
  }, []);

  if (!q1.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="font-bold">bed</h1>
      <code>
        {props.questions}
        <p>{q1.data[0].question}</p>
      </code>
    </div>
  );
};

export default Home;
