# 📌 할 일(Todo) 관리하기

![완성 예시](./screenshots/ss1.png)
![완성 예시](./screenshots/ss2.png)

주어진 API를 활용해 '[완성 예시]()' 처럼 할 일(Todo) 관리 기능을 구현합니다!  


## API

모든 요청은 다음 Headers 정보가 필수로 포함돼야 합니다.   
`<APIKEY>`와 `<USERNAME>` 정보는 별도 제공합니다.

```curl
curl <ENDPOINT>
  \ -X <METHOD>
  \ -H 'content-type: application/json'
  \ -H 'apikey: <APIKEY>'
  \ -H 'username: <USERNAME>'
```

- 현재 예제에서는 '할 일 목록 순서 변경' API와 `order` 속성을 사용하지 않았습니다.   


### 할 일 목록 조회

전체 할 일 목록을 조회합니다.

```curl
curl https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos
  \ -X 'GET'
```

__요청 데이터 타입 및 예시:__

- N/A

__응답 데이터 타입 및 예시:__

```ts
type ResponseValue = Todo[] // 할 일 목록

interface Todo {
  id: string // 할 일 ID
  order: number // 할 일 순서
  title: string // 할 일 제목
  done: boolean // 할 일 완료 여부
  createdAt: string // 할 일 생성일
  updatedAt: string // 할 일 수정일
}
```

```json
[
  {
    "id": "mnIwaAPIAE1ayQmqekiR",
    "order": 0,
    "title": "JS 공부하기",
    "done": false,
    "createdAt": "2021-10-28T05:18:51.868Z",
    "updatedAt": "2021-10-28T05:18:51.868Z"
  },
  {
    "id": "tMzPImGoWtRdJ6yyVv2y",
    "order": 1,
    "title": "과제 PullRequest(PR) 생성",
    "done": true,
    "createdAt": "2021-10-28T04:16:53.980Z",
    "updatedAt": "2021-10-28T09:40:17.955Z"
  },
  {
    "id": "Rq8BebKihCgteHHhMIRS",
    "order": 2,
    "title": "API 스터디",
    "done": false,
    "createdAt": "2021-10-28T04:17:02.510Z",
    "updatedAt": "2021-10-28T04:17:02.510Z"
  }
]
```


### 할 일 항목 추가

할 일 항목을 새롭게 추가합니다.

```curl
curl https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos
  \ -X 'POST'
```

__요청 데이터 타입 및 예시:__

```ts
interface RequestBody {
  title: string // 할 일 제목
  order?: number // 할 일 순서
}
```

```json
{
  "title": "KDT 과정 설계 미팅"
}
```

__응답 데이터 타입 및 예시:__

```ts
interface ResponseValue {
  id: string
  order: number
  title: string
  done: boolean
  createdAt: string
  updatedAt: string
}
```

```json
{
  "id": "7P8dOM4voAv8a8cfoeKZ",
  "order": 0,
  "title": "KDT 과정 설계 미팅",
  "done": false,
  "createdAt": "2021-10-29T07:20:02.749Z",
  "updatedAt": "2021-10-29T07:20:02.749Z"
}
```


### 할 일 항목 수정

특정 할 일 항목을 수정합니다.

```curl
curl https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/:todoId
  \ -X 'PUT'
```

__요청 데이터 타입 및 예시:__

```ts
interface RequestBody {
  title: string // 할 일 제목
  done: boolean // 할 일 완료 여부
  order?: number // 할 일 순서
}
```

```json
{
  "title": "Bootstrap 스타일 추가",
  "done": false
}
```

__응답 데이터 타입 및 예시:__

```json
{
  "id": "7P8dOM4voAv8a8cfoeKZ",
  "title": "Bootstrap 스타일 추가",
  "done": false,
  "order": 2,
  "createdAt": "2021-10-29T07:20:02.749Z",
  "updatedAt": "2021-10-29T07:20:02.749Z"
}
```


### 할 일 항목 삭제

특정 할 일 항목을 삭제합니다.

```curl
curl https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/:todoId
  \ -X 'DELETE'
```

__요청 데이터 타입 및 예시:__

- N/A

__응답 데이터 타입 및 예시:__

```ts
type ResponseValue = true // 정상 응답
```


### 할 일 항목 일괄 삭제

```curl
curl https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/deletions
  \ -X 'DELETE'
```

__요청 데이터 타입 및 예시:__

```ts
interface RequestBody {
  todoIds: string[] // 삭제할 할 일 ID 목록
}
```

```json
{
  "todoIds": [
    "mnIwaAPIAE1ayQmqekiR",
    "tMzPImGoWtRdJ6yyVv2y",
    "GHrvr3LaPx1g7y2sNuaC",
    "Rq8BebKihCgteHHhMIRS"
  ]
}
```

__응답 데이터 타입 및 예시:__

```ts
type ResponseValue = true // 정상 응답
```


### 할 일 목록 순서 변경

할 일 목록의 순서를 변경합니다.  

```curl
curl https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/reorder
  \ -X 'PUT'
```

__요청 데이터 타입 및 예시:__

```ts
interface RequestBody {
  todoIds: string[] // 새롭게 정렬할 할 일 ID 목록
}
```

```json
{
  "todoIds": [
    "mnIwaAPIAE1ayQmqekiR",
    "tMzPImGoWtRdJ6yyVv2y",
    "GHrvr3LaPx1g7y2sNuaC",
    "Rq8BebKihCgteHHhMIRS"
  ]
}
```

__응답 데이터 타입 및 예시:__

```ts
type ResponseValue = true // 정상 응답
```
