import { useScript } from "./hooks";
import { useEffect } from "react";

// 쓰지 않지만 kakao공유 버튼 할때 초기화에 중요 나중에 활용 바람

function KakaoShare() {

	// kakao SDK import하기
	const status = useScript("https://developers.kakao.com/sdk/js/kakao.js");
	
	// kakao sdk 초기화하기
	// status가 변경될 때마다 실행되며, status가 ready일 때 초기화를 시도합니다.
	useEffect(() => {
		if (status === "ready" && window.Kakao) {
			// 중복 initialization 방지
			if (!window.Kakao.isInitialized()) {
				// 두번째 step 에서 가져온 javascript key 를 이용하여 initialize
				window.Kakao.init('c452cde88c858e578906042615650624');
			}
		}
	}, [status]);	

}

export default KakaoShare;