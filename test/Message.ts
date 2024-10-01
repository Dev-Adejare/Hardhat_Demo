import { loadFixture, } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";


describe("message Test", function () {

    async function deployMessageFixture() {

        const [owner, otherAccount] = await hre.ethers.getSigners();

        const Message = await hre.ethers.getContractFactory("Message");
        const message = await Message.deploy();

        return { message, owner, otherAccount }
    }

    describe("deployment", () => {
        it("Should check if it deployed", async function () {
            const { message, owner } = await loadFixture(deployMessageFixture);

            expect(await message.owner()).to.equal(owner);
        });


        it("it should be able to set message", async function () {
            const { message, owner } = await loadFixture(deployMessageFixture);
            const msg = "Hello World";

            await message.connect(owner).setMessage(msg);

            expect(await message.getMessage()).to.equal(msg);


        });

        it("Should not be able to set message if not the owner", async function () {
            const { message, otherAccount } = await loadFixture(deployMessageFixture);
            const msg = "Hello World";


            await expect(
                message.connect(otherAccount).setMessage(msg)
            ).to.be.revertedWith("You aren't the owner");
        });

        it ("OwnershipTransfered", async function () {
            const { message, otherAccount, owner} = await loadFixture(deployMessageFixture)

            await message.connect(owner).transferOwnership(otherAccount)

            expect(await message.owner()).to.equal(otherAccount)
        })
    });
});