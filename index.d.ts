import {FastifyRegister} from 'fastify';
import {Client, Config} from '@bugsnag/js';
import {Event, Logger} from "@bugsnag/core";


declare module 'fastify' {
    interface FastifyInstance {
        bugsnag: Client;
    }
}

type AfterErrorCb = (err: any, event: Event, logger: Logger) => void;

interface BugsnagNodeConfig extends Config {
    hostname?: string
    onUncaughtException?: AfterErrorCb
    onUnhandledRejection?: AfterErrorCb
    agent?: any
    projectRoot?: string
    sendCode?: boolean
}

export interface PluginOptions {
    apiKey?: String;
    bugsnagOptions: BugsnagNodeConfig,
    enableReporting?: Boolean;
}

declare const fastifyBugsnag: FastifyRegister<PluginOptions>;

export default fastifyBugsnag;
