import styles from './theme.module.css';

function SunAndMoonIcon() {
  {/* aria-hidden은 스크린 리더가 이를 무시하게 한다. 아이콘은 그냥 시각적인 장식이니까
  그리고 stroke는 선 색깔이다 */}
  return (
    <svg className={styles.sunAndMoon} aria-hidden='true' width='24' height='24' viewBox='0 0 24 24'>
      <circle className={styles.sun} cx='12' cy='12' r='6' mask='url(#moonMask)' fill='currentColor'/>
      <g className={styles.sunBeams} stroke='currentColor'>
        <line x1='12' y1='1' x2='12' y2='3' />
        <line x1='12' y1='21' x2='12' y2='23' />
        <line x1='4.22' y1='4.22' x2='5.64' y2='5.64' />
        <line x1='18.36' y1='18.36' x2='19.78' y2='19.78' />
        <line x1='1' y1='12' x2='3' y2='12' />
        <line x1='21' y1='12' x2='23' y2='12' />
        <line x1='4.22' y1='19.78' x2='5.64' y2='18.36' />
        <line x1='18.36' y1='5.64' x2='19.78' y2='4.22' />
      </g>
      <mask className={styles.moon} id='moonMask'>
        <rect x='0' y='0' width='100%' height='100%' fill='white' />
        <circle cx='24' cy='10' r='6' fill='black' />
      </mask>
    </svg>
  );
}

export default SunAndMoonIcon;