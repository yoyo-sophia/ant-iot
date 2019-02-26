import React from 'react';
import { Tooltip, Icon } from 'antd';
// import { formatMessage } from 'umi/locale';
import styles from './ThemeColor.less';

const Tag = ({ color, check, ...rest }) => (
  <div
    {...rest}
    style={{
      backgroundColor: color,
    }}
  >
    {check ? <Icon type="check" /> : ''}
  </div>
);

const ThemeColor = ({ colors, title, value, onChange }) => {
  let colorList = colors;
  if (!colors) {
    colorList = [
      {
        colorName:'薄暮',
        key: 'dust',
        color: '#F5222D',
      },
      {
        colorName:'火山',
        key: 'volcano',
        color: '#FA541C',
      },
      {
        colorName:'日暮',
        key: 'sunset',
        color: '#FAAD14',
      },
      {
        colorName:'明青',
        key: 'cyan',
        color: '#13C2C2',
      },
      {
        colorName:'极光绿',
        key: 'green',
        color: '#52C41A',
      },
      {
        colorName:'拂晓蓝（默认）',
        key: 'daybreak',
        color: '#1890FF',
      },
      {
        colorName:'极客蓝',
        key: 'geekblue',
        color: '#2F54EB',
      },
      {
        colorName:'绛紫',
        key: 'purple',
        color: '#722ED1',
      },
    ];
  }
  return (
    <div className={styles.themeColor}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.content}>
        {colorList.map(({ key, color ,colorName}) => (
          <Tooltip key={color} title={colorName}>
          {/*<Tooltip key={color} title={formatMessage({ id: `app.setting.themecolor.${key}` })}>*/}
            <Tag
              className={styles.colorBlock}
              color={color}
              check={value === color}
              onClick={() => onChange && onChange(color)}
            />
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default ThemeColor;
