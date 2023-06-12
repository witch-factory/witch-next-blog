import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';

export default async function getBase64ImageUrl(imageUrl: string) {
  const response= await fetch(imageUrl.replace('w_300,f_auto', 'w_16,f_jpg'));
  const buffer= await response.arrayBuffer();
  const minified = await imagemin.buffer(Buffer.from(buffer), {
    plugins: [imageminJpegtran()],
  });
  const blurURL = `data:image/jpeg;base64,${Buffer.from(minified).toString('base64')}`;
  return blurURL;
}