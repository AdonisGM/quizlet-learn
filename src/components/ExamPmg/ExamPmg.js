import { Fragment, useEffect, useState } from 'react';
import classes from './ExamPmg.module.css';
import flagExam from '../../images/flag-exam.png';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Modal,
  Button,
  Text,
  Tooltip,
  Progress,
  Table,
  Spacer,
} from '@nextui-org/react';
import { TiWarning } from 'react-icons/ti';
import ReactGA from 'react-ga4';

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
  return ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
};

const getRamdom = (id, quantity) => {
  const arrayQuestion = JSON.parse(localStorage.getItem(id)).data.map(
    (item) => {
      item.answer = item.answer.trim().toUpperCase().split(', ');
      item.choose = [];
      return item;
    }
  );
  return arrayQuestion
    .sort(() => Math.random() - 0.5)
    .slice(0, quantity ? quantity : 30);
};

const getSeconds = (id, quantity) => {
  const maxNumberQuestion = JSON.parse(localStorage.getItem(id)).data.length
  
  return maxNumberQuestion < quantity ? maxNumberQuestion * 45 : quantity * 45;
}

const ExamPmg = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [listQuestion, setListQuestion] = useState(
    getRamdom(id, location.state.quantity)
  );
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [countDown, setCountDown] = useState(60);
  const [time, setTime] = useState(getSeconds(id, location.state.quantity));

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const a = setTimeout(() => {
      if (time > 0) {
        setTime(time - 1);
      } else {
        setShowModal(true);
      }
    }, 1000);
    return () => clearTimeout(a);
  }, [time]);

  useEffect(() => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }

    ReactGA.event({
      category: 'Exam',
      action: 'Take a exam' + JSON.parse(localStorage.getItem(id))?.name,
    });

    return () => {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
      }
    };
  }, []);

  useEffect(() => {
    if (countDown === 0) {
      setShowWarning(false);
      return;
    }

    const timer = setTimeout(() => {
      setCountDown(countDown - 1);
      setShowWarning(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countDown]);

  const handleAnswer = (value) => {
    let cloneArray = [...listQuestion[indexQuestion].choose];
    if (cloneArray.includes(value)) {
      cloneArray = cloneArray.filter((item) => item !== value);
    } else {
      cloneArray.push(value);
    }
    // sort array alphabet
    cloneArray.sort();
    listQuestion[indexQuestion].choose = cloneArray;
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

  let munites = Math.floor(time / 60);
  if (munites < 10) {
    munites = '0' + munites;
  }
  let seconds = time % 60;
  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  return (
    <Fragment>
      {showWarning && (
        <div className={classes.popup}>
          <Text p b css={{ color: '#ff5100' }}>
            <TiWarning color="ff5100" />
            Cảnh báo:
          </Text>
          <Spacer y={0.3} />
          <Text p size={12}>
            Đây là một trang web được thiết kế để tập trung vào việc học tập và
            làm quen với giao diện phần mềm EOS của trường <b>"Đại học FPT"</b>.
          </Text>
          <Spacer y={0.3} />
          <Text p size={12}>
            Nếu sử dụng trang web sai mục đích, vi phạm quy định của nhà trường,
            tôi sẽ không chịu trách nhiệm về bất kỳ hành vi nào của bạn.
          </Text>
          <Spacer y={0.3} />
          <Text p size={12}>
            Nếu bạn không đồng ý với điều khoản trên, vui lòng thoát khỏi trang
            web ngay lập tức.
          </Text>
          <Spacer y={0.6} />
          <Text p i size={12}>
            Cảnh báo sẽ tự đóng sau <b>{countDown} giây</b>.
          </Text>
        </div>
      )}
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
                listQuestion.filter(
                  (item) => item.choose.join('') === item.answer.join('')
                ).length
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
                      <div
                        className={`${
                          item.answer.join('') === item.choose.join('')
                            ? classes.correct
                            : classes.incorrect
                        }`}
                      >
                        {item.answer.join('') === item.choose.join('')
                          ? 'Correct'
                          : 'Incorrect'}
                      </div>
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
              (listQuestion.filter(
                (item) => item.choose.join('') === item.answer.join('')
              ).length /
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
            <div>
              {munites}:{seconds}
            </div>
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
                            checked={listQuestion[
                              indexQuestion
                            ].choose.includes(item)}
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
                <div>
                  (Choose {listQuestion[indexQuestion].answer.length} answer)
                </div>
                <br />
                <div>{listQuestion[indexQuestion].question}</div>
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
                  question.choose.length > 0 ? classes.buttonGreen : ''
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

export default ExamPmg;
