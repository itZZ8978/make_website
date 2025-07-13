// 웹페이지가 처음 실행될 때 불리는 함수
function initialize() {
    firstpage('home.html');   // 첫 화면에 home.html 불러오기
    openPopup();              // 팝업 창 열기
}

// 팝업 창 띄우기 위한 좌표 계산
const b_left = window.screenX;       // 브라우저 창의 왼쪽 위치
const b_top = window.screenY;        // 브라우저 창의 위쪽 위치
const p_left = b_left + 100;         // 팝업창 왼쪽 위치 (브라우저보다 오른쪽으로 100px)
const p_top = b_top + 100;           // 팝업창 위쪽 위치 (브라우저보다 아래쪽으로 100px)

// 공지사항 팝업 열기
function openPopup() {
    let newWin = window.open('notice.html', 'pop', `width=500,height=400,left=${p_left},top=${p_top}`);  
    // 새로운 팝업창 열기 (너비 500, 높이 400)

    if (newWin == null) {
        // 팝업이 차단된 경우 경고창 띄우기
        alert("팝업이 차단되었습니다. 팝업 차단을 해제해 주세요.");
    }
}

// fetch를 사용해서 페이지 내용을 불러오는 함수 (비동기 방식)
async function loadPage(page) {
    try {
        const response = await fetch(page);  // 지정된 페이지 파일 요청

        if (!response.ok) {
            // 응답이 실패하면 에러 발생
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();  // 받아온 응답을 텍스트로 변환

        // 받아온 HTML 중에서 body 부분만 추출하기
        const parser = new DOMParser();              // HTML 분석기
        const doc = parser.parseFromString(html, 'text/html');  // HTML 구조로 파싱
        const bodyContent = doc.body.innerHTML;      // body 안쪽 내용만 추출

        // 페이지의 #content 영역에 새 콘텐츠 삽입
        document.getElementById('content').innerHTML = bodyContent;

        // 새로 불러온 페이지 안의 <script>도 실행되게 하기
        executeScripts();

    } catch (error) {
        // 페이지 로딩 중 문제가 생긴 경우
        console.error('페이지 로딩 중 오류 발생:', error);
        document.getElementById('content').innerHTML =
            '<div style="padding: 50px; text-align: center;"><h2>페이지를 불러올 수 없습니다.</h2><p>잠시 후 다시 시도해주세요.</p></div>';
    }
}

// 첫 페이지 불러오기 함수 (처음 진입 시 사용)
function firstpage(page) {
    loadPage(page);  // 지정된 페이지를 불러옴
}

// 새로 불러온 HTML 안의 <script> 태그 실행하기
function executeScripts() {
    const scripts = document.getElementById('content').getElementsByTagName('script');
    
    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        const newScript = document.createElement('script'); // 새로운 스크립트 태그 생성

        if (script.src) {
            newScript.src = script.src;       // 외부 JS 파일이면 src 복사
        } else {
            newScript.innerHTML = script.innerHTML; // 내부 코드면 내용 복사
        }

        document.head.appendChild(newScript);      // 실행을 위해 <head>에 추가
        document.head.removeChild(newScript);      // 실행 후 제거 (중복 방지)
    }
}





