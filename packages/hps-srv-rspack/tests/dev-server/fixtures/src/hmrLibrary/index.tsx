import { Inspector } from '@hyperse/inspector';
import './index.less';
import { Fragment } from 'react';
import { Time } from './Time';
import { Button } from './Button';


export const HmrLibrary = () => {
  return (
    <div>
      <h4>Test hmr Library</h4>
      <Fragment>
      <Inspector
        customLaunchEditorEndpoint={'/pages/__hps_inspector'}
        keys={['$mod', 'k']}
      />
      <h1>Home Widget 1</h1>
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