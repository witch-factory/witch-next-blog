
import { ImageResponse } from 'next/og';
 
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
 
    // ?title=<title>
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : '블로그 기본 제목';
  
 
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            backgroundColor: '#1f3b57',
            fontFamily: 'Arial, sans-serif',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '90%',
              height: '85%',
              padding: '40px',
              boxSizing: 'border-box',
              backgroundColor: '#FFFFFF',
              borderRadius: '32px',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              textAlign: 'start',
              position: 'relative',
              wordBreak: 'keep-all',
            }}
          ><h1
              style={{
                width: '80%',
                fontSize: '60px',
                color: '#1F2937',
                fontWeight: 'bold',
                margin: '0',
                lineHeight: '1.2',
              }}
            >
              {title}
            </h1>

            <div style={{ 
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              gap: '8px',
              marginTop: '24px',
            }}>
              <img width='80' height='80' src='https://witch.work/witch-new-hat.png' />
              <p
                style={{
                  fontSize: '40px',
                  fontWeight: 'bold',
                  color: '#1F2937',
                  lineHeight: '1.2',
                }}
              >Witch-Work</p>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response('Failed to generate the image', {
      status: 500,
    });
  }
}