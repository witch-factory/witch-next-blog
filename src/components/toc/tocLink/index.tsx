'use client';

import { useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';

import styles from './styles.module.css';

interface ContentType{
  data: {
    hProperties: {
      id: string;
      title: string;
    }
  };
  depth: number;
  children: ContentType[];
}

function useHighLight(): [string, Dispatch<SetStateAction<string>>] {
  const observer = useRef<IntersectionObserver>();
  const [activeID, setActiveID] = useState<string>('');

  useEffect(()=>{
    // 변화가 나타나면 실행되는 콜백 함수
    const handleObserver = (entries: IntersectionObserverEntry[])=>{
      entries.forEach((entry)=>{
        if (entry.isIntersecting) {
          setActiveID(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: '0px 0px -40% 0px',
    });

    const elements = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
    elements.forEach((element)=>observer.current?.observe(element));
    return ()=>observer.current?.disconnect();
  }, []);

  return [activeID, setActiveID];
}

function TOCLink({ node }: {node: ContentType}) {
  const id = node.data.hProperties.id;
  const [activeID, setActiveID] = useHighLight();
  return (
    <a
      className={`${styles.link} ${activeID === id ? styles.link__active : ''}`}
      href={`#${node.data.hProperties.id}`}
      onClick={()=>setActiveID(id)}
    >
      {node.data.hProperties.title}
    </a>
  );
}

export default TOCLink;