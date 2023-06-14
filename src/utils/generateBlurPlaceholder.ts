import { getPlaiceholder } from 'plaiceholder';

export default async function getBase64ImageUrl(imageUrl: string) {
  try {
    const buffer=await fetch(imageUrl).then(async (res)=>{
      return Buffer.from(await res.arrayBuffer());
    });
    const {base64:blurURL}=await getPlaiceholder(buffer, {size:8});
    return blurURL;
  } catch (err) {
    err;
  }
}