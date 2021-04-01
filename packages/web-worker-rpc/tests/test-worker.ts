import { startWorkerProvider } from '@zlepper/rpc';
import { WebWorkerServerConnection } from '../web-worker-server-connection';
import { Calculator } from './calculator';

const connection = new WebWorkerServerConnection();
startWorkerProvider(new Calculator(), connection);
