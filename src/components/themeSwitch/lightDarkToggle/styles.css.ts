import { style, keyframes, createTheme } from '@vanilla-extract/css';

// https://unpkg.com/open-props/easings.min.css
export const [themeClass, vars] = createTheme({
  ease3:'cubic-bezier(.25,0,.3,1)',
  easeOut5:'cubic-bezier(0,0,0,1)',
  easeInOut5:'cubic-bezier(.9,0,.1,1)',
  easeElastic3:'cubic-bezier(.5,1.25,.75,1.25)',
  easeElastic4:'cubic-bezier(.5,1.5,.75,1.25)',
});


/* 애니메이션 정의 */
const rotate = keyframes({
  from:{
    transform:'rotate(0deg)'
  },
  to:{
    transform:'rotate(360deg)'
  }
});

const rotateMoon = keyframes({
  from:{
    transform:'rotate(0deg) scale(1.75)'
  },
  to:{
    transform:'rotate(-30deg) scale(1.75)'
  }
});

export const themeToggle = style({
  background:'none',
  border:'none',
  padding:0,

  inlineSize:'2rem',
  blockSize:'2rem',
  aspectRatio:'1',
  borderRadius:'50%',

  cursor:'pointer',
  /* 더 빠른 터치 반응 경험을 제공하도록 해준다 */
  touchAction:'manipulation',
  WebkitTapHighlightColor:'transparent',
  outlineOffset:'5px',

  vars:{
    '--icon-fill':'var(--textColor)',
    '--icon-fill-hover':'var(--infoTextColor)'
  },

  '@media':{
    '(hover:none)':{
      inlineSize:'2.5rem',
      blockSize:'2.5rem'
    }
  }
});

export const sunAndMoon = style({
  inlineSize:'100%',
  blockSize:'100%',
  strokeLinecap:'round'
});

/* transformOrigin: 애니메이션 동작의 중심 설정 */
export const sun = style({
  selectors:{
    [`${sunAndMoon} > &`]:{
      transformOrigin:'center center',
      fill:'var(--icon-fill)'
    },
    [`${themeToggle}:is(:hover, :focus-visible) > ${sunAndMoon} > &`]:{
      fill:'var(--icon-fill-hover)'
    },
    [`[data-theme^='dark'] ${sunAndMoon} > &`]:{
      transform:'scale(1.75)'
    }
  },

  '@media':{
    '(prefers-reduced-motion: no-preference)':{
      selectors:{
        [`${sunAndMoon} > &`]:{
          transition:`transform .5s ${vars.easeElastic3}`
        },

        [`[data-theme^='dark'] ${sunAndMoon} > &`]:{
          transform:'scale(1.75)',
          transition:`all .25s ${vars.ease3}`,
        }
      }
    },

    '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)':{
      selectors:{
        [`[data-theme^='dark'] ${sunAndMoon}:hover &`]:{
          animation:`${rotateMoon} 1s ease-in-out infinite`
        }
      }
    }
  }
});


export const moon = style({
  selectors:{
    [`${sunAndMoon} > &`]:{
      transformOrigin:'center center',
      fill:'var(--icon-fill)'
    },
    [`${themeToggle}:is(:hover, :focus-visible) > ${sunAndMoon} > &`]:{
      fill:'var(--icon-fill-hover)'
    }
  },

  '@media':{
    '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)':{
      selectors:{
        [`[data-theme^='dark'] ${sunAndMoon}:hover &`]:{
          animation:`${rotateMoon} 1s ease-in-out infinite`
        }
      }
    }
  }
});

export const sunBeams = style({
  selectors:{
    [`${sunAndMoon} > &`]:{
      transformOrigin:'center center',
      stroke:'var(--icon-fill)',
      strokeWidth:'1.5px'
    },

    [`${themeToggle}:is(:hover, :focus-visible) > ${sunAndMoon} > &`]:{
      stroke:'var(--icon-fill-hover)'
    },

    [`[data-theme^='dark'] ${sunAndMoon} > &`]:{
      opacity:0
    }
  },

  '@media':{
    '(prefers-reduced-motion: no-preference)':{
      selectors:{
        [`${sunAndMoon} > &`]:{
          transition:`transform .5s ${vars.easeElastic4}, opacity .5s ${vars.ease3}`
        },

        /* 애니메이션의 역동성을 위해 해로 전환될 때 약간의 회전을 부여한다 */
        [`[data-theme^='dark'] ${sunAndMoon} > &`]:{
          transform:'rotateZ(-25deg)',
          transitionDuration:'.15s'
        }
      }
    },

    '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)':{
      selectors:{
        [`${sunAndMoon}:hover > &`]:{
          animation:`${rotate} 1s ease-in-out infinite`
        }
      }
    }
  }
});


export const moonCircle = style({
  selectors:{
    [`[data-theme^='dark'] ${sunAndMoon} > ${moon} > &`]:{
      transform:'translateX(-7px)',
    },

    /* 달 아이콘을 위한 애니메이션 */
    [`${sunAndMoon} ${moon} > &`]:{
      transition:`transform .25s ${vars.easeInOut5}`
    }
  },
  
  '@media':{
    '(prefers-reduced-motion: no-preference)':{
      selectors:{
        [`[data-theme^='dark'] ${sunAndMoon} > ${moon} > &`]:{
          transitionDelay:'.25s',
          transitionDuration:'.5s',
        }
      }
    } 
  },

  '@supports':{
    '(cx: 1)':{
      selectors:{
        [`[data-theme^='dark'] ${sunAndMoon} > ${moon} > &`]:{
          transform:'translateX(0)',
          /* @ts-ignore */
          cx:17
        },

        [`${sunAndMoon} ${moon} > &`]:{
          transition:`cx .25s ${vars.easeOut5}`
        }
      }
    }
  }
});






