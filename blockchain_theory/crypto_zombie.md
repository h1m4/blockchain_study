# 크립토 좀비

> 이것은 크립토 좀비를 통해 솔리디티의 기초를 공부한 내용 정리이다. 이 문서를 보는 것보다 [크립토 좀비](https://cryptozombies.io/ko/) 한 판 깨는 것이 더 알기 쉬울 것임.

## 챕터1


* prigma solidity는 반드시 입력해야 한다. 블록체인 분야는 업데이트가 매우 빨리되기 때문에 호환되지 않는 경우가 있을 수 있다.

```go
pragma solidity ^버전입력

contract HelloWorld { // 모든 함수와 변수는 이 안에 입력된다.
}
```

* 상태변수의 생성


```go

uint myUnsignedInteger = 100;

```

* 구조체 : 여러 특성을 가진 복잡한 자료형을 생성할 수 있다.


```go
struct Person{
    uint age;
    string name;
}
```

* 배열

   정적배열 : uint[2] fixedArray;
   동적배열 : uint[] (public넣으면 public배열됨) dynamicArray;
<br>
* 함수선언

```go
function eatHamburger(string _name, uint _amount){
}

```

* 함수호출

```go

eatHamburger ("eat", 100);
```

* 구조체에 배열 추가하기

```go
Person satoshi = Person(172, "satoshi"); //넣을 값 생성
people.push(satoshi) // people 배열에 satoshi 추가

```

* public과 private

  private함수의 경우 제목을 언더바로 시작한다.
```go

function _addArray(uint _number) private {

}
```

* 함수의 반환
반환값과 자료형을 함께 적어야 함
```go

function sayHello() public returns (string){}

```
* view : 솔리디티의 상태로 변화시키기 않음. 데이터를 보기만 함
* pure : 앱에서 어떤 데이터도 접근하지 않음. 읽지도 않음. 반환값을 돌려줄 때 사용함.
<br>

* 이벤트

```go
event IntegerAdded(uint x, uint y, uint result);
function{//이벤트가 실행되는 걸 여기에 쓴다
IntegerAdded(_x, _y, result);
}

```

전역변수와 구분하기 위해 지역변수에는 언더바를 쓴다.(약속)

## 챕터 2

### 매핑과 주소
<br>
* 주소 : 계정이 가지는 고유 식별자(: 주소는 특정 개인 또는 스마트 컨트랙트가 소유한다)
매핑: 솔리디티에서 구조화된 데이터를 저장하는 또다른 방법 (구조체나 배열처럼)

```go
mapping (address => uint) public accountBalance;
```

매핑은 key와 value값 저장소.
예시에서의 key는 address value는 uint

* Msg.sender
msg.sender : 현재 함수를 호출한 사람 (혹은 스마트 컨트랙트)의 주소를 가리킴

```go
mapping (address => uint) favoriteNumber;

function setMyNumber(uint _myNumber) public {
  // `msg.sender`에 대해 `_myNumber`가 저장되도록 `favoriteNumber` 매핑을 업데이트한다 `
  favoriteNumber[msg.sender] = _myNumber;
  // ^ 데이터를 저장하는 구문은 배열로 데이터를 저장할 떄와 동일하다
}
function whatIsMyNumber() public view returns (uint) {
  // sender의 주소에 저장된 값을 불러온다
  // sender가 `setMyNumber`을 아직 호출하지 않았다면 반환값은 `0`이 될 것이다
  return favoriteNumber[msg.sender];
```

>먼저, 새로운 좀비의 id가 반환된 후에 zombieToOwner 매핑을 업데이트하여 id에 대하여 msg.sender가 저장되도록 해보자.<br>
그 다음, 저장된 msg.sender을 고려하여 ownerZombieCount를 증가시키자.

에 대한 답 >>


```go
zombieToOwner[id] = msg.sender;
ownerZombieCount[msg.sender]++;
```
<br>
### require

함수에 조건을 붙여서 무한정 좀비가 생성되지 않게 한다. (실제로는 블록 생성 속도를 제한하기 위해서 사용되는 걸까?)

* require 키워드를 createRandomZombie 앞부분에 입력한다.<br> require 함수가 ownerZombieCount[msg.sender]이 0과 같은지 확인하도록 하고,<br> 0이 아닌 경우 에러 메시지를 출력하도록 한다

```go

require(ownerZombieCount[msg.sender] == 0);

```


* 상속

코드가 길어짐에 따라 contract를 분할해야 할 때가 있다. 그 때 상속을 사용!

```go

contract BabyThing is Thing{
}

```

* import

./ 동일한 폴더에 있다는 의미

```go

import "./someothercontract.sol";
```
<br>
### Storage vs Memory

* 변수를 memory와 storage에 저장할 수 있음!
* storage : 영구적으로  저장하는 공간 = 하드디스크
* memory : 임시적으로 저장하는 공간 = RAM



```go

contract SandwichFactory {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    // Sandwich mySandwich = sandwiches[_index];

    // ^ 꽤 간단해 보이나, 솔리디티는 여기서
    // `storage`나 `memory`를 명시적으로 선언해야 한다는 경고 메시지를 발생한다.
    // 그러므로 `storage` 키워드를 활용하여 다음과 같이 선언해야 한다:
    Sandwich storage mySandwich = sandwiches[_index];
    // ...이 경우, `mySandwich`는 저장된 `sandwiches[_index]`를 가리키는 포인터이다.
    // 그리고
    mySandwich.status = "Eaten!";
    // ...이 코드는 블록체인 상에서 `sandwiches[_index]`을 영구적으로 변경한다.

    // 단순히 복사를 하고자 한다면 `memory`를 이용하면 된다:
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ...이 경우, `anotherSandwich`는 단순히 메모리에 데이터를 복사하는 것이 된다.
    // 그리고
    anotherSandwich.status = "Eaten!";
    // ...이 코드는 임시 변수인 `anotherSandwich`를 변경하는 것으로
    // `sandwiches[_index + 1]`에는 아무런 영향을 끼치지 않는다. 그러나 다음과 같이 코드를 작성할 수 있다:
    sandwiches[_index + 1] = anotherSandwich;
    // ...이는 임시 변경한 내용을 블록체인 저장소에 저장하고자 하는 경우이다.
  }
}
```

***note : 좀비 주인이 msg.sender과 같아야 한다.***

```go

       require(msg.sender == zombieToOwner[_zombieId]);
       Zombie storage myZombie = zombies[_zombieId];

