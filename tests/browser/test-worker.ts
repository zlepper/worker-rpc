import { startWorkerProvider, WebWorkerServerConnection } from '../../src';
import { Calculator } from '../shared/calculator';

const connection = new WebWorkerServerConnection();
startWorkerProvider(new Calculator(), connection);
