# 웹 프로젝트 구조

## 📁 폴더 구조
```
web-project/
├── index.html          # 메인 페이지
├── css/
│   └── style.css       # 스타일시트
├── js/
│   └── app.js          # JavaScript 로직
├── data/
│   └── sample.txt      # 샘플 데이터
└── images/             # 이미지 폴더 (필요시 사용)
```

## 🚀 실행 방법

1. 터미널에서 프로젝트 폴더로 이동:
```bash
cd /home/claude/web-project
```

2. Python 웹서버 실행:
```bash
python3 -m http.server 8000
```

3. 브라우저에서 접속:
```
http://VM의IP:8000
```

## 📝 기능

- ✅ 데이터 목록 보기
- ✅ 새 데이터 추가
- ✅ 데이터 삭제
- ✅ 검색 기능
- ✅ 로컬 스토리지에 저장
- ✅ 반응형 디자인

## 💾 데이터 저장

현재는 브라우저의 localStorage를 사용합니다.
실제 txt 파일에 저장하려면 백엔드(Flask, Node.js 등)가 필요합니다.

## 🎨 커스터마이징

- `css/style.css`: 색상, 레이아웃 수정
- `js/app.js`: 기능 추가/수정
- `data/`: 데이터 파일 보관