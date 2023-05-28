interface BlogConfigType {
  name: string;
  title: string;
  description: string;
  picture: string;
  url: string;
  social: {
    Github: string;
    BOJ: string;
  },
  thumbnail: string;
}

const blogConfig: BlogConfigType = {
  name:'김성현(Sung Hyun Kim)',
  title:'Witch-Work',
  description:
    '서강대학교에서 기계공학과 컴퓨터공학을 복수전공하였습니다. ' +
    '흔히 `마녀`라는 닉네임을 씁니다. ' +
    '어떤 대단한 뜻을 품고 사는 사람은 아닙니다. ' +
    '그저 멋진 사람들이 내는 빛을 따라가다 보니 여기까지 왔고, ' +
    '앞으로도 그렇게 살 수 있었으면 좋겠다고 생각하는 사람입니다. ' +
    '이곳에 찾아오신 당신과도 함께할 수 있어 영광입니다.',
  picture:'/witch.jpeg',
  url:'https://witch.work/',
  social: {
    Github: 'https://github.com/witch-factory',
    BOJ: 'https://www.acmicpc.net/user/city'
  },
  thumbnail: '/witch.jpeg'
};

export default blogConfig;