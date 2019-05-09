import React, { Fragment } from 'react';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './UserLayout.less';

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 深圳前海翼联有限公司
  </Fragment>
);

const UserLayout = ({ children }) => (
  // @TODO <DocumentTitle title={this.getPageTitle()}>
  <div className={styles.container}>
    <div className={styles.content}>
      {children}
    </div>
    <GlobalFooter copyright={copyright} />
  </div>
);

export default UserLayout;
