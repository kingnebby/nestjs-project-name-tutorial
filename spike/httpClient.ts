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
import axios from 'axios';

// Global CLI
const c = new Configuration({ basePath: 'http://localhost:3000' });
const api = new DefaultApi(c);

async function start() {
  const response = await api.usersControllerFindAll();
  console.log(response.data);

  const userClient = await getUserClient({
    username: 'ash@wayvdev.com',
    password: 'password',
  });
  const profile = await userClient.authControllerGetProfile();
  console.log(profile.data);

  // Should fail.
  try {
    await userClient.usersControllerCreate({
      email: 'root@root.com',
    });
  } catch (error) {
    console.log(error.response.data);
  }

  const adminClient = await getUserClient({
    username: 'kingnebby@wayvdev.com',
    password: 'password',
  });
  await adminClient.usersControllerCreate({
    email: 'root@root.com',
  });

  const findAllResponse = await api.usersControllerFindAll();
  console.log(findAllResponse.data);
}

async function getUserClient({ username, password }) {
  const authToken = await api.authControllerLogin({
    username,
    password,
  });
  const { access_token } = authToken.data;
  const axiosInstance = axios.create({
    headers: { Authorization: `Bearer ${access_token}` },
  });

  const userClient = new DefaultApi(c, undefined, axiosInstance);
  return userClient;
}

start();