```

 * 좀비 dna

 ```go

     _targetDna = _targetDna % dnaModulus;
    uint newDna = (myZombie.dna + _targetDna)/2;
    _createZombie("NoName", newDna);
````


 ### 함수제어 접근자 더 알아보기


* internal은 함수가 정의된 컨트랙트를 상속하는 컨트랙트에서도 접근이 가능하다 그 외에는 private와 같다.

* external은 함수가 컨트랙트 바깥에서만 호출될 수 있고 컨트랙트 내의 다른 함수에 의해 호출될 수 없다는 점을 제외하면 public과 동일하다.

private/public과 선언 방법은 동일하다.


 *  좀비가 무엇을 먹나요?

인터페이스 정의 = 컨트랙스 생성과 비슷하다..
다른 컨트랙트와 상호작용하고자 하는 함수만을 선언할 뿐 다른 함수나 상태 변수를 언급하지 않는다.


 * 인터페이스 활용하기


 ```go

 ontract MyContract {
  address NumberInterfaceAddress = 0xab38...
  // ^ 이더리움상의 FavoriteNumber 컨트랙트 주소이다
  NumberInterface numberContract = NumberInterface(NumberInterfaceAddress)
  // 이제 `numberContract`는 다른 컨트랙트를 가리키고 있다. >>

  function someFunction() public {
    // 이제 `numberContract`가 가리키고 있는 컨트랙트에서 `getNum` 함수를 호출할 수 있다:
    uint num = numberContract.getNum(msg.sender);
    // ...그리고 여기서 `num`으로 무언가를 할 수 있다
  }
}
```


 * 다수의 반환값 처리하기


 ```go

     (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
     // 이 함수는 _kittyID를 전달하여 kittyContract.getKitty 함수를 호출하고 genes을 kittyDna에 저장해야 한다
     feedAndMultiply(_zombieId, kittyDna);
 ```


마지막 값에 관심이 있을 경우 앞에는 쉼표처리.


 ```go

 // 혹은 단 하나의 값에만 관심이 있을 경우:
function getLastReturnValue() external {
  uint c;
  // 다른 필드는 빈칸으로 놓기만 하면 된다:
  (,,c) = multipleReturns();
}
```

