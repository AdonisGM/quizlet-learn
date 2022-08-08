import { Button, Card, Grid, Spacer, Text } from '@nextui-org/react';
import { Fragment, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from 'react-icons/md';
import classes from './Learn.module.css';

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

// const extractQuestion = (text) => {
//   const result = text
//     .split('\n')
//     .filter((item) => {
//       return !item.match(/^[AaBbCcDdEeFf]{1}[ ]{0,}[\.]{0,1}/g);
//     })
//     .join('\n');
//   return result;
// };

// const extractAnswer = (text) => {
//   const result = text
//     .split('\n')
//     .filter((item) => {
//       return item.slice(0, 5).match(/^[AaBbCcDdEeFf]{1}[ ]{0,}[\.]{0,1}/g);
//     })
//     .map((item) => {
//       let a;
//       if (item.slice(0, 5).match(/[Aa]{1}[ ]{0,}[\.]{0,1}/g)) a = 'A';
//       if (item.slice(0, 5).match(/[Bb]{1}[ ]{0,}[\.]{0,1}/g)) a = 'B';
//       if (item.slice(0, 5).match(/[Cc]{1}[ ]{0,}[\.]{0,1}/g)) a = 'C';
//       if (item.slice(0, 5).match(/[Dd]{1}[ ]{0,}[\.]{0,1}/g)) a = 'D';
//       if (item.slice(0, 5).match(/[Ee]{1}[ ]{0,}[\.]{0,1}/g)) a = 'E';
//       if (item.slice(0, 5).match(/[Ff]{1}[ ]{0,}[\.]{0,1}/g)) a = 'F';
//       return {
//         key: a,
//         value: item.replace(/^[AaBbCcDdEeFf]{1}[ ]{0,}[\.]{0,1}/g, '').trim(),
//       };
//     });
//   return result;
// };

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
  const [indexSelectQuestion, setIndexSelectQuestion] = useState(0);
  const [listAnswer, setListAnswer] = useState([]);
  const [selectAnswer, setSelectAnswer] = useState(undefined);
  const [isNotCorrect, setIsNotCorrect] = useState(false);

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
    setListLearning(listSeven);
    setIndexSelectQuestion(0);
  }, []);

  // load question and answer to card on indexSelectQuestion change
  useEffect(() => {
    setSelectAnswer(undefined);
    setIsNotCorrect(false);
    if (listLearning.length > 0) {
      setListAnswer(generateAnswer(listLearning[indexSelectQuestion].answer));
    }
  }, [indexSelectQuestion, listLearning]);

  // function and handler
  const generateAnswer = (answer) => {
    const ran = [...dummyAnswer].sort(() => Math.random() - 0.5);
    const l = [answer, ...ran];

    const result = l.filter((item, index) => {
      return l.indexOf(item) === index;
    });

    // shuffle
    const shuffled = result.slice(0, 4).sort(() => Math.random() - 0.5);
    return shuffled;
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
    navigate('/course/' + id);
  };

  const handleCardAnswerPress = (key) => {
    setSelectAnswer(key);

    if (key === listLearning[indexSelectQuestion].answer) {
      listLearning[indexSelectQuestion].count =
        listLearning[indexSelectQuestion].count + 1;

      setTimeout(() => {
        if (indexSelectQuestion !== listLearning.length - 1) {
          setIndexSelectQuestion(indexSelectQuestion + 1);
        } else {
          const t = listLearning.filter((item) => {
            return item.count <= 1;
          });
          if (t.length === 0) {
            updateListLocalStorage();
          } else {
            setListLearning(t);
            setIndexSelectQuestion(0);
          }
        }
      }, 500);
    } else {
      setIsNotCorrect(true);
    }
  };

  const handleNextButtonPress = () => {
    if (indexSelectQuestion !== listLearning.length - 1) {
      setIndexSelectQuestion(indexSelectQuestion + 1);
    } else {
      const t = listLearning.filter((item) => {
        return item.count <= 1;
      });
      if (t.length === 0) {
        updateListLocalStorage();
      } else {
        setListLearning(t);
        setIndexSelectQuestion(0);
      }
    }
  };

  return (
    <div>
      <Fragment>
        <Grid.Container>
          <Grid xs={2}>
            <Button color={'error'} flat icon={<MdKeyboardBackspace />} auto size={'sm'} onPress={() => {
              navigate('/course/' + id);
            }}>
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
            <Text
              size={20}
              css={{
                whiteSpace: 'pre-line',
                padding: 20,
              }}
            >
              {listLearning[indexSelectQuestion] &&
                listLearning[indexSelectQuestion].question}
            </Text>
            <Spacer y={2} />
            <div className={classes.nextButton}>
              <Text
                size={16}
                css={{
                  whiteSpace: 'pre-line',
                  fontWeight: '500',
                }}
              >
                Choose the right definition
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
                          : selectAnswer === item &&
                            selectAnswer ===
                              listLearning[indexSelectQuestion].answer
                          ? styleCardCorrect
                          : selectAnswer === item &&
                            selectAnswer !==
                              listLearning[indexSelectQuestion].answer
                          ? styleCardIncorrect
                          : item == listLearning[indexSelectQuestion].answer
                          ? styleCardCorrect
                          : { cursor: 'pointer' }
                      }
                      onPress={() => handleCardAnswerPress(item)}
                    >
                      <Card.Body>
                        <div className={classes.ans}>
                          <Text className={classes.keyAns}>{index + 1}</Text>
                          <Text>{item}</Text>
                        </div>
                      </Card.Body>
                    </Card>
                  </Grid>
                ))}
            </Grid.Container>
          </Card.Body>
        </Card>
      </Fragment>
    </div>
  );
};

export default Learn;