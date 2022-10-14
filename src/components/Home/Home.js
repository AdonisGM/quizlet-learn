import {
  Text,
  Spacer,
  Grid,
  Card,
  Button,
  Modal,
  Input,
} from '@nextui-org/react';
import { useEffect, useState, useRef, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './Home.module.css';
import { nanoid } from 'nanoid';

const Home = () => {
  const [listCourse, setListCourse] = useState([]);
  const [showImport, setShowImport] = useState(false);
  const [isGettingData, setIsGettingData] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

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
          <Button flat auto onPress={handleCreate}>
            Create from Quizlet
          </Button>
          <Button
            flat
            auto
            color={'gradient'}
            onPress={() => {
              setShowImport(true);
              setIsFailed(false);
            }}
          >
            Import by share code
          </Button>
        </div>
      </div>
      <Spacer y={1.4} />
      <Text h2>List courses:</Text>
      <Spacer />
      <Grid.Container gap={3}>
        {listCourse.length > 0 &&
          listCourse.map((item) => (
            <Grid xs={4} key={item.id}>
              <Card css={{ cursor: 'pointer' }}>
                <Card.Body
                  onClick={() => {
                    navigate(`/course/${item.id}`);
                  }}
                >
                  <Text size={10}>
                    Id: <strong>{item.id}</strong>
                  </Text>
                  <Spacer y={1} />
                  <Text>
                    Name: <strong>{item.data.name}</strong>
                  </Text>
                  <Text>
                    Create at:{' '}
                    <strong>
                      {new Date(item.data.createdAt).toLocaleString()}
                    </strong>
                  </Text>
                </Card.Body>
              </Card>
            </Grid>
          ))}
      </Grid.Container>
    </div>
  );
};

export default Home;
