import { ElectronApi } from './api/ElectronApi';
import { ManagerContainer } from './containers';

import './App.css';

const App = () => (
    <ManagerContainer />
);

window.addEventListener('keyup', ({ key }) => {
    if (key === 'F12') {
        ElectronApi.openOrCloseDevTools();
    }
});

export default App;
