import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import OpenAI from 'openai';

const OPENAI_API_KEY = '';

const systemPrompt = 'You are an expert technical translator. Your goal is to translate the given Korean technical documents into professional and accurate English. Ensure the translation is concise and formal, suitable for professional audiences. Provide only the translation without additional explanation or context.';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const __dirname = path.resolve();
const inputDir = path.join(__dirname, 'content', 'posts');
const outputDir = path.join(__dirname, 'content', 'en-posts');

const translateFileToEnglish = async (inputFile, outputFile) => {
  // /content/posts 의 파일을 순회할 것이므로 inputFile 위치의 파일은 무조건 존재
  const inputContent = readFileSync(inputFile, 'utf-8');
  const outputDirPath = path.dirname(outputFile);

  if (!existsSync(outputDirPath)) {
    mkdirSync(outputDirPath, { recursive: true }); // 디렉토리가 없으면 생성한다
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: inputContent },
      ],
    });

    const translatedContent = completion.choices[0].message.content;
    const translateResourceUsage = completion.usage;
    console.log('Translate resource usage: ', translateResourceUsage);

    writeFileSync(outputFile, translatedContent);
    console.log(`Translated: ${inputFile} -> ${outputFile}`);
  }
  catch (error) {
    console.error(`Failed to translate ${inputFile}:`, error);
  }
};

// TODO: 다른 언어로의 번역도 지원할지도?
const translateAllFiles = async () => {
  const posts = readdirSync(inputDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const post of posts) {
    const inputFile = path.join(inputDir, post, 'index.md');
    const outputFile = path.join(outputDir, post, 'index.md');

    if (!existsSync(inputFile)) {
      console.warn(`Source file not found: ${inputFile}`);
      continue;
    }

    if (existsSync(outputFile)) {
      console.log(`Translation already exists: ${outputFile}`);
      continue;
    }

    await translateFileToEnglish(inputFile, outputFile);
  }
};

translateAllFiles().then(() => {
  console.log('Translation process completed.');
}).catch((error) => {
  console.error('An error occurred during the translation process:', error);
});
