const colors = [
    //18
    '#BAD7DF',
    '#FFE2E2',
    '#f8bbbb',
    '#E1ECE9',
    '#99DDCC',
    '#CBEBCE',
    '#CDF0EA',
    '#BEAEE2',
    '#EFE7D0',
    '#EED7A1',
    '#F2CEC2',
    '#D7878A',
    '#B6C4A0',
    '#7A8D9C',
    '#A9C7C5',
    '#82A3AC',
    '#FFB284',
    '#FFC98B',
];

let dragTarget = {};

function 색추출기(colors) {
    const 랜덤값 = Math.floor(Math.random() * colors.length); // 0 ~ 17 //18을 대체해주기 위한 텍스트 = colors.length(colors.갯수)
    // const name = Math.floor(Math.random()); -----> 공식
    return colors[랜덤값];
}

document.querySelector('button').addEventListener('click', e => {
    // (새로운태그) P태그 속 글씨 넣어주기
    const title = document.querySelector('.title').value;
    const text = document.querySelector('.text').value;
    const url = document.querySelector('.url').value;
    const color = 색추출기(colors);

    //local storage 저장 (객체상태로 저장)
    // 1) text : 할일 텍스트, 사용자 인풋에 적은 내용.
    // 2) category : todo, doing, done
    // 3) id : 중복되지 않는 유니크한 값(현재시간)
    const todo객체 = {};
    todo객체.title = title;
    todo객체.text = text;
    todo객체.url = url;
    todo객체.color = color;

    todo객체.category = 'todo';
    todo객체.id = Date.now();
    localStorage.setItem(todo객체.id, JSON.stringify(todo객체));

    //새로운 태그 생성
    const newTag = createTag(title, text, url, color, todo객체.id);
    document.querySelector('.todo').appendChild(newTag);

    //input 값 삭제 (초기화)
    document.querySelector('.title').value = '';
    document.querySelector('.text').value = '';
    document.querySelector('.url').value = '';
});

const boxes = document.querySelectorAll('.box');
console.log(boxes);
boxes.forEach((box, i) => {
    box.addEventListener('dragover', e => {
        e.preventDefault();
    });
    box.addEventListener('drop', e => {
        e.currentTarget.appendChild(dragTarget);
        const todo = JSON.parse(localStorage.getItem(dragTarget.getAttribute('key')));
        todo.category = e.currentTarget.getAttribute('category');
        localStorage.setItem(todo.id, JSON.stringify(todo));
    });
});

function createTag(title, text, url, color, key) {
    // 새로운 태그(newTag) 요소를 생성
    const newTag = document.createElement('div');
    newTag.style.backgroundColor = color;
    newTag.classList.add('div');

    const tit = document.createElement('h4');
    tit.textContent = title;
    newTag.appendChild(tit);
    tit.style.fontSize = '30px';
    tit.style.fontWeight = '700';

    const txt = document.createElement('p');
    txt.textContent = text;
    newTag.appendChild(txt);
    txt.classList.add('txt');

    //   const link = document.createElement("a");
    //   link.href = url;
    //   link.innerHTML = url;
    //   newTag.appendChild(link);
    //   link.classList.add("link");

    const link = document.createElement('a');
    link.href = url;
    if (url.startsWith('http://') || url.startsWith('https://')) {
        link.href = url;
    } else {
        // 기본값으로 설정할 링크
        link.href = '';
    }
    link.target = '_blank'; // 새 탭에서 열기
    //   link.addEventListener("click", (e) => {
    //     e.preventDefault(); // 기본 동작을 막음
    //     window.location.href = link.href; // 링크를 수동으로 처리하여 이동
    //   });

    link.innerHTML = url; // 링크 텍스트로 수정
    newTag.appendChild(link);
    link.classList.add('link');

    const time = document.createElement('p');
    time.innerHTML = new Date().toLocaleString();
    newTag.appendChild(time);
    time.classList.add('time');

    newTag.setAttribute('draggable', 'true');

    // P태그요소의 dragstart 이벤트 함수
    newTag.addEventListener('dragstart', e => {
        dragTarget = e.currentTarget;
    });

    /***** 삭제버튼 생성 코드 - 시작 *****/
    const deleteBtn = document.createElement('span');
    deleteBtn.classList.add('delete');
    // deleteBtn.innerHTML = 'X';
    deleteBtn.innerHTML = `<img src="delete.svg" alt="Delete">`;

    // 삭제버튼의 클릭 이벤트함수
    deleteBtn.addEventListener('click', e => {
        e.currentTarget.parentElement.remove();
        const key = e.currentTarget.parentElement.getAttribute('key');
        localStorage.removeItem(key);
    });
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
        const newTag = createTag(todo.title, todo.text, todo.url, todo.color, todo.id);
        document.querySelector(`.${todo.category}`).appendChild(newTag);
    }
}

display();
