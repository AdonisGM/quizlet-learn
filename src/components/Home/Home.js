import {
  Text,
  Spacer,
  Grid,
  Card,
  Button,
  Modal,
  Input,
  Dropdown,
  Table,
  Tooltip,
  Progress,
} from '@nextui-org/react';
import { useEffect, useState, useRef, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './Home.module.css';
import { nanoid } from 'nanoid';
import CrawlData from '../CrawlData/CrawlData';
import {
  FcCollect,
  FcDeleteDatabase,
  FcDownload,
  FcFile,
  FcMultipleInputs,
} from 'react-icons/fc';
import { HiOutlineEye } from 'react-icons/hi';

const Home = () => {
  const [listCourse, setListCourse] = useState([]);
  const [showImport, setShowImport] = useState(false);
  const [isGettingData, setIsGettingData] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [showModalCrawl, setShowModalCrawl] = useState(false);
  const [selection, setSelection] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const codeRef = useRef();
  const navigate = useNavigate();

  const getData = () => {
    const array = Object.keys(localStorage).map((key) => {
      return { id: key, data: JSON.parse(localStorage.getItem(key)) };
    });
    // sort by name
    const t = array.sort((a, b) => {
      return a.data.name.localeCompare(b.data.name);
    });

    setListCourse(t);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleCreate = () => {
    navigate('/create');
  };

  const handleChangeSelect = (e) => {
    console.log(e);
    setSelection([...e]);
  };

  const handleDelete = () => {
    console.log(selection);
    selection.forEach((item) => {
      localStorage.removeItem(item);
    });
    getData();
    setSelection([]);
    setIsDeleteMode(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getData();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleImport = () => {
    const code = codeRef.current.value.trim();

    setIsGettingData(true);
    fetch(
      'https://short-link-adonisgm.azurewebsites.net/api/quizlet/download',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Something went wrong');
      })
      .then((data) => {
        const course = data.data;
        localStorage.setItem(nanoid(15), course);
        setShowImport(false);
        setIsGettingData(false);
        getData();
      })
      .catch(() => {
        setIsFailed(true);
        setIsGettingData(false);
      });
  };

  return (
    <div>
      <CrawlData
        open={showModalCrawl}
        setClose={setShowModalCrawl}
        onSuccess={() => {
          setShowModalCrawl(false);
          getData();
        }}
      />
      <Modal
        open={showImport}
        blur
        closeButton
        onClose={() => {
          setShowImport(false);
        }}
      >
        <Modal.Body>
          <Fragment>
            <Text
              p
              b
              size={14}
              css={{
                textAlign: 'center',
              }}
            >
              Import by share code
            </Text>
            <Spacer y={0.5} />
            <Input placeholder="Share code" ref={codeRef} />
            <Button
              auto
              css={{
                margin: '0 auto',
              }}
              onClick={() => {
                handleImport();
              }}
              disabled={isGettingData}
              color={isFailed ? 'error' : 'primary'}
            >
              Import
            </Button>
          </Fragment>
        </Modal.Body>
      </Modal>
      <div className={classes.header}>
        <Text h1>Home</Text>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            columnGap: '1rem',
          }}
        >
          <Dropdown disableAnimation>
            <Dropdown.Button flat color="secondary">
              Menu
            </Dropdown.Button>
            <Dropdown.Menu
              color="secondary"
              aria-label="Actions"
              css={{ $$dropdownMenuWidth: '280px' }}
              onAction={(e) => {
                switch (e) {
                  case 'quizlet':
                    handleCreate();
                    break;
                  case 'import':
                    setShowImport(true);
                    setIsFailed(false);
                    break;
                  case 'crawl':
                    setShowModalCrawl(true);
                    break;
                  case 'merge':
                    navigate('/merge');
                    break;
                  case 'delete':
                    setIsDeleteMode(!isDeleteMode);
                    setSelection([]);
                  default:
                    break;
                }
              }}
            >
              <Dropdown.Section title="Automatic">
                <Dropdown.Item
                  key="crawl"
                  description="Crawl data from Quizlet"
                  color="success"
                  icon={<FcMultipleInputs />}
                >
                  Crawl data <b>{'(recommended)'}</b>
                </Dropdown.Item>
              </Dropdown.Section>
              <Dropdown.Section title="Manual">
                <Dropdown.Item
                  key="quizlet"
                  description="Create new course by export Quizlet"
                  color="primary"
                  icon={<FcFile />}
                >
                  Quizlet
                </Dropdown.Item>
                <Dropdown.Item
                  key="import"
                  description="Import course by share code"
                  color="warning"
                  icon={<FcDownload />}
                >
                  Import code
                </Dropdown.Item>
                <Dropdown.Item
                  key="merge"
                  description="Merge course for easy learning"
                  color="success"
                  icon={<FcCollect />}
                >
                  Merge course
                </Dropdown.Item>
              </Dropdown.Section>
              <Dropdown.Section title="Danger">
                <Dropdown.Item
                  key="delete"
                  description="Delete selected course"
                  color="error"
                  icon={<FcDeleteDatabase />}
                >
                  {isDeleteMode ? 'Cancel delete mode' : 'Delete mode'}
                </Dropdown.Item>
              </Dropdown.Section>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <Spacer y={1.4} />
      <Text
        p
        b
        size={16}
        css={{
          width: '100%',
          textAlign: 'center',
        }}
      >
        List courses
      </Text>
      <Spacer />
      {listCourse.length > 0 && (
        <Table
          selectionMode={isDeleteMode ? 'multiple' : 'none'}
          onSelectionChange={handleChangeSelect}
          color={isDeleteMode ? 'error' : 'primary'}
          selectedKeys={selection}
        >
          <Table.Header>
            <Table.Column width={200}>ID</Table.Column>
            <Table.Column>name</Table.Column>
            <Table.Column>quantity</Table.Column>
            <Table.Column>Progress</Table.Column>
            <Table.Column width={190}>Create at</Table.Column>
            <Table.Column width={40} align={'end'}></Table.Column>
          </Table.Header>
          <Table.Pagination
            shadow
            noMargin
            align="center"
            rowsPerPage={10}
            color={isDeleteMode ? 'error' : 'primary'}
          />
          <Table.Body>
            {listCourse
              .sort((a, b) => {
                return new Date(b.data.createdAt) - new Date(a.data.createdAt);
              })
              .map((item) => {
                const progress = (
                  (item.data.data.filter((item) => {
                    return item.learned;
                  }).length *
                    100) /
                  item.data.data.length
                ).toFixed(2);
                return (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>{item.data.name}</Table.Cell>
                    <Table.Cell>{item.data.data.length}</Table.Cell>
                    <Table.Cell>
                      <Text
                        p
                        b
                        color={
                          progress >= 90
                            ? 'success'
                            : progress > 0
                            ? 'warning'
                            : 'error'
                        }
                      >
                        {progress} %
                      </Text>
                      <Progress
                        size={'xs'}
                        value={progress}
                        color={
                          progress >= 90
                            ? 'success'
                            : progress > 0
                            ? 'warning'
                            : 'error'
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(item.data.createdAt).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      {!isDeleteMode && (
                        <Tooltip content={'View detail'}>
                          <HiOutlineEye
                            size={20}
                            color="#005FCC"
                            style={{
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              navigate(`/course/${item.id}`);
                            }}
                          />
                        </Tooltip>
                      )}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table>
      )}
      {selection.length > 0 && (
        <Fragment>
          <Spacer y={1} />
          <Button
            auto
            color="error"
            onClick={() => {
              handleDelete();
            }}
            css={{
              margin: '0 auto',
            }}
          >
            <Text color="#fff">Delete selected</Text>
          </Button>
          <Text
            css={{
              textAlign: 'center',
            }}
            size={12}
            color="error"
          >
            Careful, <b>this action cannot be undone.</b> Gods help you.
          </Text>
        </Fragment>
      )}
    </div>
  );
};

export default Home;
