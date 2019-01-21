pragma solidity ^0.4.23;

contract RealEstate {
    struct Buyer{
        address buyerAddress;
        bytes32 name;
        uint age;
    }
    mapping (uint => Buyer) public buyerInfo;
 address public owner;
 address[10] public buyers;

 event LogBuyRealEstates(
     address _buyer,
     uint _id
 );
 constructor() public {
     owner = msg.sender;
 }
 function buyRealEstate(uint _id, bytes32 _name, uint _age)public payable{
     require(_id >=0 && _id <= 9);
     buyers[_id] = msg.sender;
     buyerInfo[_id] = Buyer(msg.sender, _name, _age);


     owner.transfer(msg.value); // 함수로 넘어온 이더

     
 }
}
