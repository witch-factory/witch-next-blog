import { NextRequest, NextResponse } from 'next/server';

import { enPostMetadata, PostMetadata, postMetadata } from '#site/content';
import { Locale } from '@/types/i18n';

export const dynamic = 'force-static';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const filterThumbnail = ({ thumbnail, ...rest }: PostMetadata): Omit<PostMetadata, 'thumbnail'> => rest;

// /[lang]/api/language의 lang 동적 라우트 세그먼트를 통해서 언어 변경
export async function GET(request: NextRequest, { params }: {
  params: Promise<{ lang: Locale }>,
}) {
  const selectedLocale = (await params).lang;

  const metadata = (selectedLocale === 'ko' ? postMetadata : enPostMetadata).map(filterThumbnail);
  return NextResponse.json(metadata);
}
