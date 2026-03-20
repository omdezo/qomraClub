declare module 'streamifier' {
  import { Readable } from 'stream';
  function createReadStream(data: Buffer | string): Readable;
  export = { createReadStream };
}
