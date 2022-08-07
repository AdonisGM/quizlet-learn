import classes from './Layout.module.css';
import { Outlet } from 'react-router-dom';
import { Fragment } from 'react';
import { Text, Link as LinkNextUI } from '@nextui-org/react';

const Layout = () => {
  return (
    <Fragment>
      <div className={classes.main}>
        <Outlet />
      </div>
      <Text size={10} css={{ textAlign: 'center', marginTop: 40 }}>
        Copyright © {new Date().getFullYear()}{' '}
        <LinkNextUI
          target={'_blank'}
          href="https://github.com/AdonisGM"
          color={'text'}
        >
          <strong>AdonisGM</strong>
        </LinkNextUI>
      </Text>
    </Fragment>
  );
};

export default Layout;
