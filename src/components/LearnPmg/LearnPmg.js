import {
  Button,
  Card,
  Grid,
  Modal,
  Spacer,
  Text,
  Progress,
  Checkbox,
  Divider,
} from '@nextui-org/react';
import { Fragment, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from 'react-icons/md';
import classes from './LearnPmg.module.css';
import ReactGA from 'react-ga4';

const dummyAnswer = ['A', 'B', 'C', 'D'];

const styleCardCorrect = {
  cursor: 'pointer',
  borderColor: '#23b26d',
  backgroundColor: '#f2fbf6',
};

const styleCardIncorrect = {
  cursor: 'pointer',
  borderColor: '#ff9c8c',
  backgroundColor: '#fbf2f2',
};

const extractQuestion = (text) => {
  const result = text
    .split('\n')
    .filter((item) => {
      return !item.match(/^[AaBbCcDdEeFfGgHh]\. /g);
    })
    .join('\n');
  return result;
};

const extractAnswer = (text) => {
  const result = text
    .split('\n')
    .filter((item) => {
      return item.slice(0, 5).match(/^[AaBbCcDdEeFfGgHh]\. /g);
    })
    .map((item) => {
      let a;
      if (item.slice(0, 5).match(/^[Aa]{1}\. /g)) a = 'A';
      if (item.slice(0, 5).match(/^[Bb]{1}\. /g)) a = 'B';
      if (item.slice(0, 5).match(/^[Cc]{1}\. /g)) a = 'C';
      if (item.slice(0, 5).match(/^[Dd]{1}\. /g)) a = 'D';
      if (item.slice(0, 5).match(/^[Ee]{1}\. /g)) a = 'E';
      if (item.slice(0, 5).match(/^[Ff]{1}\. /g)) a = 'F';
      if (item.slice(0, 5).match(/^[Gg]{1}\. /g)) a = 'G';
      if (item.slice(0, 5).match(/^[Hh]{1}\. /g)) a = 'H';
      return {
        key: a,
        value: item,
      };
    });
  return result;
};

const getSevenFromList = (list) => {
  const length = list.length < 7 ? list.length : 7;
  const result = [];
  for (let i = 0; i < length; i++) {
    const random = Math.floor(Math.random() * list.length);
    list[random].count = 0;
    result.push(list[random]);
    list.splice(random, 1);
  }
  return result;
};

const Learn = () => {
  // init react-router-dom
  const { id } = useParams();
  const navigate = useNavigate();

  // init state
  const [listAllQuestion, setListAllQuestion] = useState(
    JSON.parse(localStorage.getItem(id)).data
  );
  const [listLearning, setListLearning] = useState([]);
  const [cloneListLearning, setCloneListLearning] = useState([]);
  const [indexSelectQuestion, setIndexSelectQuestion] = useState(0);
  const [listAnswer, setListAnswer] = useState([]);
  const [selectAnswer, setSelectAnswer] = useState(undefined);
  const [isNotCorrect, setIsNotCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [numberLearning, setNumberLearning] = useState(0);
  const [listChoise, setListChoise] = useState([]);
  const [isAnswerChoise, setIsAnswerChoise] = useState(false);
  
  const [totalAnswer, setTotalAnswer] = useState(0);

  // get 7 question random from list in first time
  useEffect(() => {
    const listSeven = getSevenFromList(
      listAllQuestion.filter((item) => {
        return item.learned === false;
      })
    );
    if (listSeven.length === 0) {
      navigate('/course/' + id);
    }
    setTotalAnswer(
      listAllQuestion.filter((item) => item.learned === true).length
    );
    setListLearning(listSeven);
    setCloneListLearning(listSeven);
    setIndexSelectQuestion(0);
    ReactGA.event({
      category: 'Learn',
      action:
        'Learn question in set ' + JSON.parse(localStorage.getItem(id))?.name,
    });
  }, []);

  // load question and answer to card on indexSelectQuestion change
  useEffect(() => {
    setSelectAnswer(undefined);
    setIsAnswerChoise(false);
    setListChoise([]);
    setIsNotCorrect(false);
    if (listLearning.length > 0) {
      setListAnswer(generateAnswer(listLearning[indexSelectQuestion].answer));
    }
  }, [indexSelectQuestion, listLearning]);

  useEffect(() => {
    if (cloneListLearning.length > 0) {
      const countLearn = cloneListLearning.filter((item) => {
        return item.count === 2;
      }).length;
      const totalL = cloneListLearning.length;

      setNumberLearning((countLearn * 100) / totalL);
    }
  }, [selectAnswer, indexSelectQuestion, listLearning, showResult]);

  // function and handler
  const generateAnswer = (answer) => {
    if (answer.trim().length === 1) {
      const ran = [...dummyAnswer].sort(() => Math.random() - 0.5);
      const l = [answer.toUpperCase(), ...ran];

      const result = l.filter((item, index) => {
        return l.indexOf(item) === index;
      });

      // shuffle
      const shuffled = result.slice(0, 4).sort(() => Math.random() - 0.5);
      return shuffled;
    } else {
      const listAns = listAllQuestion.map((item) =>
        item.answer.toUpperCase().trim()
      );
      const a = listAns
        .filter((item, index) => {
          return listAns.indexOf(item) === index;
        })
        .sort(() => Math.random() - 0.5);

      const b = [answer.toUpperCase(), ...a];
      const result = b.filter((item, index) => {
        return b.indexOf(item) === index;
      });

      const shuffled = result.slice(0, 4).sort(() => Math.random() - 0.5);
      return shuffled;
    }
  };

  const updateListLocalStorage = () => {
    listAllQuestion.forEach((element) => {
      if (element.count === 2) {
        element.learned = true;
      }
      delete element.count;
    });
    const temp = JSON.parse(localStorage.getItem(id));
    temp.data = listAllQuestion;
    localStorage.setItem(id, JSON.stringify(temp));
    setShowResult(true);
    setTotalAnswer(
      JSON.parse(localStorage.getItem(id)).data.filter(
        (item) => item.learned === true
      ).length
    );
  };

  const handleCardAnswerPress = (key) => {
    setSelectAnswer(key);

    if (
      key.toUpperCase() ===
      listLearning[indexSelectQuestion].answer.toUpperCase()
    ) {
      listLearning[indexSelectQuestion].count =
        listLearning[indexSelectQuestion].count + 1;
      listLearning[indexSelectQuestion].lastIncorrect = undefined;

      setTimeout(() => {
        listLearning[indexSelectQuestion].lastIncorrectClone =
          listLearning[indexSelectQuestion].lastIncorrect;
        if (indexSelectQuestion !== listLearning.length - 1) {
          setIndexSelectQuestion(indexSelectQuestion + 1);
        } else {
          repeatListLearning();
        }
      }, 750);
    } else {
      listLearning[indexSelectQuestion].lastIncorrect = true;
      setIsNotCorrect(true);
    }
  };

  const handleNextButtonPress = () => {
    listLearning[indexSelectQuestion].lastIncorrectClone =
      listLearning[indexSelectQuestion].lastIncorrect;
    if (indexSelectQuestion !== listLearning.length - 1) {
      setIndexSelectQuestion(indexSelectQuestion + 1);
    } else {
      repeatListLearning();
    }
  };

  const repeatListLearning = () => {
    const t = listLearning.filter((item) => {
      return item.count <= 1;
    });
    if (t.length === 0) {
      updateListLocalStorage();
    } else {
      setListLearning(t);
      setIndexSelectQuestion(0);
    }
  };

  const handleCloseModal = () => {
    setShowResult(false);
    const listSeven = getSevenFromList(
      listAllQuestion.filter((item) => {
        return item.learned === false;
      })
    );
    if (listSeven.length === 0) {
      navigate('/course/' + id);
    }
    setListLearning(listSeven);
    setCloneListLearning(listSeven);
    setIndexSelectQuestion(0);
  };

  const handleChoiseAnswer = (key) => {
    // sort increase string
    key.sort((a, b) => {
      return a.toUpperCase().localeCompare(b.toUpperCase());
    });
    setListChoise(key);
  };

  const handleCheckAnswerChoise = () => {
    if (isAnswerChoise) {
      return;
    }

    setIsAnswerChoise(true);
    const a = listLearning[indexSelectQuestion].answer.split(', ');
    if (a.length !== listChoise.length) {
      listLearning[indexSelectQuestion].lastIncorrect = true;
      setIsNotCorrect(true);
      return;
    }

    const b = a.filter((item) => {
      return listChoise.includes(item.toUpperCase());
    }).length;
    if (b === a.length) {
      listLearning[indexSelectQuestion].count =
        listLearning[indexSelectQuestion].count + 1;
      listLearning[indexSelectQuestion].lastIncorrect = undefined;

      setTimeout(() => {
        listLearning[indexSelectQuestion].lastIncorrectClone =
          listLearning[indexSelectQuestion].lastIncorrect;
        if (indexSelectQuestion !== listLearning.length - 1) {
          setIndexSelectQuestion(indexSelectQuestion + 1);
        } else {
          repeatListLearning();
        }
      }, 750);
    } else {
      listLearning[indexSelectQuestion].lastIncorrect = true;
      setIsNotCorrect(true);
    }
  };

  const progress = ((totalAnswer / listAllQuestion.length) * 100).toFixed(2);

  return (
    <div className={classes.main}>
      <div className={classes.progress}>
        <Card>
          <Card.Body>
            <Text
              p
              b
              size={12}
              css={{
                width: '100%',
                textAlign: 'center',
              }}
            >
              Analyzing your progress
            </Text>
            <Spacer y={1} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Text p b size={12}>
                Total: {totalAnswer}/{listAllQuestion.length}
              </Text>
              <Text p b size={12}>
                {progress} %
              </Text>
            </div>
            <Progress
              squared="true"
              size="xs"
              value={progress}
              shadow
              color={
                progress >= 90 ? 'success' : progress > 0 ? 'warning' : 'error'
              }
              status="primary"
            />
          </Card.Body>
        </Card>
      </div>
      <Progress
        css={{
          position: 'fixed',
          top: 0,
          left: 0,
        }}
        squared="true"
        size="sm"
        value={numberLearning}
        shadow
        color="gradient"
        status="primary"
      />
      <Fragment>
        <Modal
          onClose={handleCloseModal}
          closeButton
          open={showResult}
          scroll
          width="900px"
        >
          <Modal.Header>
            <Text id="modal-title" size={18}>
              Result your learning
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Grid.Container gap={2}>
              {cloneListLearning.length > 0 &&
                cloneListLearning.map((item, index) => (
                  <Grid key={index} xs={12}>
                    <Card variant={'bordered'} borderWeight={'normal'}>
                      <Card.Body>
                        <Text size={14} css={{ whiteSpace: 'pre-wrap' }}>
                          {item.question}
                        </Text>
                        <Spacer />
                        <Text size={14}>
                          <strong>Answer: {item.answer}</strong>
                        </Text>
                      </Card.Body>
                    </Card>
                  </Grid>
                ))}
            </Grid.Container>
          </Modal.Body>
        </Modal>
        <Grid.Container>
          <Grid xs={2}>
            <Button
              color={'error'}
              flat
              icon={<MdKeyboardBackspace />}
              auto
              size={'sm'}
              onPress={() => {
                navigate('/course/' + id);
              }}
            >
              Quit learn
            </Button>
          </Grid>
          <Grid xs={8}>
            <Text css={{ textAlign: 'center', width: '100%' }} h1 size={18}>
              Learn: {JSON.parse(localStorage.getItem(id)).name}
            </Text>
          </Grid>
        </Grid.Container>
        <Spacer y={2} />
        <Card>
          <Card.Body>
            <div className={classes.headerQuestionNumber}>
              <Text size={20}>
                <strong>Question {indexSelectQuestion + 1}:</strong>{' '}
              </Text>
              {listLearning[indexSelectQuestion] !== undefined &&
                listLearning[indexSelectQuestion].lastIncorrectClone !==
                  undefined && (
                  <Text
                    size={20}
                    css={{
                      backgroundColor: 'rgb(255, 219, 205)',
                      fontSize: 12,
                      padding: '2px 10px',
                      fontWeight: 700,
                      borderRadius: 50,
                    }}
                  >
                    Let's try again
                  </Text>
                )}
            </div>
            <Text
              size={20}
              css={{
                whiteSpace: 'pre-line',
                padding: 20,
              }}
            >
              {listLearning[indexSelectQuestion] &&
                listLearning[indexSelectQuestion].answer.split(', ').length ===
                  1 &&
                listLearning[indexSelectQuestion].question}
              {listLearning[indexSelectQuestion] &&
                listLearning[indexSelectQuestion].answer.split(', ').length !==
                  1 &&
                extractQuestion(listLearning[indexSelectQuestion].question)}
            </Text>
            {listLearning[indexSelectQuestion] &&
              listLearning[indexSelectQuestion].answer.split(', ').length ===
                1 && <Spacer y={2} />}

            <div className={classes.nextButton}>
              <Text
                size={16}
                css={{
                  whiteSpace: 'pre-line',
                  fontWeight: '500',
                }}
              >
                Choose answer:
              </Text>

              {isNotCorrect && (
                <Button
                  onPress={handleNextButtonPress}
                  size={'sm'}
                  color={'warning'}
                >
                  Continue
                </Button>
              )}
            </div>
            {listLearning[indexSelectQuestion] &&
              listLearning[indexSelectQuestion].answer.split(', ').length ===
                1 && (
                <Grid.Container gap={2}>
                  {listLearning[indexSelectQuestion] &&
                    listAnswer.map((item, index) => (
                      <Grid xs={6} key={index}>
                        <Card
                          isPressable={selectAnswer === undefined}
                          variant={'bordered'}
                          borderWeight={'normal'}
                          css={
                            selectAnswer === undefined
                              ? { cursor: 'pointer' }
                              : selectAnswer.toUpperCase() ===
                                  item.toUpperCase() &&
                                selectAnswer.toUpperCase() ===
                                  listLearning[
                                    indexSelectQuestion
                                  ].answer.toUpperCase()
                              ? styleCardCorrect
                              : selectAnswer.toUpperCase() ===
                                  item.toUpperCase() &&
                                selectAnswer.toUpperCase() !==
                                  listLearning[
                                    indexSelectQuestion
                                  ].answer.toUpperCase()
                              ? styleCardIncorrect
                              : item.toUpperCase() ===
                                listLearning[
                                  indexSelectQuestion
                                ].answer.toUpperCase()
                              ? styleCardCorrect
                              : { cursor: 'pointer' }
                          }
                          onPress={() => handleCardAnswerPress(item)}
                        >
                          <Card.Body>
                            <div className={classes.ans}>
                              <Text className={classes.keyAns}>
                                {index + 1}
                              </Text>
                              <Text>{item}</Text>
                            </div>
                          </Card.Body>
                        </Card>
                      </Grid>
                    ))}
                </Grid.Container>
              )}
            {listLearning[indexSelectQuestion] &&
              listLearning[indexSelectQuestion].answer.split(', ').length !==
                1 && (
                <Grid.Container gap={2}>
                  <Grid xs={12}>
                    <Card
                      variant={'bordered'}
                      borderWeight={'normal'}
                      css={
                        isAnswerChoise === false
                          ? { padding: '0px 20px' }
                          : isNotCorrect === true
                          ? { padding: '0px 20px', ...styleCardIncorrect }
                          : { padding: '0px 20px', ...styleCardCorrect }
                      }
                    >
                      <Card.Body>
                        <Checkbox.Group
                          label={`Multiple choice:`}
                          value={listChoise}
                          onChange={handleChoiseAnswer}
                        >
                          {extractAnswer(
                            listLearning[indexSelectQuestion].question
                          ).map((item, index) => (
                            <Fragment key={index}>
                              <Checkbox
                                value={item.key}
                                css={{ padding: '6px 0' }}
                                onSelect
                              >
                                <Text size={16}>{item.value}</Text>
                              </Checkbox>
                            </Fragment>
                          ))}
                        </Checkbox.Group>
                      </Card.Body>
                    </Card>
                  </Grid>
                  <Grid xs={2}>
                    <Button
                      onPress={handleCheckAnswerChoise}
                      flat
                      size={'sm'}
                      disabled={listChoise.length === 0}
                    >
                      Check answer
                    </Button>
                  </Grid>
                  <Grid xs={10}>
                    <Text size={16} css={{ margin: '4px 0' }} color="error">
                      {isNotCorrect && (
                        <strong>
                          Answer: {listLearning[indexSelectQuestion].answer}
                        </strong>
                      )}
                    </Text>
                  </Grid>
                </Grid.Container>
              )}
          </Card.Body>
        </Card>
      </Fragment>
    </div>
  );
};

export default Learn;
