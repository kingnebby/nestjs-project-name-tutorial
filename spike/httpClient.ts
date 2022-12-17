/**
 * Generated with:
 * https://github.com/OpenAPITools/openapi-generator-cli
 * ```
 * rm -rf ./ts-cli && openapi-generator-cli generate -i dist/swagger.json -g typescript-axios -o ./ts-cli
 * ```
 * Requires `request` to be installed along side.
 */

// typescript-axios (axios)
import { Configuration, DefaultApi } from '../ts-cli';

const c = new Configuration({ basePath: 'http://localhost:3000' });
const api = new DefaultApi(c);

async function start() {
  const response = await api.usersControllerFindAll();
  console.log(response.data);

  const authToken = await api.authControllerLogin({
    username: 'ash@wayvdev.com',
    password: 'password',
  });
  console.log(authToken.data);

  // How to specify auth requirements in the swagger?? and the generated codez?
  const profile = await api.authControllerGetProfile();
  console.log(profile.data);

  const createdUser = await api.usersControllerCreate({
    email: 'root@root.com',
  });
  console.log(createdUser.data);
}

start();
