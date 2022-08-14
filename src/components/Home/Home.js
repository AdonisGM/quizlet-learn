import { Text, Spacer, Grid, Card, Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './Home.module.css';

const Home = () => {
  const [listCourse, setListCourse] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const array = Object.keys(localStorage).map((key) => {
      return { id: key, data: JSON.parse(localStorage.getItem(key)) };
    });
    // sort by name
    const t = array
      .sort((a, b) => {
        return a.data.name.localeCompare(b.data.name);
      })
    
    setListCourse(t);
  }, []);

  const handleCreate = () => {
    navigate('/create');
  };

  return (
    <div>
      <div className={classes.header}>
        <Text h1>Home</Text>
        <Button onPress={handleCreate}>Create course</Button>
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
