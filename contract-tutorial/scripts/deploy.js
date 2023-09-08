const hre = require("hardhat");

async function main() {
  /*
    لنشر عقود ذكية جديدة getContractFactory يستخدم
  */
  const todolistContract = await hre.ethers.getContractFactory("Todolist");

  // هنا نقوم برفع العقد
  const todolist = await todolistContract.deploy();

  // انتظر حتى تنتهي عملية الرفع
  await todolist.deployed();

  // طباعة عنوان العقد المنشور
  console.log("Todolist deployed to:", todolist.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