## 챕터 3

### 컨트랙트의 불변성

이더리움에 컨트랙트를 배포하고 나면, 컨트랙트는 변하지 않는다(Immutable). 컨트렉트를 수정하거나 업데이트 할 수 없게 된다. 컨트랙트로 배포한 최초의 코드는 항상, 블록체인에 영구적으로 존재하기 때문에 만든 사람 조차도 수정 불가능하다!
DApp의 중요한 일부를 수정할 수 있도록 하는 함수를 만들어놓는 것이 합리적이다.

```go

 KittyInterface kittyContract;

 function setKittyContractAddress(address _address) external {
   kittyContract = KittyInterface(_address);
 }
 ```

 external이기 때문에 이 함수를 누구나 호출할 수 있다.(보안상의 문제)

 ### 소유기능

 컨트렉스에서 이 주소를 바꿀 수 있게 하고 싶지만 주소를 아무나 업데이트하게 하고 싶지 않을 때 사용! (프로젝트 : 오픈제플린을활용한 dapp 개발)



```go

contract Ownable {
 address public owner;
 event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

 /**
  * @dev The Ownable constructor sets the original `owner` of the contract to the sender
  * account.
  */
 function Ownable() public {
   owner = msg.sender;
 }

 /**
  * @dev Throws if called by any account other than the owner.
  */
 modifier onlyOwner() {
   require(msg.sender == owner);
   _;
 }

 /**
  * @dev Allows the current owner to transfer control of the contract to a newOwner.
  * @param newOwner The address to transfer ownership to.
  */
 function transferOwnership(address newOwner) public onlyOwner {
   require(newOwner != address(0));
   OwnershipTransferred(owner, newOwner);
   owner = newOwner;
 }
}
```

* function Ownable() : 생성자, 컨트랙트가 생성될 때 딱 한 번만 실행된다.
* midifier onlyOwner() : 제어자, 함수 실행 전 요구사항 충족 여부를 확인하는데 사용된다.

```go

 function setKittyContractAddress(address _address) external onlyOwner{
   kittyContract = KittyInterface(_address);
 }
```

### 가스압축


구조체 안에 여러 개의 uint를 만든다면, 가능한 더 작은 크기의 uint를 쓰면,
솔리디티에서 그 변수들을 더 적은 공간을 차지하도록 압축함.
동일한 데이터 타입의 경우 하나의 필드로 묶어두는 것이 좋음.

 ### time uints

좀비가 다시 공격할 때까지 기다려야 하는 시간을 측정하기 위해 솔리디티의 시간 단위(Time units)를 사용
(초 단위 uint 숫자로 변환!)

* _; : 함수의 나머지 내용을 실행하게 해준다!

### view 함수
 * view 함수는 가스를 소모하지 않는다.
 *블록체인 상에서 어떤 수정도 이루어지지 않고 데이터를 읽기만 한다. 그러므로 트랜잭션을 생성하지 않음. (트랜잭션은 개별 노드에서 실행, 트랜잭션이 생성됨)
 * 동일 컨트랙트 내의 view함수가 아닌 다른 함수에서 내부적으로 호출된 경우 가스 소모함.
 * 외부에서 호출됬을 때만 무료임!

 ### storage는 비싸다! (why view)

 데이터의 일부를 쓰거나 바꿀 때마다, 블록체인에 영구적으로 기록됨.
 블록체인이 커질 때마다 데이터의 양도 같이 커진다. = 비용이 든다!
 큰 데이터 집합의 개별 데이터에 모두 접근하는 것은 비용이 비싸다.
 external view 함수라면 storage를 사용하는 것보다 저렴하다.

 연산을 최대한 적게 하는 게 비용을 줄이는 포인트! for문과 if문을 적절히 활용하는 게 좋음. (가스비 절약 :))

## 챕터 4

