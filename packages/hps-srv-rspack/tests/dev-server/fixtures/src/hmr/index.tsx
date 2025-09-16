import { createRoot } from 'react-dom/client';
import { Inspector } from '@hyperse/inspector';
import './index.less';
import { Fragment } from 'react';
import { Time } from './Time';
import { Button } from './Button';


const HomeWidget = () => {
  return (
    <div>
      <Fragment>
      <Inspector
        customLaunchEditorEndpoint={'/pages/__hps_inspector'}
        keys={['$mod', 'k']}
      />
      <h1>Home Widget</h1>
      <Time/>
      <Button/>
      </Fragment>
      <iframe
          style={{
            height: '500px',
            width: '100%',
            border: 'none',
            marginTop: 24,
          }}
          src="http://dev.hps.com:4000/route/hps/evolve/hmrIframe?env=me"
        />
    </div>
  );
};

const container = document.getElementById('app');
if (container) {
  createRoot(container).render(<HomeWidget />);
}