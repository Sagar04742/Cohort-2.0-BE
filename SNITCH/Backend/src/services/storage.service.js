import ImageKit, { toFile } from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

export async function uploadFile({ buffer, fileName, folder = "snitch" }) {
  const result = await client.files.upload({
    file: await toFile(buffer, fileName),
    fileName,
    folder,
  });

  return result;
}
