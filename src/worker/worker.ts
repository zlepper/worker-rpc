import {MyClass} from "../shared/my-class.js";
import {startWorkerProvider} from "./worker-provider.js";

console.log('hello from the worker!');




startWorkerProvider(new MyClass());
