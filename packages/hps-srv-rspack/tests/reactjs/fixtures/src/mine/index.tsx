import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { strCamelCase } from '@dimjs/utils';
import { SuspendedComp, SuspendedComp1 } from './components/suspend';
import { Icon } from './icon/icon';
import info from './svg-icons/info.svg';
import { useStore } from './use';
import './fonts.less';
import './main.less';
import './styles/index';

function Test() {
  const [, update] = useState({});
  const ref = useStore();
  return (
    <div>
      <div className="logo">This is Logo with font</div>
      <div className="flat-font">方正黄庭坚行书 {strCamelCase('dddd ddd')}</div>
      <button
        onClick={() => {
          ref.current = `2`;
          update({});
        }}
      >
        UseRef Testing
        <Icon
          className="icon-dislike"
          icon={'loading'}
          size={80}
          color="#666"
        />
        <Icon
          className="icon-ellipsis"
          icon={'loading'}
          size={80}
          color="#666"
        />
        <Icon className="icon-info" icon={info} size={40} color="#666" />
      </button>
      <SuspendedComp1 />
      <SuspendedComp />
    </div>
  );
}
const container = document.getElementById('app');

if (container) {
  createRoot(container).render(<Test />);
}
