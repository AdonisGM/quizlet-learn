import { Fragment, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Text,
  Progress,
  Spacer,
  Table,
  Card,
  Input,
  Loading,
  Modal,
  Dropdown,
  Button,
} from '@nextui-org/react';
import classes from './DetailCourse.module.css';
import { RiEyeLine } from 'react-icons/ri';
import { MdKeyboardBackspace } from 'react-icons/md';
import { FcGraduationCap, FcReading, FcFullTrash } from 'react-icons/fc';

function toLowerCaseNonAccentVietnamese(str) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
  str = str.replace(/\u02C6|\u0306|\u031B/g, '');
  return str;
}

const DetailCourse = () => {
  const [infoCourse, setInfoCourse] = useState(undefined);
  const [course, setCourse] = useState([]);
  const [courseSearch, setCourseSearch] = useState([]);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectQuestion, setSelectQuestion] = useState(undefined);

  const { id } = useParams();
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setSearching(true);
  };

  useEffect(() => {
    const course1 = localStorage.getItem(id);

    setInfoCourse(JSON.parse(course1));
    setCourse(JSON.parse(course1).data);
    setCourseSearch(JSON.parse(course1).data);
  }, []);

  useEffect(() => {
    const time = setTimeout(() => {
      if (search !== undefined && course.length > 0) {
        const find = course.filter((item) => {
          const name = toLowerCaseNonAccentVietnamese(item.question.trim());
          const searcha = toLowerCaseNonAccentVietnamese(search.trim());
          return name.includes(searcha);
        });
        setCourseSearch([...find]);
      }
      setSearching(false);
      console.log('searching');
    }, 300);

    return () => clearTimeout(time);
  }, [search]);

  const handleCloseModal = () => {
    setSelectQuestion(undefined);
    setShowModal(false);
  };

  const handleDelete = () => {
    localStorage.removeItem(id);
    navigate('/');
  };

  const handleButtonLearnPress = () => {
    if (course.filter((item) => item.learned === false).length === 0) {
      course.forEach((item) => {
        item.learned = false;
      });
      const temp1 = JSON.parse(localStorage.getItem(id));
      temp1.data = course;
      localStorage.setItem(id, JSON.stringify(temp1));
    }
    navigate(`/learn/${id}`);
  };

  return (
    <div>
      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={showModal}
        onClose={handleCloseModal}
        width={'40%'}
      >
        <Modal.Body>
          <Text css={{ whiteSpace: 'pre-line' }}>
            {selectQuestion && selectQuestion.question}
          </Text>
          <Spacer />
          {selectQuestion && console.log(selectQuestion.question)}
          <Text>
            <strong>Answer: {selectQuestion && selectQuestion.answer}</strong>
          </Text>
        </Modal.Body>
      </Modal>
      <div className={classes.header}>
        <Button
          auto
          color={'default'}
          icon={<MdKeyboardBackspace />}
          onPress={() => navigate('/')}
        >
          List course
        </Button>
        <div className={classes.buttonHeader}>
          <Dropdown disableAnimation>
            <Dropdown.Button flat color="secondary">
              Actions
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label="Actions"
              css={{ $$dropdownMenuWidth: '280px' }}
              onAction={(e) => {
                switch (e) {
                  case 'Learn':
                    handleButtonLearnPress();
                    break;
                  case 'Exam':
                    navigate('/course/' + id + '/exam');
                    break;
                  case 'Delete':
                    handleDelete();
                  default:
                    break;
                }
              }}
            >
              <Dropdown.Section title={'Actions'}>
                <Dropdown.Item
                  key="Learn"
                  description="Learn course multiple choice"
                  color="success"
                  icon={<FcReading size={20} />}
                >
                  Learn
                </Dropdown.Item>
                <Dropdown.Item
                  key="Exam"
                  description="Exam course with layout EOS 🤣"
                  color="warning"
                  icon={<FcGraduationCap size={20} />}
                >
                  Take exam
                </Dropdown.Item>
              </Dropdown.Section>
              <Dropdown.Section title={'Danger Zone'}>
                <Dropdown.Item
                  key="Delete"
                  description="Delete course, can't be undone"
                  color="error"
                  icon={<FcFullTrash size={20} />}
                >
                  Delete
                </Dropdown.Item>
              </Dropdown.Section>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      {infoCourse !== undefined && courseSearch !== undefined && (
        <Fragment>
          <Spacer />
          <Text css={{ textAlign: 'center' }}>
            Name: <strong>{infoCourse.name}</strong>
          </Text>
          <Text css={{ textAlign: 'center' }}>
            Create at:{' '}
            <strong>{new Date(infoCourse.createdAt).toLocaleString()}</strong>
          </Text>
          <Spacer y={2} />
          <div className={classes.search}>
            <Input
              width={500}
              labelLeft={'Search'}
              onChange={handleSearchChange}
              clearable
            />
          </div>
          <Spacer y={0.5} />
          <Progress
            css={{
              position: 'fixed',
              top: 0,
              left: 0,
            }}
            squared="true"
            size="sm"
            value={
              (course.filter((item) => item.learned === true).length /
                (course.length === 0 ? 1 : course.length)) *
              100
            }
            shadow
            color="gradient"
            status="primary"
          />
          <Card css={{ minHeight: 400 }}>
            {searching && <Loading />}
            {!searching && (
              <Table css={{ minHeight: 400 }}>
                <Table.Header>
                  <Table.Column width={100}>ID</Table.Column>
                  <Table.Column>Question</Table.Column>
                  <Table.Column css={{ textAlign: 'center' }} width={80}>
                    Answer
                  </Table.Column>
                  <Table.Column width={20}></Table.Column>
                </Table.Header>
                <Table.Body>
                  {courseSearch.map((item) => (
                    <Table.Row key={item.i}>
                      <Table.Cell>{item.i}</Table.Cell>
                      <Table.Cell>
                        <span className={classes.questionSpan}>
                          {item.question}
                        </span>
                      </Table.Cell>
                      <Table.Cell css={{ textAlign: 'center' }}>
                        {item.answer}
                      </Table.Cell>
                      <Table.Cell>
                        <RiEyeLine
                          color="0072f5"
                          className={classes.iconEye}
                          size={16}
                          onClick={() => {
                            setShowModal(true);
                            setSelectQuestion(item);
                          }}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
                {courseSearch.length > 0 && (
                  <Table.Pagination
                    shadow
                    noMargin
                    align="center"
                    rowsPerPage={10}
                  />
                )}
              </Table>
            )}
          </Card>
        </Fragment>
      )}
    </div>
  );
};

export default DetailCourse;
