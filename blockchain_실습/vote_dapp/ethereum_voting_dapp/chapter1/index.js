web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
var account;

abi = JSON.parse('[{"constant":true,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]')
VotingContract = web3.eth.contract(abi);

contractInstance = VotingContract.at('0x6eb047b1ac650e22a4a7c95c7a4f9ca86a5d85e5');

candidates = {"Rama": "candidate-1", "Nick": "candidate-2", "Jose": "candidate-3"}

function voteForCandidate(candidate) {
 candidateName = $("#candidate").val();

 contractInstance.voteForCandidate(candidateName, {from: account, gas: 4700000}, function() {
  let div_id = candidates[candidateName];
  $("#" + div_id).html(contractInstance.totalVotesFor.call(candidateName).toString());
 });
}

$(document).ready(function() {

   web3.eth.getAccounts(function (err, accs) {
   if (err != null) {
    alert('There was an error fetching your accounts.')
    return
   }

   if (accs.length === 0) {
    alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
    return
   }

   account = accs[0]

  })

 candidateNames = Object.keys(candidates);

 for(var i=0; i
  let name = candidateNames[i];
  let val = contractInstance.totalVotesFor.call(name).toNumber();
  $("#" + candidates[name]).html(val);
 }
});
