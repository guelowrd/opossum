const { ethers } = require("hardhat");
const { assert, expect } = require('chai')
const chai = require('chai')
chai.use(require('chai-as-promised')).should()

describe("Minter", function () {
  let contract;
  const mintedData = "someDataToMint"
  beforeEach(async () => {
    const minterDeployer = await ethers.getContractFactory("Minter")
    const minterDeployed = await minterDeployer.deploy("")
    contract = await minterDeployed.deployed()
  })
  describe('deployment', async function () {
    it('deploys successfully', async function () {
      const address = contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
  })
  describe('minting', async function () {
    it('mints tokens as expected', async function () {
      // Request to mint 1 token and send 0.0123 ETH.
      await contract.mint(mintedData, { value: ethers.utils.parseEther("0.0123") })
      const totalSupply = await contract.totalSupply()
      // Success: 1 token should be minted.
      assert.equal(totalSupply, 1)
    })
    it('fails to mint if ETH amount is too low', async function () {
      // Failure: Can't mint 1 token with 0.01 ETH.
      await contract.mint(mintedData, { value: ethers.utils.parseEther("0.01") }).should.be.rejected
    })
  })
  describe('fetching global data', async function () {
    beforeEach(async () => {
      await contract.mint(mintedData, { value: ethers.utils.parseEther("0.0123") })
    })
    it('fetches data as expected - getBalance()', async function () {
      // Request getBalance from contract.
      const balance = await contract.getBalance()
      expect(ethers.utils.formatEther(balance).toString()).to.equal('0.0123')
    })
    it('fetches data as expected - uri()', async function () {
      // Request uri from contract.
      const uri = await contract.uri(0)
      expect(uri).to.equal(mintedData)
    })
  })
  describe('fetching minter data', async function () {
    let owner, alice, bob
    beforeEach(async () => {
      [owner, alice, bob] = await ethers.getSigners();
      await contract.connect(alice).mint(mintedData, { value: ethers.utils.parseEther("0.0123") })
    })
    it('fetches data as expected - ownerBalance(address)', async function () {
      // Request ownerBalance(address) from contract.
      const balanceAlice = await contract.ownerBalance(alice.address)
      expect(balanceAlice).to.equal(1)
      const balanceBob = await contract.ownerBalance(bob.address)
      expect(balanceBob).to.equal(0)
    })
    it('fetches data as expected - tokenOfOwnerByIndex(address, index)', async function () {
      // Request uri from contract.
      const tokenId = await contract.tokenOfOwnerByIndex(alice.address, 0)
      expect(tokenId).to.equal(0)
    })
    it('data fetch failing as expected - tokenOfOwnerByIndex(address, index)', async function () {
      // Request uri from contract.
      await contract.tokenOfOwnerByIndex(bob.address, 0).should.be.rejected
    })
  })
  describe('transferring (or not)', async function () {
    let owner, alice, bob
    beforeEach(async () => {
      [owner, alice, bob] = await ethers.getSigners();
      await contract.connect(alice).mint(mintedData, { value: ethers.utils.parseEther("0.0123") })
      await contract.connect(alice).mint(mintedData, { value: ethers.utils.parseEther("0.0123") })
    })
    it('transfer is not possible as expected - safeTransferFrom()', async function () {
      // Try to call safeTransferFrom(from, to, id, amount, data) from contract.
      await contract.connect(alice).safeTransferFrom(alice.address, bob.address, 0, 1, "").should.be.rejected
    })
    it('transfer is not possible as expected - safeBatchTransferFrom()', async function () {
      // Try to call safeBatchTransferFrom(from, to, ids, amounts, data) from contract.
      await contract.connect(alice).safeBatchTransferFrom(alice.address, bob.address, [0, 1], [1, 1], "").should.be.rejected
    })
  })
})

