import {AppRegistry} from 'react-native';
import LoginScreen from './screens/LoginScreen';
import Video from './components/Video';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Video);
