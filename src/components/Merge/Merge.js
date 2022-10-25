import { Button, Card, Grid, Input, Spacer, Text } from '@nextui-org/react';
import { Select } from 'antd';
import { nanoid } from 'nanoid';
import { createRef, useState } from 'react';
import { MdKeyboardBackspace } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import classes from './Merge.module.css';

const getAllCourses = () => {
  const array = Object.keys(localStorage).map((key) => {
    return { id: key, name: JSON.parse(localStorage.getItem(key)).name };
  });
  return array;
};

const Merge = () => {
  const [listCourse, setListCourse] = useState(getAllCourses());
  const [first, setFirst] = useState(undefined);
  const [second, setSecond] = useState(undefined);
  const [name, setName] = useState('');

  const navigate = useNavigate();

  const handleChangeName = (e) => {
    setName(e.target.value.trim());
  };

  const handlerMerge = () => {
    if (first && second && name) {
      const firstCourse = JSON.parse(localStorage.getItem(first));
      const secondCourse = JSON.parse(localStorage.getItem(second));
      const newCourse = {
        name,
        data: [...firstCourse.data, ...secondCourse.data],
        createdAt: new Date().getTime(),
        learnedAt: false
      };
      const id = nanoid(15);
      localStorage.setItem(id, JSON.stringify(newCourse));
      navigate('/course/' + id);
    }
  };

  return (
    <div>
      <div>
        <Button
          auto
          color={'default'}
          icon={<MdKeyboardBackspace />}
          onPress={() => navigate('/')}
        >
          Back to home
        </Button>
      </div>
      <Spacer y={2} />
      <Card>
        <Card.Body>
          <Grid.Container gap={2}>
            <Grid xs={2}></Grid>
            <Grid xs={4} direction={'column'}>
              <Text p size={14}>
                Course 1
              </Text>
              <Spacer y={0.5} />
              <Select
                onSelect={(value) => setFirst(value)}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
                showSearch
                className={classes.select}
              >
                {listCourse
                  .filter((item) => item.id !== second)
                  .map((course) => (
                    <Select.Option key={course.id} value={course.id}>
                      {course.name}
                    </Select.Option>
                  ))}
              </Select>
            </Grid>
            <Grid xs={4} direction={'column'}>
              <Text p size={14}>
                Course 2
              </Text>
              <Spacer y={0.5} />
              <Select
                onSelect={(value) => setSecond(value)}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
                showSearch
                className={classes.select}
              >
                {listCourse
                  .filter((item) => item.id !== first)
                  .map((course) => (
                    <Select.Option key={course.id} value={course.id}>
                      {course.name}
                    </Select.Option>
                  ))}
              </Select>
            </Grid>
            <Grid xs={2}></Grid>
          </Grid.Container>
          <div
            style={{
              textAlign: 'center',
            }}
          >
            <Spacer y={2} />
            <Input
              width="400px"
              placeholder="New course name"
              onChange={handleChangeName}
            />
            <Spacer y={1} />
            <Button
              css={{
                width: '140px',
                margin: '0 auto',
              }}
              disabled={
                first === undefined || second === undefined || name === ''
              }
              flat
              auto
              color={'success'}
              onPress={handlerMerge}
            >
              Merge course
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Merge;
