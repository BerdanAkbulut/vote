import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { trpc } from '../../utils/trpc';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
type Props = {};

const QuestionPage = (props: Props) => {
  const { query } = useRouter();
  const { id } = query;
  const [createdAt, setCreatedAt] = useState('');

  //@ts-ignore
  const { data, error } = trpc.useQuery(['questions.getQuestionById', { id }]);

  if (!data) {
    return <div>Loading</div>;
  }
  if (error) {
    return <div>An error happened</div>;
  }

  return (
    <div className="p-28 flex flex-col gap-10">
      {data.owner && (
        <div className="border-4 animate-pulse text-center  text-white text-[40px] tracking-widest font-serif ">
          YOU MADE THİS !
        </div>
      )}
      <div className="p-8 flex justify-between">
        <span className="font-mono text-sm font-bold tracking-wider">
          Created at :
          {` ${data?.question?.createdAt.getDay()}/${data?.question?.createdAt.getMonth()}/${data?.question?.createdAt.getFullYear()} ${data.question.createdAt.getHours()}:${data.question.createdAt.getMinutes()}`}
        </span>
        <button className="p-2 text-xs bg-red-100 rounded-xl hover:scale-95 transition-all duration-500 ease-in-out font-bold tracking-wider">
          Copy Question Link
        </button>
      </div>

      <div className="p-12 w-full  flex flex-col gap-32  border-2 border-dotted border-red-200">
        <div className="flex flex-col gap-10">
          <HelpOutlineIcon
          className='animate-spin-slow'
            style={{ color: 'white', fontSize: 60, alignSelf: 'center' }}
          />
          <h3 className="text-5xl font-bold font-serif tracking-widest text-red-400">
            {data.question.question}
          </h3>
        </div>

        <div className="flex flex-row gap-28">
          {data.question.answer.map((answer, i) => {
            return (
              <span
                className="text-2xl hover:scale-90 transition-all ease-out duration-300 cursor-pointer hover:opacity-90 text-slate-300 hover:text-black tracking-wider hover:font-semibold "
                key={i}
              >
                {++i}) {answer.answer}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
