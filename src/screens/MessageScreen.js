import { Spacer, Text } from '@nextui-org/react';
import classes from '../components/Message/Message.module.css';
import { BsHeartFill } from 'react-icons/bs';

const MessageScreen = () => {
  return (
    <div className={classes.main}>
      <BsHeartFill color="red" size={40} />
      <Spacer y={0.6} />
      <Text p>
        Thank you for being a part of my mind, being a part of the motivation to
        get me where I am today.
      </Text>
      <Text p>Wishing you the best of luck in your future life.</Text>
      <Text p>
        Love you so much, <strong>4264!</strong>
      </Text>
      <Spacer y={0.6} />
      <Text p>
        From: <strong>AdonisGM</strong>
      </Text>
    </div>
  );
};

export default MessageScreen;