### payble

 * 컨트렉트에 이더 보내기. 이더리움 기반이기 때문에 쉽게 가능. 컨트랙트로 이더를 보내면, 해당 컨트랙트의 이더리움 계좌에 이더가 저장되고 거기에 갇힌다.

 ```
 contract OnlineStore {
  function buySomething() external payable {
    // 함수 실행에 0.001이더가 보내졌는지 확실히 하기 위해 확인:
    require(msg.value == 0.001 ether);
    // 보내졌다면, 함수를 호출한 자에게 디지털 아이템을 전달하기 위한 내용 구성:
    transferThing(msg.sender);
  }
```


 ### 출금

  * `withdraw()`
 * `transfer` 함수를 사용해서 이더를 특정 주소로 전달할 수 있다.
 * `this.balance`는 컨트랙트에 저장돼있는 전체 잔액을 반환할 수 있다.
 * `msg.sender` : 되돌려주기
 `seller.transfer(msg.value) : 판매자의 아이템을 구매하면 구매자로부터 받은 요금을 그에게 전달


```go

contract GetPaid is Ownable {
  function withdraw() external onlyOwner {
    owner.transfer(this.balance);
  }
}
```

제어자를 function이랑 같은 줄에서 작성하기~

```go

  function setLevelUpFee (uint _fee) external onlyOwner
```

 ### 난수생성

 * nonce : 딱 한 번만 사용되는 숫자, 즉 똑같은 입력으로 두 번 이상 동일한 해시 함수를 실행할 수 없게 함

 * keccak256을 통한 난수 생성

* 한 노드가 어떤 PoW를 풀면, 다른 노드들은 그 PoW를 풀려는 시도를 멈추고 해당 노드가 보낸 트랜잭션 목록이 유효한 것인지 검증한다.  유효하다면 해당 블록을 받아들이고 다음 블록을 풀기 시작한다. *이는 난수 함수를 취약하게 만든다.*

 * oracle: 이더리움 외부에서 데이터를 받아오는 안전한 방법 중 하나)을 사용해서 블록체인 밖에서 안전한 난수를 만들것임 BUT 완벽하진 않음!
   <br>
 * 난수생성 예시
 ```
 uint random2 = uint(keccak256(now, msg.sender, randNonce)) % 100;
 ```
 **만든 제어자를 function에 넣을 때 제어자가 받는 인수도 함께 기입해야 한다.**

 ## 챕터 5


 * 토큰 : 몇몇 공통 규약을 따르는 '스마트 컨트랙트', 여러가지 표준이 있다. 다중 상속이 가능하다.

## balanceOf & ownerOf

  *  balanceOf : 단순히 address를 받아, 해당 address가 토큰을 얼마나 가지고 있는지 반환
  * ownerOf : 토큰 ID(우리의 경우에는 좀비 ID)를 받아, 이를 소유하고 있는 사람의 address를 반환, DApp에 이미 저장되어 있어서 return을 통해 간단히 구현할 수 있다.

   ```go
     function balanceOf(address _owner) public view returns (uint256 _balance) {
     // 1. 여기서 `_owner`가 가진 좀비의 수를 반환하게.
   }

   function ownerOf(uint256 _tokenId) public view returns (address _owner) {
     // 2. 여기서 `_tokenId`의 소유자를 반환하게.
   ```



   * 리팩토링
   리팩토링 시 ERC가 있는 곳을 바꿀 수는 없음 다른 컨트랙트들이 우리의 컨트랙트가 정확한 이름으로 정의된 함수들을 가지고 있을 것이라 예상하고 있기 때문
     <br>
   *  전송 로직


     function _transfer(address _from, address _to, uint256 _tokenId) private {
     ownerZombieCount[_to]++;
     ownerZombieCount[_from]--;
     zombieToOwner[_tokenId] = _to;
     Transfer(_from, _to, _tokenId);}
   ```


   function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId){
     _transfer(msg.sender, _to, _tokenId);
   }
   ```

   ### Approve

   approve는 2단계로 전송이 나뉜다.

   1. 소유자인 내가 새로운 소유자의 address와 그에게 보내고 싶은 `_tokenId`를 사용하여 approve를 호출.
   2. 새로운 소유자가 `_tokenId`를 사용하여 `takeOwnership` 함수를 호출하면, 컨트랙트는 그가 승인된 자인지 확인하고 그에게 토큰을 전송.

   ```go
   mapping (uint => address) zombieApprovals;
   ```

   ```go
    function approve(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId){
     zombieApprovals[_tokenId] = _to; // zombieApprovals의 _tokenId 요소가 _to 주소와 같음
     Approval(msg.sender, _to, _tokenId); //이벤트를 호출
   }
   ```
