import {visit} from 'unist-util-visit';

function addID(node, headings) {
  const id=node.children.map(c=>c.value).join('');
  headings[id]=(headings[id]||0)+1;
  node.data=node.data||{
    hProperties:{
      title:id,
      // id를 넣는 이유는 같은 제목의 heading이 여러 개 있을 수 있기 때문
      id:`${id}${(headings[id]>1?`-${headings[id]}`:'')}`
        .split(' ')
        .join('-')
    }
  };
}

function makeHeadingTree(node, output, depthMap) {
  const newNode={
    data:node.data,
    depth:node.depth,
    children:[],
  };
  // h1은 부모가 없다
  if (node.depth===1) {
    output.push(newNode);
    depthMap[node.depth]=newNode;
  }
  else {
    const parent=depthMap[node.depth-1];
    if (parent) {
      parent.children.push(newNode);
      depthMap[node.depth]=newNode;
    }
  }
}

function handleHeading(tree) {
  const headings={};
  const output=[];
  const depthMap={};
  visit(tree, 'heading', (node) => {
    addID(node, headings);
    makeHeadingTree(node, output, depthMap);
  });
  return output;
}

export default function headingTree() {
  return (tree, file)=>{
    file.data.rawDocumentData.headingTree=handleHeading(tree);
  };
}