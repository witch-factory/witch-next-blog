import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import OpenAI from 'openai';

const OPENAPI_API_KEY = '';

const systemPrompt = 'You are an expert technical translator. Your goal is to translate the given Korean technical documents into professional and accurate English. Ensure the translation is concise and formal, suitable for professional audiences. Provide only the translation without additional explanation or context.';

const openai = new OpenAI({
  apiKey: OPENAPI_API_KEY,
});

const __dirname = path.resolve();

const inputFile = path.join(__dirname, 'content', 'posts', 'binary-search', 'index.md');
const outputFile = path.join(__dirname, 'content', 'en-posts', 'binary-search', 'index.md');

const translateFile = async (inputFile, outputFile) => {
  if (!existsSync(inputFile)) {
    return;
  }

  const inputContent = readFileSync(inputFile, 'utf-8');

  // console.log(inputContent);

  const outputDir = path.dirname(outputFile);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true }); // Create the directory if it doesn't exist
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
    console.log(translateResourceUsage);

    writeFileSync(outputFile, translatedContent);
  }
  catch (error) {
    console.error(error);
  }
};

translateFile(inputFile, outputFile);
