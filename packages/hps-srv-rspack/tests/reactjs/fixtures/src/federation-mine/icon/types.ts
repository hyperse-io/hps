import { CSSProperties } from 'react';

export type IconName = 'loading';

export type IconSvgContants = {
  [index in IconName]: SvgPathData;
};

export interface SvgPathData {
  body: string;
  viewBox: string;
}

export type IconSvgType = SvgPathData | IconName;

export interface IconProps {
  size?: number;
  color?: string;
  spin?: boolean;
  style?: CSSProperties;
  title?: string | false | null;
  children?: never;
  className?: string;
  icon?: IconSvgType;
}
