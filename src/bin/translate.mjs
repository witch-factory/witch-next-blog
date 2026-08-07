import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { generateText } from 'ai';
import { gateway } from 'ai';

const systemPrompt = `You are an expert technical translator specializing in software engineering and web development. Translate the given Korean technical blog post into clear, natural English that reads as if originally written in English.

## Translation Rules

### Frontmatter (YAML between --- delimiters)
- Translate "title" and "description" fields only.
- Keep "date", "tags", and all other fields exactly as-is.

### Title Formatting
- Do not use a colon (:) in the title.
- Only use hyphens (-) or commas (,) if necessary.

### Markdown Structure
- Preserve all markdown syntax exactly: headings (#), lists, bold/italic, links, images, tables, etc.
- Keep all file paths, URLs, and image references unchanged.
- Keep HTML tags unchanged.

### Code
- Do NOT translate anything inside code blocks (\`\`\`) or inline code (\`).
- Do NOT translate variable names, function names, class names, or any code identifiers in the prose.
- Keep all code comments in their original language unless they are part of the explanation.

### Style
- Use a professional yet approachable tone, suitable for a developer blog.
- Prefer precise technical terms over vague paraphrases (e.g., "closure" not "function wrapper concept").
- Keep sentences concise. Avoid filler or overly formal phrasing.
- When a Korean expression has no direct English equivalent, convey the intended meaning naturally rather than translating literally.

Output only the translated document. No explanations or notes.`;

const __dirname = path.resolve();

const translateFileToEnglish = async (inputFile, outputFile) => {
  // /content/posts 의 파일을 순회할 것이므로 inputFile 위치의 파일은 무조건 존재
  const inputContent = readFileSync(inputFile, 'utf-8');
  const outputDirPath = path.dirname(outputFile);

  if (!existsSync(outputDirPath)) {
    mkdirSync(outputDirPath, { recursive: true }); // 디렉토리가 없으면 생성한다
  }

  try {
    const { text, usage, finishReason, warnings } = await generateText({
      model: gateway('openai/gpt-5.4'),
      system: systemPrompt,
      prompt: inputContent,
      maxRetries: 2,
      providerOptions: {
        openai: {
          textVerbosity: 'low',
        },
      },
    });

    if (finishReason !== 'stop') {
      throw new Error(`Translation truncated: ${inputFile}`);
    }

    if (warnings?.length) {
      console.warn('AI SDK warnings:', warnings);
    }

    console.log('Translate resource usage: ', usage);

    writeFileSync(outputFile, text);
    console.log(`Translated: ${inputFile} -> ${outputFile}`);
  }
  catch (error) {
    console.error(`Failed to translate ${inputFile}:`, error);
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 비동기 작업을 배치로 나누어 처리하고 배치 사이에 딜레이를 추가하는 함수
 * @param {Array<Function>} tasks - 실행할 비동기 작업이 담긴 프로미스를 리턴하는 함수들의 배열
 * @param {number} batchSize - 한 번에 실행할 작업 수
 * @param {number} delayMs - 배치 간 대기 시간 (밀리초 단위)
 */
const processInBatches = async (tasks, batchSize, delayMs) => {
  const results = [];
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(tasks.length / batchSize)}...`);

    // 배치 내 모든 작업 실행
    const batchResult = await Promise.allSettled(batch.map((task) => task()));
    results.push(...batchResult);

    // 마지막 배치가 아니면 딜레이 추가
    if (i + batchSize < tasks.length) {
      console.log(`Waiting for ${delayMs / 1000} seconds before next batch...`);
      await delay(delayMs);
    }
  }
  return results;
};

const translateAllFiles = async () => {
  const inputDir = path.join(__dirname, 'content', 'posts');
  const outputDir = path.join(__dirname, 'content', 'en-posts');

  const posts = readdirSync(inputDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const translationPromises = posts.map((post) => {
    const inputFile = path.join(inputDir, post, 'index.md');
    const outputFile = path.join(outputDir, post, 'index.md');

    if (!existsSync(inputFile)) {
      console.warn(`Source file not found: ${inputFile}`);
      return null; // Skip missing files
    }

    if (existsSync(outputFile)) {
      console.log(`Translation already exists: ${outputFile}`);
      return null; // 이미 번역된 파일은 스킵
      // 새로 번역이 필요할 경우 수동 관리
    }
    console.log(`Need Translation: ${inputFile} -> ${outputFile}`);
    return () => translateFileToEnglish(inputFile, outputFile);
  }).filter(Boolean);

  const results = await processInBatches(translationPromises, 10, 10000);

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Translation failed for post ${posts[index]}:`, result.reason);
    }
    else {
      console.log(`Translation completed for post ${posts[index]}`);
    }
  });
};

translateAllFiles().then(() => {
  console.log('Translation process completed.');
}).catch((error) => {
  console.error('An error occurred during the translation process:', error);
});
