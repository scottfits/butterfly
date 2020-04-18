import {AppRegistry} from 'react-native';
import AuthWrapper from './components/AuthWrapper';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => AuthWrapper);
