/**
 * Step 2
 *
 * Or order to capture data (and not have to prop drill) we can set up AsyncLocalStorage.
 * Our decorators will look for this at run time and inject dynamic data.
 */
import { AsyncLocalStorage } from 'async_hooks';
import { assert } from 'console';
type ALSData = {
  userData: UserData;
};
type UserData = {
  userId: number;
};
const als = new AsyncLocalStorage<ALSData>();

/**
 * However, deciding how to invoke a new context might take some thought.
 * If you're using express, just use a quick piece of middleware.
 * If you're using NestJS, a decorator is probably better. This could be
 * part of your AuthZ Guard logic.
 */
function EnableUserContext(
  _: object,
  key: string,
  descriptor: PropertyDescriptor,
): any {
  // console.log(args);
  const origFn = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const request = args[0];

    // mock authn/authz successfully gave us this.
    if (request.user) {
      return als.run({ userData: request.user }, origFn.bind(this, ...args));
    }
    return origFn.call(this, ...args);
  };
}
/** */

/**
 * Step 3
 * Writing a decorator to inject the data is fairly straightforward.
 */
function UserData(_: object, key: string, descriptor: PropertyDescriptor) {
  const origFn = descriptor.value;
  descriptor.value = function (...args: any[]) {
    this.userData = als.getStore().userData;
    return origFn.call(this, ...args);
  };
}

/**
 * Step 1. We have all these Controller/Service/Model setup.
 * Consider the use case where we want to apply a police that users can only see the projects they own.
 * Often we first query, then prune. This is a sub-par db query and is prone to data leaks if we don't prune at the right level.
 *
 * We can elegantly solve this with ALS and Decorators.
 */
class Controller {
  projectService = new Service();

  @EnableUserContext
  findAll(req: any) {
    // I have user from req.
    console.log('i have a user from the request', req.user);
    return this.projectService.findAll();
  }
}

class Service {
  projectModel = new Model();
  userData?: UserData;

  @UserData
  findAll() {
    // This option might be also good to ensure optimal security (what if this is called not from http?)
    const projects = this.projectModel.findAll();
    return projects.filter((el) => el.ownerId === this.userData.userId);
  }
}

class Model {
  projects = [
    {
      ownerId: 1,
      projectName: '',
    },
    {
      ownerId: 2,
      projectName: '',
    },
  ];
  userData?: UserData;
  @UserData
  findAll() {
    // to do figure out how to type this
    const userData = this.userData;
    console.log('i have a user from the context', userData);

    // optimized db query
    if (userData?.userId) {
      return this.projects.filter((el) => el.ownerId === userData.userId);
    }

    // otherwise, just return `select *`
    return this.projects;
  }
}

/**
 * We can simulate the workflow by setting up and calling the controller the method to findAll
 */
const ctrl = new Controller();
const result = ctrl.findAll({ user: { userId: 1 } });
console.log(result);
assert(result[0].ownerId === 1);
assert(result.length === 1);
