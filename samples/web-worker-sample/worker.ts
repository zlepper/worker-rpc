import { startWorkerProvider } from '@zlepper/rpc';
import { WebWorkerServerConnection } from '@zlepper/web-worker-rpc';
import { MyClass } from './my-class';

const connection = new WebWorkerServerConnection();
startWorkerProvider(new MyClass(), connection);
