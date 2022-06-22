import Head from 'next/head';
import Image from 'next/image';
import { prisma } from '../../db/client';
import { trpc } from '../utils/trpc';
import type { NextPage } from 'next';
import { useRef, useState } from 'react';
import Modal from '../components/Modal';
import Link from 'next/link';

const Home: NextPage = (props: any) => {
  const [modal, openModal] = useState(false);
  const context = trpc.useContext();
  const answerRef = useRef<HTMLSpanElement>(null);
  const { data, isLoading } = trpc.useQuery([
    'questions.getAllQuestionsByUser',
  ]);
  const increasePick = trpc.useMutation(['questions.incrementAnswerPick'], {
    onSuccess: () => {
      context.invalidateQueries(['questions.getAllQuestionsByUser']);
    },
  });

  const voteHandler = (id: any) => {
    const parent2xDiv = answerRef.current.parentElement.parentElement;
    parent2xDiv.hidden = true;
    increasePick.mutate(id);
  };

  if (isLoading) {
    return (
      <div>
        <Head>
          <title>Home | voteX</title>
        </Head>
        <div className="h-screen bg-blue-900/70 flex justify-center items-center ">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Home | voteX</title>
      </Head>
      <div className="bg-blue-900/70  p-10 flex flex-col relative z-1">
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
                  className="mt-6 border-2 p-6 rounded-xl border-dashed"
                  key={i}
                >
                  <h2 className="font-serif tracking-wider first-letter:capitalize text-red-200 text-3xl">
                    {question.question}
                  </h2>
                  <div className="flex flex-row gap-6 text-slate-200 mt-3 ">
                    {question.answer.map((answer: any, i: any) => (
                      <span
                        ref={answerRef}
                        onClick={() => voteHandler(answer.id)}
                        className="text-2xl hover:border-2  border-black p-2 rounded-2xl cursor-pointer transition-all ease-in-out duration-500 hover:scale-90"
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
