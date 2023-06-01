const colors = [
    //18
    '#C8707E',
    '#E28FAD',
    '#EF84C1',
    '#E48E58',
    '#EDAA7D',
    '#F0C7AB',
    '#5AA08D',
    '#4C9211',
    '#A8C879',
    '#679FAE',
    '#AC99C1',
    '#96B1D0',
    '#C08863',
    '#ADA759',
    '#C8C2BD',
    '#65A8C4',
    '#668D3C',
    '#CAB0F1',
];
let dragTarget = null;

function 색추출기(colors) {
    const 랜덤값 = Math.floor(Math.random() * colors.length); // 0 ~ 17 //18을 대체해주기 위한 텍스트 = colors.length(colors.갯수)
    // const name = Math.floor(Math.random()); -----> 공식
    return colors[랜덤값];
}

document.querySelector('button').addEventListener('click', (e) => {
    // (새로운태그) P태그 속 글씨 넣어주기
    const text = document.querySelector('input').value;

    //local storage 저장 (객체상태로 저장)
    // 1) text : 할일 텍스트, 사용자 인풋에 적은 내용.
    // 2) category : todo, doing, done
    // 3) id : 중복되지 않는 유니크한 값(현재시간)
    const todo객체 = {};
    todo객체.text = document.querySelector('input').value;
    todo객체.category = 'todo';
    todo객체.id = Date.now();
    localStorage.setItem(todo객체.id, JSON.stringify(todo객체));

    //새로운 태그 생성
    const newTag = createTag(text, todo객체.id);
    document.querySelector('.todo').appendChild(newTag);

    //input 값 삭제 (초기화)
    document.querySelector('input').value = '';
});

const boxes = document.querySelectorAll('.box');
console.log(boxes);
boxes.forEach((box, i) => {
    box.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    box.addEventListener('drop', (e) => {
        e.currentTarget.appendChild(dragTarget);
        const todo = JSON.parse(localStorage.getItem(dragTarget.getAttribute('key')));
        todo.category = e.currentTarget.getAttribute('category');
        localStorage.setItem(todo.id, JSON.stringify(todo));
    });
});

function createTag(text, key) {
    // 새로운 P태그 요소를 생성
    const newTag = document.createElement('p');

    // (새로운태그) 변수로 받아오기
    newTag.innerHTML = text;

    // P 태그BOX의 랜덤 컬러 넣어주기
    newTag.style.backgroundColor = 색추출기(colors);
    newTag.setAttribute('draggable', 'true');

    // P태그요소의 dragstart 이벤트 함수
    newTag.addEventListener('dragstart', (e) => {
        dragTarget = e.currentTarget;
    });

    /***** 삭제버튼 생성 코드 - 시작 *****/
    const deleteBtn = document.createElement('span');
    deleteBtn.classList.add('delete');
    deleteBtn.innerHTML = 'X';

    // 삭제버튼의 클릭 이벤트함수
    deleteBtn.addEventListener('click', (e) => {
        e.currentTarget.parentElement.remove();
        const key = e.currentTarget.parentElement.getAttribute('key');
        localStorage.removeItem(key);
    });
    deleteBtn.style.float = 'right';
    newTag.appendChild(deleteBtn);
    /***** 삭제버튼 생성 코드 - 끝 *****/

    newTag.setAttribute('key', key);
    return newTag;
}

//화면 로딩시 딱 한번 호출되서 저장되었던 데이터를 화면에 표시해줌.
function display() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const todo = JSON.parse(localStorage.getItem(key));
        const color = 색추출기(colors);
        const newTag = createTag(todo.text, todo.id);
        document.querySelector(`.${todo.category}`).appendChild(newTag);
    }
}

display();
