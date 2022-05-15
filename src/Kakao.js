import React, { Component } from 'react';


class Kakao extends Component {
  

  componentDidMount() {

    window.Kakao.init('c452cde88c858e578906042615650624');

    window.Kakao.Link.createDefaultButton({
      container: '#kakao-link-btn',
      objectType: 'feed',
      content: {
        title: '딸기 치즈 케익',
        description: '#케익 #딸기 #삼평동 #카페 #분위기 #소개팅',
        imageUrl: 'http://mud-kage.kakao.co.kr/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png',
        link: {
          mobileWebUrl: 'https://cheonmro.github.io/',
          webUrl: 'https://cheonmro.github.io/'
        }
      },
      social: {
        likeCount: 286,
        commentCount: 45,
        sharedCount: 845
      },
      buttons: [
        {
          title: '웹으로 보기',
          link: {
            mobileWebUrl: 'https://cheonmro.github.io/',
            webUrl: 'https://cheonmro.github.io/'
          }
        },
        {
          title: '앱으로 보기',
          link: {
            mobileWebUrl: 'https://cheonmro.github.io/',
            webUrl: 'https://cheonmro.github.io/'
          }
        }
      ]
    });
  }

  onClickKakao = () => {
    window.open('https://sharer.kakao.com/talk/friends/picker/link')
  }

  render() {
      return (
        <div className="Kakao">

          <button id="kakao-link-btn" onClick={this.onClickKakao}>
            <img src={'17a6c40e90c37ca88.jpg'} alt="kakao" />
          </button>

        </div>
      );
  }
}

export default Kakao;