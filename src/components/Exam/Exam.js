import { Fragment, useEffect, useState } from 'react';
import classes from './Exam.module.css';
import flagExam from '../../images/flag-exam.png';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Modal,
  Button,
  Text,
  Tooltip,
  Progress,
  Table,
} from '@nextui-org/react';

const dummyTable = [
  ['Machine', 'DESKTOP-......'],
  ['Server', 'Eng_EOS_14032'],
  ['Duration', '60 minutes'],
  ['Q mark', '1'],
  ['Student', 'Nguyen Van A'],
  ['Exam Code', '- - - - -'],
  ['Open Code', '- - - - -'],
  ['Total Mark', '30'],
];

const generateAnswer = (answer) => {
  return ['A', 'B', 'C', 'D', 'E', 'F'];
};

const getRamdom30 = (id) => {
  const arrayQuestion = JSON.parse(localStorage.getItem(id))
    .data.map((item) => {
      item.answer = item.answer.trim().toUpperCase();
      item.choose = undefined;
      return item;
    })
    .filter((item) => item.answer.length === 1);
  return arrayQuestion.sort(() => Math.random() - 0.5).slice(0, 30);
};

const Exam = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listQuestion, setListQuestion] = useState(getRamdom30(id));
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [enableSubmit, setEnableSubmit] = useState(false);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // const elem = document.documentElement;
    // if (elem.requestFullscreen) {
    //   elem.requestFullscreen();
    // } else if (elem.mozRequestFullScreen) {
    //   /* Firefox */
    //   elem.mozRequestFullScreen();
    // } else if (elem.webkitRequestFullscreen) {
    //   /* Chrome, Safari and Opera */
    //   elem.webkitRequestFullscreen();
    // } else if (elem.msRequestFullscreen) {
    //   /* IE/Edge */
    //   elem.msRequestFullscreen();
    // }
    // return () => {
    //   if (document.exitFullscreen) {
    //     document.exitFullscreen();
    //   } else if (document.webkitExitFullscreen) {
    //     /* Safari */
    //     document.webkitExitFullscreen();
    //   } else if (document.msExitFullscreen) {
    //     /* IE11 */
    //     document.msExitFullscreen();
    //   }
    // };
  }, []);

  const handleAnswer = (e) => {
    if (listQuestion[indexQuestion].choose === e) {
      listQuestion[indexQuestion].choose = undefined;
    } else {
      listQuestion[indexQuestion].choose = e;
    }
    setListQuestion([...listQuestion]);
  };

  const handleNext = () => {
    if (indexQuestion < listQuestion.length - 1) {
      setIndexQuestion(indexQuestion + 1);
    } else {
      setIndexQuestion(0);
    }
  };

  const handleChangeQuestion = (e) => {
    setIndexQuestion(e);
  };

  const handleFinish = () => {
    setShowModal(true);
  };

  const handleCloseModel = () => {
    setTimeout(() => {
      navigate('/course/' + id);
    }, 250);
  };

  return (
    <Fragment>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={showModal}
        width={1200}
        onClose={handleCloseModel}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            <Text b size={18}>
              Result Exam:{' '}
              {
                listQuestion.filter((item) => item.choose === item.answer)
                  .length
              }{' '}
              / {listQuestion.length}
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Table sticked>
              <Table.Header>
                <Table.Column width={'5%'}>No.</Table.Column>
                <Table.Column>Question</Table.Column>
                <Table.Column css={{ textAlign: 'center' }} width={'6%'}>
                  Answer
                </Table.Column>
                <Table.Column css={{ textAlign: 'center' }} width={'8%'}>
                  Your answer
                </Table.Column>
                <Table.Column></Table.Column>
              </Table.Header>
              <Table.Body>
                {listQuestion.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>
                      <span className={classes.questionSpan}>
                        {item.question}
                      </span>
                    </Table.Cell>
                    <Table.Cell css={{ textAlign: 'center' }}>
                      {item.answer}
                    </Table.Cell>
                    <Table.Cell css={{ textAlign: 'center' }}>
                      {item.choose === undefined ? ' - ' : item.choose}
                    </Table.Cell>
                    <Table.Cell>
                      <div className={`${item.answer === item.choose ? classes.correct : classes.incorrect}`}>{item.answer === item.choose ? 'Correct' : 'Incorrect'}</div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
              <Table.Pagination
                shadow
                noMargin
                align="center"
                rowsPerPage={10}
              />
            </Table>
          </div>
          <Progress
            size={'xs'}
            value={
              (listQuestion.filter((item) => item.choose === item.answer)
                .length /
                listQuestion.length) *
              100
            }
            shadow
            color="success"
            status="success"
          />
        </Modal.Body>
      </Modal>
      <div className={classes.main}>
        <div className={classes.header}>
          <div className={classes.headerInformation}>
            <div className={classes.headerFinish}>
              <div>
                <input
                  id="submit"
                  checked={enableSubmit}
                  onChange={() => {
                    setEnableSubmit(!enableSubmit);
                  }}
                  type={'checkbox'}
                />
                <label htmlFor={'submit'}> I want to finish the exam.</label>
              </div>
              <button disabled={!enableSubmit} onClick={handleFinish}>
                Finish
              </button>
            </div>
            <div className={classes.headerTable}>
              <table>
                <tbody>
                  {dummyTable.slice(0, 4).map(([key, value], index) => (
                    <tr key={index}>
                      <td className={classes.headerTableKey}>{key}:</td>
                      <td className={classes.headerTableValue}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table>
                <tbody>
                  {dummyTable.slice(4, 8).map(([key, value], index) => (
                    <tr key={index}>
                      <td className={classes.headerTableKey}>{key}:</td>
                      <td className={classes.headerTableValue}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={classes.headerFontSize}>
              <div>
                <label htmlFor="font-family">Font:</label>
                <input disabled value={'Microsoft Sans Serif'} />
              </div>
              <div className={classes.headerSize}>
                <label htmlFor="font-family">Size:</label>
                <input disabled value={'10'} />
              </div>
            </div>
          </div>
          <div className={classes.headerTimeFlag}>
            <img width={160} src={flagExam} />
            <div>30:00</div>
          </div>
        </div>
        <div className={classes.tempBody}>
          <div className={classes.body}>
            <div className={classes.bodyAnswer}>
              <div className={classes.bodyAnswerTitle}>
                <strong>Answer</strong>
              </div>
              <table className={classes.bodyAnswerTable}>
                <tbody>
                  {generateAnswer(listQuestion[indexQuestion].answer).map(
                    (item, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            className={classes.bodyAnswerCheckbox}
                            type={'checkbox'}
                            id={'ans-' + index}
                            onChange={(e) => {
                              handleAnswer(item);
                            }}
                            checked={
                              item === listQuestion[indexQuestion].choose
                            }
                          />
                        </td>
                        <td>
                          <label
                            className={classes.bodyAnswerLabel}
                            htmlFor={'ans-' + index}
                          >
                            {item}
                          </label>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
              <div className={classes.bodyAnswerbuttonNext}>
                <button onClick={handleNext}>Next</button>
              </div>
            </div>
            <div className={classes.bodyQuestion}>
              <div className={classes.bodyQuestionNumber}>
                <strong>
                  Multiple choices {indexQuestion + 1}/{listQuestion.length}
                </strong>
              </div>
              <div className={classes.bodyQuestionContent}>
                {listQuestion[indexQuestion].question}
              </div>
            </div>
          </div>
        </div>
        <div className={classes.footer}>
          <div className={classes.footerButtons}>
            {listQuestion.map((question, index) => (
              <button
                onClick={() => {
                  handleChangeQuestion(index);
                }}
                className={`${
                  question.choose !== undefined ? classes.buttonGreen : ''
                }`}
                key={index}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className={classes.footerExit}>
            <div className={classes.footerFinish}>
              <div>
                <input
                  id="submit-footer"
                  checked={enableSubmit}
                  onChange={() => {
                    setEnableSubmit(!enableSubmit);
                  }}
                  type={'checkbox'}
                />
                <label htmlFor={'submit-footer'}>
                  {' '}
                  I want to finish the exam.
                </label>
              </div>
              <button disabled={!enableSubmit} onClick={handleFinish}>
                Finish
              </button>
            </div>
            <div>
              <button
                onClick={() => {
                  navigate('/course/' + id);
                }}
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Exam;
