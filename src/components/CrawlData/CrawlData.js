import { Modal, Text, Spacer, Button, Input, Loading } from '@nextui-org/react';
import { useState, Fragment, useRef } from 'react';
import { nanoid } from 'nanoid';

const CrawlData = ({ open, setClose, onSuccess }) => {
  const [isGettingData, setIsGettingData] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const urlRef = useRef();

  const handleCrawl = () => {
    setIsGettingData(true);
    setIsFailed(false);
    fetch('https://short-link-adonisgm.azurewebsites.net/api/quizlet/crawl-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: urlRef.current.value.trim(),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        let data = res.data.course;
        data = data.map((item) => {
          return {
            ...item,
            i: nanoid(6),
            learned: false,
          };
        });
        const course = {
          name: res.data.title,
          data,
          createdAt: new Date(),
          learnedAt: null,
        };
        localStorage.setItem(nanoid(15), JSON.stringify(course));
        onSuccess();
        setIsGettingData(false);        
      })
      .catch(() => {
        setIsFailed(true);
        setIsGettingData(false);
      });
  };

  return (
    <Modal
      open={open}
      blur
      closeButton
      onClose={() => {
        setClose(false);
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
            Crawl data from URL
          </Text>
          <Spacer y={0.5} />
          <Input
            placeholder="https://quizlet.com/vn/652631/demo-crawl-data"
            ref={urlRef}
          />
          <Button
            auto
            css={{
              margin: '0 auto',
              width: '150px',
            }}
            onClick={() => {
              handleCrawl();
            }}
            disabled={isGettingData}
            color={isFailed ? 'error' : 'primary'}
          >
            {isGettingData ? <Loading color={'secondary'} size={'sm'}/> : 'Crawl data'}
          </Button>
        </Fragment>
      </Modal.Body>
    </Modal>
  );
};

export default CrawlData;
