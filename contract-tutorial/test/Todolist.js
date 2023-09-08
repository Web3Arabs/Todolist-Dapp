const { expect } = require("chai")
const { ethers } = require("hardhat")

/**
  تعمل على تجميع الاختبارات ذات الصلة معًا. تأخذ سلسلة كمعاملها الأول واستدعاء اختياري كوسيطة ثانية لها.
  يساعد أيضاً على إبقائها منظمة ويسهل قراءة الاختبارات وفهمها،حيث يوفر كل وصف بعض السياق للاختبارات التي تليها.
*/
describe("Todolist Contract", async function () {
    // تخزين معلومات العقد الذكي بعد النشر
    let todolist

    // قبل اي شيئ, سيتم أولاً نشر العقد الذكي
    beforeEach(async function() {
        // جلب العقد الذكي للنشر
        const Todolist = await ethers.getContractFactory("Todolist")
        todolist = await Todolist.deploy()
        // نشر العقد
        await todolist.deployed()
    })

    // إجراء إختبار لدالة إضافة مهمة و جلب المهام
    it('should add a task' , async function() {
        // اضافة مهمة جديدة
        await todolist.addTask("Learn Test")
        // جلب المهام
        const tasks = await todolist.getTasks()
        // "Learn Test" التوقع بأن المهمة التي في الموقع 0 تساوي (تحتوي) على الاسم
        expect(tasks[0].name).to.equal("Learn Test")
    })

    // إجراء إختبار لدالة تحديث حالة المهمة و جلب المهام
    it('should update status of a task', async function() {
        // اضافة مهمة جديدة
        await todolist.addTask("Learn Test")
        // "true" تحديث حالة المهمة التي في الموقع 0 الى
        await todolist.updateStatus(0)
        // جلب المهام
        const tasks = await todolist.getTasks()
        // "true" التوقع بأن حالة المهمة التي في الموقع 0 هي
        expect(tasks[0].status).to.equal(true)
    })

    // إجراء إختبار لدالة إزالة مهمة و جلب المهام
    it('should delete a task', async function() {
        // اضافة مهمة جديدة
        await todolist.addTask("Learn Test")
        // حذف المهمة التي في الموقع 0
        await todolist.deleteTask(0)
        // جلب المهام
        const tasks = await todolist.getTasks()
        // التوقع بأن اسم المهمة التي في الموقع 0 قد اصبح فارغ بعد الإزالة
        expect(tasks[0].name).to.equal('')
    })
})
