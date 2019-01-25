App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    $.getJSON('../real-estate.json', function(data) {
      var list = $('#list');
      var template = $('#template');

      for (i = 0; i < data.length; i++) {
        template.find('img').attr('src', data[i].picture);
        template.find('.id').text(data[i].id);
        template.find('.type').text(data[i].type);
        template.find('.area').text(data[i].area);
        template.find('.price').text(data[i].price);

        list.append(template.html());
      }
    })
    return App.initWeb3(); //init 함수의 역할이 끝나면 아래 함수를 불러옴
  },

  initWeb3: function() {
    if (typeof web3 ! == 'undefined'){
      //브라우저에 메타마스크가 안깔려 있을 때
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new web3.provider.HttpProvider('http://localhost:3845');
      web3 = new Web3(App.web3Provider);
      // 로컬 공급자로부터 정보를 가져와서 저장시킴
    }
    return App.initContract();
  // dapp에 web3 인스턴스가 활성화 되어 있느지 확인함
  },

  initContract: function() {
    //truffleContract.js
    // 아티팩트 파일은 abi 정보와 컨트랙트와 배포된 주소를 가지고 있음
    $.getJSON('RealEstate.json', function(data){
      App.contracts.RealEstate = TruffleContract(data);
      //Truffle 컨트랙트에 정보를 넘겨 인스턴스화 시킴
      App.contracts.RealEstate.setProvider(App.web3Provider);
    })

  },

  buyRealEstate: function() {

  },

  loadRealEstates: function() {

  },

  listenToEvents: function() {

  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
