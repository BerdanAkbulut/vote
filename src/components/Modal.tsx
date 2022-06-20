import React, { useState } from 'react';
import { useRef } from 'react';
import ReactDOM from 'react-dom';
import { trpc } from '../utils/trpc';
import TextField, { TextFieldProps } from '@mui/material/TextField';
const QuestionCreator: React.FC = () => {
  const answerDivRef = useRef<HTMLDivElement>();
  const addAnswerInput = () => {
    if (answerDivRef.current.childElementCount > 9) return;
    const input = document.createElement('input');
    input.classList.add('inputStyle');
    answerDivRef.current.appendChild(input);
  };
  const [error, setError] = useState('');
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const client = trpc.useContext();
  const createQuestion = trpc.useMutation(['questions.create'], {
    onSuccess: () => {
      client.invalidateQueries(['questions.getAllQuestions']);
      if (inputQuestion === '') return;
      setInputQuestion('');
    },
    onError: () => {
      setError('Question at least be 5 characters !');
    },
  });

  return (
    <div className="centeredForm">
      <h2>Write Your Question</h2>

      <TextField
        style={{ width: 400 }}
        InputLabelProps={{ size: 'small' }}
        value={inputQuestion}
        onChange={(event) => setInputQuestion(event.target.value)}
        disabled={createQuestion.isLoading}
        onKeyDown={async (event) => {
          if (event.key === 'Enter') {
            const answers: any = [];
            const inputs = answerDivRef.current.getElementsByTagName('input');

            Object.values(inputs).map((input) => {
              answers.push({ answer: input.value });
            });
            const name = 'asdasddsa';

            // @ts-expect-error: Let's ignore a compile error like this unreachable code
            createQuestion.mutate({
              question: inputQuestion,
              answers: answers,
            });
          }
        }}
        id="standard-basic"
        label=""
        variant="standard"
      />
      {error && <span>{error}</span>}
      <button onClick={addAnswerInput}>Add Answer</button>
      <div className="answerDiv" ref={answerDivRef}></div>
    </div>
  );
};

const Modal = (props: any) => {
  return ReactDOM.createPortal(
    <>
      <div className="chngPortal">
        <div className="centeredPortal">
          <span
            onClick={() => props.setModal(false)}
            style={{ position: 'absolute', right: 10, top: 2, fontSize: 30 }}
          >
            X
          </span>
          <QuestionCreator />
        </div>
      </div>
    </>,
    document.getElementById('portal')
  );
};

export default Modal;
