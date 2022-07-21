# frontend

수정 시, 참고부분

router.js : 11라인에 추가될 화면 경로 import 추가
27라인에 추가되는 path, element 추가

NavConfig.js : 왼쪽메뉴에 화면 등록
44라인에 추가되는 화면 정보 추가

src/pages 에 추가되는 화면 js 추가해서 작성 (ex : Auction.js)
테이블(그리드)조회일 경우에는 users.js 화면을 복사해서 사용

package.json 41번라인 dependencies 밑에 "axios": "^0.27.2" 추가

frontend(Auction.js) ==> axios API호출
useEffect(() => {
axios.get('http://localhost:8084/auctions/searchAll')
.then(res => setInfo(res.data))
.catch(err => console.log(err));
}, [])

Backend CORS 설정 : Backend domain에 아래 파일 생성(WebConfig.java)

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
