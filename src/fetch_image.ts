import fs from 'fs';
import https from 'https';

import { Source } from './path_converter';

/** Downloads image and returns absolute path to it. */
const download = async (url: string, to: string): Promise<void> =>
  new Promise((resolve, reject) =>
    https.get(url, (res) => {
      const fileStream = fs.createWriteStream(to);

      res.pipe(fileStream);

      fileStream.on('error', reject).on('finish', () => {
        fileStream.close();
        resolve();
      });
    })
  );

/** Downloads image if it's not exist. */
export const fetchImage = async (source: Source): Promise<void> => {
  if (source.isURL && !fs.existsSync(source.sourcePath)) {
    await fs.promises
      .mkdir(source.sourceDir, { recursive: true })
      .then(() => download(source.sourceUrl, source.sourcePath));
  }
};
