const LocalLottery = artifacts.require("LocalLottery");

contract("LocalLottery", (accounts) => {
  it("should allow players to enter the lottery", async () => {
    const lottery = await LocalLottery.deployed();

    // Enter the lottery with an account
    await lottery.enter({ value: web3.utils.toWei("0.1", "ether"), from: accounts[1] });

    // Get the list of players
    const players = await lottery.getPlayers();

    // Assert that the entered player is in the list of players
    assert.equal(players[0], accounts[1], "Player was not added to the players array.");
  });

  it("should pick a winner and distribute the contract balance", async () => {
    const lottery = await LocalLottery.deployed();

    // Enter the lottery with multiple accounts
    await lottery.enter({ value: web3.utils.toWei("0.1", "ether"), from: accounts[1] });
    await lottery.enter({ value: web3.utils.toWei("0.1", "ether"), from: accounts[2] });
    await lottery.enter({ value: web3.utils.toWei("0.1", "ether"), from: accounts[3] });

    // Get the initial contract balance
    const initialBalance = await web3.eth.getBalance(lottery.address);

    // Pick a winner
    await lottery.pickWinner({ from: accounts[0] });

    // Get the final contract balance
    const finalBalance = await web3.eth.getBalance(lottery.address);

    // Assert that the contract balance is zero after picking a winner
    assert.equal(finalBalance, 0, "Contract balance was not distributed to the winner.");
  });
});
