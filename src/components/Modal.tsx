import React, { useState } from 'react';
import { useRef } from 'react';
import ReactDOM from 'react-dom';
import { trpc } from '../utils/trpc';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { toast } from 'react-toastify';
const QuestionCreator: React.FC = () => {
  const answerDivRef = useRef<HTMLDivElement>();
  const addAnswerInput = () => {
    if (answerDivRef.current.childElementCount > 9) return;
    const input = document.createElement('input');
    input.classList.add('form__field');
    answerDivRef.current.appendChild(input);
  };
  const [error, setError] = useState('');
  const [answerError, setAnswerError] = useState('');

  const [inputQuestion, setInputQuestion] = useState<string>('');
  const client = trpc.useContext();
  const createQuestion = trpc.useMutation(['questions.create'], {
    onSuccess: () => {
      client.invalidateQueries(['questions.getAllQuestionsByUser']);
      setInputQuestion('');
    },
    onError: () => {},
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
        id="standard-basic"
        label=""
        variant="standard"
      />
      {error && <span>{error}</span>}
      <button id="add-answer" onClick={addAnswerInput}>
        Add Answer
      </button>

      <div className="answerDiv" ref={answerDivRef}></div>
      {answerError && <span>{answerError}</span>}

      <button
        style={{}}
        onClick={() => {
          if (inputQuestion.length < 5) {
            setError('Question at least be 5 characters !');
            return;
          }

          const answers: any = [];
          const inputs = answerDivRef.current.getElementsByTagName('input');

          Object.values(inputs).map((input) => {
            if (input.value === '') {
              setAnswerError('Answer cannot be empty ');
              return;
            }
            answers.push({ answer: input.value });
          });

          // @ts-expect-error: Let's ignore a compile error like this unreachable code
          createQuestion.mutate({
            question: inputQuestion,
            answers: answers,
          });
        }}
        id="add-question"
      >
        Add Question
      </button>
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
