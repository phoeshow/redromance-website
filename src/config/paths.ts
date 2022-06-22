import path from 'path';
import fs from 'fs';

const appDirectory = fs.realpathSync(process.cwd());

const resolveApp = (relativePath: string): string =>
  path.resolve(appDirectory, relativePath);

export default {
  viewPath: resolveApp('views'),
  publicPath: resolveApp('public'),
};
