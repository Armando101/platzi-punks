const deploy = async () => {
  const [depoyer] = await ethers.getSigners();

  console.log("deploying contract with the account", depoyer.address);
  const PlatziPunks = await ethers.getContractFactory("PlatziPunks");
  const deployed = await PlatziPunks.deploy(10000);

  console.log("Platzi Punks deployed at", deployed.address);
};

deploy()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
