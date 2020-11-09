import InSandBox from './sandbox'

const Sandbox = new InSandBox()

export = Sandbox.require('knex', __dirname);