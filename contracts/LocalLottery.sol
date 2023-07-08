// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract LocalLottery {
address public manager;
    address payable[] public players;
    address public lastWinner;

    event NewPlayerJoined(address indexed player);
    event LotteryWinner(address indexed winner, uint256 amount);

    modifier onlyManager() {
        require(msg.sender == manager, "Only the manager can perform this action.");
        _;
    }

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > 0, "You must send some ether to enter the lottery.");
        players.push(payable(msg.sender));
        emit NewPlayerJoined(msg.sender);
    }

    function getRandom() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players.length)));
    }

    function pickWinner() public onlyManager {
        require(players.length > 0, "No players participated in the lottery.");

        uint256 index = getRandom() % players.length;
        address payable winner = players[index];
        uint256 contractBalance = address(this).balance;

        winner.transfer(contractBalance);
        lastWinner = winner;
        players = new address payable[](0);

        emit LotteryWinner(winner, contractBalance);
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
