* 이 문서는 <엔지니어를 위한 블록체인 프로그래밍>이라는 책의 소스코드를 공부한 문서입니다.
* 문제 시 바로 삭제하겠습니다.

# Locktime 필드
* Locktime은 거래가 어떤 시점까지 잠기도록 하는 필드이다.
* 부호 없는 정수를 값으로 가지며, 일반적으로 0으로 설정된다.
* 값이 0이라면 거래가 잠기지 않고 바로 네트워크에 전파되어 블록에 저장된다.
* 그러나 만약 A가 B에게 넘겨준 출력을 B가 거래가 성사되기 전에 사용해비러면 거래 자체가 무효가 된다.
* 이 문제를 해결하기 위해 CLTV가 도입되었음.
* Locktime은 거래 수준에서 유효성이 시작되는 시점을 제어하는 것인데 CLTV는 거래 출력(?) 단위로 유효성 시작 시점을 제어한다.

# 모금 예제
```solidity
pragma solidity ^0.4.11;

contract CrowdFunding {

  structure Investor {
    address addr;
    unit amount;
  }

  address public owner;
  unit public numInvestors;
  unit public status;
  bool public ended; //모집 종료 여부
  unit public goalAmount;
  unit public totalAmount;
  mapping(unit => Investor) public investors;

  modifier onlyOwner(){
    require (msg.sender == owner);
    _;
  }
  //생성자
  function CrowdFunding(uint _duration, uint _goalAmount) {
    owner = msg.sender;

    //마감일 설정
    deadline = now + _duration;
    goalAmount = _goalAmount;
    status = "Funding";
    ended = false;

    numInvestors = 0;
    totalAmount = 0;
  }

  function fund() payable {
    require (!ended);

    Investor inv = investors[numInvestors++];
    inv.addr = msg.sender;
    inv.amount = msg.value;
    totalAmount += inv.amount;

  }

  function checkGoalReached() public onlyOwner{
    require(ended);

    require(now >= deadline);

    if(totalAmount >= goalAmount){
      //모금 성공인 경우
      status = "Campaign Succeeded"
      ended = true;
      if(!owner.send(thisbalance)) {
        throw;
      }else {
        uint i = 0;
        status = "Campaign Failed"
        ended = true;

        while(i<= numInvestors){
          if(investors[i].addr.send(investors[i].amount)) {
            throw;
          }
          i++;
        }
      }
    }

    function kill() public onlyOwner{
      selfdestruct(owner);
    }
}
```

* mapping : key와 value쌍으로 이루어진 데이터를 나타내는 구조이다. 여기서 key는 uint 타입, value는 구조체 Investor 타입이라 선언하고 있음.
