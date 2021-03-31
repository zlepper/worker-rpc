import { startWorkerProvider, WebWorkerServerConnection } from '../../src';
import { MyClass } from '../shared/my-class.js';

const connection = new WebWorkerServerConnection();
startWorkerProvider(new MyClass(), connection);
