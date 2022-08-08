import {
  Input,
  Textarea,
  Spacer,
  Text,
  Button,
  Grid,
  Switch,
} from '@nextui-org/react';
import { useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';

const Create = () => {
  const [isValidName, setIsValidName] = useState(true);
  const [isValidContent, setIsValidContent] = useState(true);
  const [firstExtract, setFirstExtract] = useState('-----');
  const [secondExtract, setSecondExtract] = useState('\n\n\n');
  const [isSuccess, setIsSuccess] = useState(false);

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
          answer,
          question,
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
      <Text h1>Create course</Text>
      <Spacer />
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
        label="Export course content"
        rows={15}
        ref={contentRef}
      />
      {/* <Spacer />
      <Switch checked={true} />
      <Grid.Container>
        <Grid xs={3}>
          <Input label="Name of course" />
        </Grid>
        <Grid xs={3}>
          <Input label="Name of course" />
        </Grid>
      </Grid.Container> */}
      <Spacer />
      <Button onPress={handleCreate}>Create</Button>
    </div>
  );
};

export default Create;
