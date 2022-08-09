import {
  Input,
  Textarea,
  Spacer,
  Text,
  Button,
  Grid,
  Switch,
  Card,
  Link,
} from '@nextui-org/react';
import { useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import classes from './Create.module.css';
import { MdKeyboardBackspace } from 'react-icons/md';
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const Create = () => {
  const [isValidName, setIsValidName] = useState(true);
  const [isValidContent, setIsValidContent] = useState(true);
  const [firstExtract, setFirstExtract] = useState('-----');
  const [secondExtract, setSecondExtract] = useState('\n\n\n');
  const [isReverse, setIsReverse] = useState(false);

  const nameRef = useRef();
  const contentRef = useRef();

  const navigate = useNavigate();

  const handleCreate = () => {
    const name = nameRef.current.value.trim();
    const content = contentRef.current.value.trim();

    setIsValidName(name.length > 0);
    setIsValidContent(content.length > 0);

    if (name.length > 0 && content.length > 0) {
      const list = content.split(secondExtract);
      const listObject = list.map((item) => {
        const [answer, question] = item.split(firstExtract);
        return {
          i: nanoid(6),
          answer: !isReverse ? answer : question,
          question: !isReverse ? question : answer,
          learned: false,
        };
      });
      // save to local storage
      localStorage.setItem(
        nanoid(15),
        JSON.stringify({
          name: name,
          data: listObject,
          createdAt: new Date(),
          learnedAt: null,
        })
      );
    }
    navigate('/');
  };

  return (
    <div>
      <div>
        <Grid.Container>
          <Grid xs={3}>
            <Button
              auto
              color={'default'}
              icon={<MdKeyboardBackspace />}
              onPress={() => navigate('/')}
            >
              List course
            </Button>
          </Grid>
          <Grid xs={6}>
            <Text css={{ textAlign: 'center', width: '100%' }} h1 size={18}>
              Create course
            </Text>
          </Grid>
          <Grid xs={3}>
            <div className={classes.iconQuestion}>
              <Link href="">
                <BsFillQuestionCircleFill size={30} color="gray" />
              </Link>
            </div>
          </Grid>
        </Grid.Container>
      </div>
      <Spacer />
      <Card>
        <Card.Body>
          <Input
            status={isValidName ? 'default' : 'error'}
            css={{ width: '100%' }}
            label="Name of course"
            ref={nameRef}
          />
          <Spacer />
          <Textarea
            status={isValidContent ? 'default' : 'error'}
            css={{ width: '100%' }}
            label="Import course content"
            rows={15}
            ref={contentRef}
          />
          <Spacer />
          <Card.Divider />
          <Spacer />
          <div className={classes.butonSwitch}>
            <Text css={{ margin: 0 }}>Reverse extract:</Text>
            <Switch
              checked={isReverse}
              shadow
              onChange={(e) => {
                setIsReverse(e.target.checked);
              }}
            />
          </div>
          <Grid.Container>
            <Grid xs={3}>
              <Input
                readOnly={true}
                label="Between term and definition"
                value={'-----'}
              />
            </Grid>
            <Grid xs={3}>
              <Input readOnly={true} label="Between rows" value={'\\n\\n\\n'} />
            </Grid>
          </Grid.Container>
        </Card.Body>
      </Card>
      <Spacer />
      <Button onPress={handleCreate}>Create</Button>
    </div>
  );
};

export default Create;
