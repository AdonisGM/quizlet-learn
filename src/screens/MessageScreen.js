import { Spacer, Text } from '@nextui-org/react';
import classes from '../components/Message/Message.module.css';
import { BsHeartFill } from 'react-icons/bs';

const MessageScreen = () => {
  return (
    <div className={classes.main}>
      <div style={{
        height: '60px',
      }} className={classes.heart}>
        <BsHeartFill color="red" />
      </div>
      <Spacer y={1.6} />
      <Text p>
        Trang web đã <b>DỪNG HOẠT ĐỘNG</b>. Bạn sẽ không thể truy cập vào trang
        web này được nữa.
      </Text>
      <Text p>
        Trang web xây dựng với hai mục đích chính, hiện tại mục đích đầu tiên đã
        được hoàn thành nhưng mục đích thứ hai đã không còn 😥.
      </Text>
      <Text p>Vì vậy, mình sẽ dừng hoạt động của trang web này.</Text>
      <Spacer y={1.6} />
      <Text p>Cảm ơn bạn đã sử dụng trong thời gian qua.</Text>
      <Text p>Chúc bạn một ngày tốt lành.</Text>
      <Spacer y={1} />
      <Text p>
        From: <strong>AdonisGM</strong>
      </Text>
      <Spacer y={4} />
      <Text p i>
        Source code của trang web này đã được mình đưa lên Github. Nếu bạn muốn
        tham khảo thì có thể vào đây:
      </Text>
      <a href="https://github.com/AdonisGM/quizlet-learn">
        https://github.com/AdonisGM/quizlet-learn
      </a>
    </div>
  );
};

export default MessageScreen;
