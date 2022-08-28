# frontend

### 수정 시, 참고부분


routes.js : 17라인에 추가될 화면 경로 import 추가 / 
34라인에 추가되는 path, element 추가

NavConfig.js : 왼쪽메뉴에 화면 등록
추가되는 화면 정보 추가

src/pages 에 추가되는 화면 js 추가해서 작성 (ex : Auction.js)
테이블(그리드)조회일 경우에는 users.js 화면을 복사해서 사용

package.json 41번라인 dependencies 밑에 "axios": "^0.27.2" 추가

frontend(Auction.js) ==> axios API호출
```js
useEffect(() => {
axios.get('http://localhost:8084/auctions/searchAll')
.then(res => setInfo(res.data))
.catch(err => console.log(err));
}, [])
```

Backend CORS 설정 : Backend domain에 아래 파일 생성(WebConfig.java)
```java
package com.example.auction;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/*").allowedOrigins("http://localhost:3000").allowedMethods("");
  }
}
```
---

env 설정 관련 (local용)
---
#### 참고) [https://ongamedev.tistory.com/482?category=930835](https://ongamedev.tistory.com/482?category=930835)
```
개발, 테스트 및 라이브 환경에서 손쉽게 관리, 배포 할 수 있도록 환경 변수를 많이 사용합니다. 
React에서는 .env로 명명된 파일에서 'REACT_APP_'이라는 prefix가 붙은 key,value값을 기본적으로 읽어옵니다.
```

- env-cmd 설치
```
npm install env-cmd
```
- env.local 파일 생성 및 내용 추가 (예시)
```
REACT_APP_BACK_CATEGORY_URL=http://localhost:8082
```
- package.json 에 'local' alias 추가해두었으므로, 실행 시 아래 command 입력
```
npm run local
```
