const hre = require("hardhat")

// وظيفة تعمل على استدعاء المهامات من العقد الذكي
function get_tasks(contract, user) {
  return contract.connect(user).getTasks()
}

async function main() {
  // احصل على بعض الحسابات التي سنعمل معها
  const [user1] = await hre.ethers.getSigners()

  // نحصل على العقد للنشر
  const TodolistContract = await hre.ethers.getContractFactory("Todolist")
  const todolistContract = await TodolistContract.deploy()

  // نشر العقد
  await todolistContract.deployed()
  console.log("Todolist contract deployed to:", todolistContract.address)

  // إضافة مهمة للعقد
  await todolistContract.connect(user1).addTask("Learn Web3")
  await todolistContract.connect(user1).addTask("Travel")
  await todolistContract.connect(user1).addTask("Write")
  console.log("Added tasks!")

  // الحصول على المهمات من العقد المتعلقة بهذا المستخدم
  console.log("Your tasks: ", await get_tasks(todolistContract, user1))

  // تحديث حالة بعض المهام
  console.log("Updateing your tasks...")
  await todolistContract.connect(user1).updateStatus(0)
  await todolistContract.connect(user1).updateStatus(2)
  console.log("Updated! your tasks: ", await get_tasks(todolistContract, user1))

  // حذف بعض المهام
  console.log("Deleting your tasks...")
  await todolistContract.connect(user1).deleteTask(0)
  await todolistContract.connect(user1).deleteTask(2)
  console.log("Deleted! your tasks: ", await get_tasks(todolistContract, user1))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })