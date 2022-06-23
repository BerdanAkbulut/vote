import Head from 'next/head';
import Image from 'next/image';
import { prisma } from '../../db/client';
import { trpc } from '../utils/trpc';
import type { NextPage } from 'next';
import { useRef, useState } from 'react';
import Modal from '../components/Modal';
import Link from 'next/link';

import LoadingPage from './LoadingPage';
const Home: NextPage = (props: any) => {
  const [modal, openModal] = useState(false);
  const context = trpc.useContext();
  const answerRef = useRef<HTMLSpanElement>(null);
  const { data, isLoading } = trpc.useQuery([
    'questions.getAllQuestionsByUser',
  ]);

  // const increasePick = trpc.useMutation(['questions.incrementAnswerPick'], {
  //   onSuccess: () => {
  //     context.invalidateQueries(['questions.getAllQuestionsByUser']);
  //   },
  // });

  if (isLoading) {
    return <LoadingPage title={`Home | voteX`} />;
  }

  return (
    <>
      <Head>
        <title>Home | voteX</title>
      </Head>
      <div className="p-10 flex flex-col relative z-1">
        <h1 className="text-red-300 text-center font-bold font-serif tracking-widest text-5xl">
          Question Pool
        </h1>
        <code>
          <div className="flex flex-col gap-4 w-1/2 mt-[60px]   ">
            <button
              onClick={() => openModal(true)}
              className=" text-black font-serif font-bold text-2xl p-3 w-[400px] bg-red-300 tracking-widest hover:bg-red-500 transition-all ease-in-out duration-300 rounded-md hover:text-white/70 hover:shadow-2xl "
            >
              Ask A Question
            </button>
            {modal && <Modal open={modal} setModal={openModal} />}
          </div>

          <div className="mt-[60px]">
            {data.map((question: any, i: any) => (
              <Link key={i} href={`/question/${question.id}`}>
                <div
                  className="mt-6 border-2 p-6 rounded-xl border-dashed cursor-pointer hover:opacity-90 hover:border-8 transition-all ease-out duration-500"
                  key={i}
                >
                  <h2 className="font-serif tracking-wider first-letter:capitalize text-red-200 text-3xl">
                    {question.question}
                  </h2>
                  <div className="flex flex-row gap-6 text-slate-200 mt-3 ">
                    {question.answer.map((answer: any, i: any) => (
                      <span
                        className="text-2xl hover:border-2  p-2 rounded-2xl  transition-all ease-in-out duration-500 hover:scale-90 cursor-not-allowed"
                        key={i}
                      >{`${++i}) ${answer.answer}`}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </code>
      </div>
      <div id="portal" className=""></div>
    </>
  );
};

export default Home;
