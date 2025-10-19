# 🚨 성경 구절 변경 방법 (RLS 우회)

## 문제 상황
- Supabase RLS(Row Level Security) 정책 때문에 anon key로는 업데이트 불가
- 업데이트 명령은 성공하지만 실제로는 반영되지 않음

## ✅ 해결 방법 (2분 소요)

### 1단계: Supabase 대시보드 접속
1. https://supabase.com/dashboard 접속
2. 로그인
3. **포천중앙침례교회 프로젝트** 선택

### 2단계: SQL Editor 열기
1. 왼쪽 메뉴에서 **"SQL Editor"** 클릭
2. **"New query"** 버튼 클릭

### 3단계: SQL 복사-붙여넣기 및 실행
1. 아래 SQL 전체를 복사:

```sql
UPDATE sections
SET content = jsonb_set(
    jsonb_set(
        jsonb_set(
            content,
            '{verse}',
            '"해 돋는 곳에서부터 해 지는 곳까지 여호와의 이름이 찬양을 받으시리로다"'
        ),
        '{verseEn}',
        '"From the rising of the sun to its setting, the name of the LORD is to be praised."'
    ),
    '{verseReference}',
    '"시편 113:3"'
)
WHERE id = '7705b897-955f-41e4-af55-92233fb05395';

SELECT 
    content->>'verse' as "한글 구절",
    content->>'verseEn' as "영문 구절",
    content->>'verseReference' as "출처"
FROM sections
WHERE id = '7705b897-955f-41e4-af55-92233fb05395';
```

2. SQL Editor에 붙여넣기
3. **"RUN"** 버튼 클릭 (또는 Cmd+Enter)

### 4단계: 결과 확인
실행 후 다음과 같이 나와야 합니다:

| 한글 구절 | 영문 구절 | 출처 |
|---------|---------|------|
| 해 돋는 곳에서부터 해 지는 곳까지 여호와의 이름이 찬양을 받으시리로다 | From the rising of the sun to its setting, the name of the LORD is to be praised. | 시편 113:3 |

### 5단계: 웹사이트 확인
1. 브라우저에서 http://localhost:3000 새로고침 (Cmd+Shift+R로 강제 새로고침)
2. 성경 구절이 시편 113:3으로 변경된 것 확인!

---

## 🔐 왜 이렇게 해야 하나요?

Supabase의 **RLS(Row Level Security)** 정책이 활성화되어 있어서:
- **anon key**: 읽기만 가능 ✅ / 쓰기 불가 ❌
- **service_role key** 또는 **SQL Editor**: 읽기/쓰기 모두 가능 ✅✅

SQL Editor는 service_role 권한으로 실행되기 때문에 RLS를 우회할 수 있습니다.

---

## ❓ 문제가 계속되면?

1. **sections 테이블 RLS 확인**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'sections';
   ```

2. **RLS 정책 수정** (관리자 계정으로)
   ```sql
   -- UPDATE 허용 정책 추가
   CREATE POLICY "Allow anon update" ON sections
   FOR UPDATE TO anon
   USING (true)
   WITH CHECK (true);
   ```

---

이 방법으로 해결되지 않으면 알려주세요!

