import { type Request, type RequestHandler, type Response } from 'express';
import { extname, posix } from 'node:path';
import { fileWalk } from '@armit/file-utility';

export const createPublicAssetsMiddleware =
  (projectCwd: string, pageProxy: string): RequestHandler =>
  async (req: Request, res: Response) => {
    const baseUrl = req.baseUrl;
    // exclude `/public` leave it fallback into webpack hot server
    if (!baseUrl.startsWith('/public')) {
      res.redirect(pageProxy);
    } else {
      const publicFiles = await fileWalk(
        posix.join('public/', '**/*.{js,css}'),
        {
          cwd: projectCwd,
        }
      );
      const extension = extname(baseUrl);
      const matchedBundleFile = publicFiles.find((file) => {
        return (
          extname(file) === extension &&
          file.indexOf(baseUrl.replace(/\.(?:js|css)$/, '')) !== -1
        );
      });
      if (matchedBundleFile) {
        res.sendFile(matchedBundleFile);
      } else {
        res.sendFile(posix.join(projectCwd, baseUrl));
      }
    }
  };
