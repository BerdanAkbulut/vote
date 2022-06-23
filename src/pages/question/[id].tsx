import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { trpc } from '../../utils/trpc';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {};

const QuestionPage = (props: Props) => {
  const { query } = useRouter();
  const { id } = query;
  const [total, setTotal] = useState(0);

  const copyHandler = () => {
    const url = process.env.VERCEL_URL
      ? `${process.env.VERCEL_URL}/question/${id}`
      : `http://localhost:3000/question/${id}`;

    navigator.clipboard.writeText(url);
    toast.info('Copied...');
  };

  const voteHandler = () => {
    console.log('selaa');
  };

  function calculatePercent(pay: number, payda: number) {
  
    let y: number;
    pay = y * payda / 100;
    console.log(y);
   
  }

  const { data, error, isLoading } = trpc.useQuery(
    [
      'questions.getQuestionById',
      // @ts-expect-error: Let's ignore a compile error like this unreachable code
      { id },
    ],
    {
      onSettled(data, error) {
        if (data) {
          data?.question?.answer.map((answer) => {
            console.log(answer.pick);
            setTotal((total) => total + answer.pick);
          });
        }
      },
    }
  );

  if (!data) {
    return <div>Loading</div>;
  }
  if (error) {
    return <div>An error happened</div>;
  }

  return (
    <div className="p-10 flex flex-col gap-10">
      <ToastContainer />

      {data.owner && (
        <div className="border-4 animate-pulse text-center  text-white text-[40px] tracking-widest font-serif ">
          YOU MADE THİS !
        </div>
      )}
      <div className="p-8 flex justify-between">
        <span className="font-mono text-sm font-bold tracking-wider">
          Created at :
          {`${data.question.createdAt.toDateString()}  ${data.question.createdAt.getHours()}:${data.question.createdAt.getMinutes()}`}
        </span>
        <button
          onClick={copyHandler}
          className="p-2 text-xs bg-red-100 rounded-xl hover:scale-95 transition-all duration-500 ease-in-out font-bold tracking-wider"
        >
          Copy Question Link
        </button>
      </div>
      <div className="p-12 w-full  flex flex-col gap-32  border-4 border-dotted border-red-200">
        <div className="flex flex-col gap-10">
          <HelpOutlineIcon
            className="animate-spin-slow"
            style={{ color: 'white', fontSize: 60, alignSelf: 'center' }}
          />
          <h3 className="text-5xl font-bold font-serif tracking-widest text-red-400">
            {data.question.question}
          </h3>
        </div>

        <div className="w-full flex flex-col">
          {!data || isLoading ? (
            'loading'
          ) : (
            <div className="flex flex-col">
              {data.question.answer.map((answer, key) => (
                <div
                  style={{
                    width: `${calculatePercent(answer.pick, total)}%`,
                    backgroundColor: 'white',
                  }}
                  key={key}
                >
                  .
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-row gap-28">
          {data.question.answer.map((answer, i) => {
            return (
              <button
                onClick={voteHandler}
                disabled={data.owner}
                className="text-2xl hover:scale-90 transition-all ease-out duration-300 cursor-pointer hover:opacity-90 text-slate-300 hover:text-black tracking-wider hover:font-semibold disabled:cursor-not-allowed"
                key={i}
              >
                {++i}) {answer.answer}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
