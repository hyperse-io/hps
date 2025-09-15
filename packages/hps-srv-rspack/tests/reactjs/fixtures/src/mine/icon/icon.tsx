import { FC } from 'react';
import { classNames } from '@dimjs/utils';
import { iconSvgPaths } from './icon-svg-paths';
import { IconProps, IconSvgType, SvgPathData } from './types';
import './icon.less';

const renderSvgPaths = (iconName: IconSvgType): SvgPathData | null => {
  if (typeof iconName === 'string') {
    return iconSvgPaths[iconName] || null;
  }
  return iconName;
};

const SIZE_STANDARD = 26;

export const Icon: FC<IconProps> = (props) => {
  const {
    className,
    color,
    icon,
    spin = false,
    size = SIZE_STANDARD,
    title = '',
    ...svgProps
  } = props;
  if (!icon) {
    return null;
  }
  const paths = renderSvgPaths(icon);
  const classes = classNames(
    'fabric-icon',
    typeof icon === 'string' ? icon : '',
    spin ? 'spin' : '',
    className
  );
  const viewBox = paths?.viewBox ? paths.viewBox : `0 0 ${size} ${size}`;
  const svgBody = paths
    ? title
      ? `<desc>${title}</desc>${paths.body}`
      : paths?.body
    : '';

  // ICON class will apply a "fill" CSS style, so we need to inject an inline style to override it
  let { style = {} } = props;
  if (color !== null) {
    style = { ...style, fill: color };
  }

  return (
    <svg
      {...svgProps}
      className={classes}
      style={style}
      width={size}
      height={size}
      viewBox={viewBox}
      dangerouslySetInnerHTML={{ __html: svgBody }}
    ></svg>
  );
};
