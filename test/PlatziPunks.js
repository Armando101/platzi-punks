const { expect } = require("chai");

describe("Platzi Punks Contract", function () {
  const setup = async (maxSupply = 10000) => {
    const [depoyer] = await ethers.getSigners();
    const PlatziPunks = await ethers.getContractFactory("PlatziPunks");
    const deployed = await PlatziPunks.deploy(maxSupply);

    return {
      depoyer,
      deployed,
    };
  };

  describe("Deployment", function () {
    it("Sets max supply to passed param", async function () {
      const maxSupply = 4000;
      const { deployed } = await setup(maxSupply);
      const returnedMaxSupply = await deployed.maxSupply();

      expect(maxSupply).to.equal(returnedMaxSupply);
    });
  });

  describe("Minting", () => {
    it("Mints a new token and assigns it to owner", async () => {
      const { depoyer, deployed } = await setup();

      await deployed.mint();
      const ownerOfMinted = await deployed.ownerOf(0);

      expect(ownerOfMinted).to.equal(depoyer.address);
    });
    it("Has a minting limit", async () => {
      const maxSupply = 2;
      const { deployed } = await setup(maxSupply);

      // Mint all
      await Promise.all([deployed.mint(), deployed.mint()]);

      // Assert the last minting
      await expect(deployed.mint()).to.be.revertedWith(
        "No PlatziPunks Available"
      );
    });
  });

  describe("TokenURI", () => {
    it("returns valid metadata", async () => {
      const { deployed } = await setup();

      await deployed.mint();
      const tokenURI = await deployed.tokenURI(0);
      const stringifiedTokenURI = await tokenURI.toString();
      const [prefix, base64Json] = stringifiedTokenURI.split(
        "data:application/json;base64,"
      );
      const stringifiedMetadata = await Buffer.from(
        base64Json,
        "base64"
      ).toString("ascii");

      const metadata = JSON.parse(stringifiedMetadata);

      expect(metadata).to.have.all.keys("name", "description", "image");
    });
  });
});
