import { useState, useEffect } from "react"
import { ethers } from "ethers"
import abi from "../utils/Todolist.json"

export default function Home() {
  // Contract Address & ABI
  const contractAddress = "0x322999e9c7d8269095039665f851a9ae83905224"
  const contractABI = abi.abi

  // ستقوم بتخزين عنوان المحفظة التي ستتصل بالتطبيق من اجل مراقبة ما اذا كانت المحفظة متصلة بالتطبيق او نتمكن من استدعاء عنوان المحفظة المتصلة
  const [currentAccount, setCurrentAccount] = useState("")
  // input ستقوم بتخزين اي تحديث يحصل في
  const [name, setName] = useState("")
  // ستقوم بتخزين المهام التي ستقوم بجلبها من العقد الذكي
  const [tasks, setTasks] = useState([])

  // تعمل هذه الوظيفة على مراقبة اتصال المحفظة بالتطبيق بشكل مستمر
  const isConnectWallet = async () => {
    try {
      // يتم استخدام هذا للوصول إلى كائن اثيريوم والتي من تعد من الكائنات العامة
      const { ethereum } = window

      // يقوم هذا بإرجاع مجموعة من عناوين شبكة اثيريوم المرتبطة بحساب المستخدم ويمكن استخدام هذا للوصول إلى حسابات المستخدم اثيريوم والتفاعل مع شبكة اثيريوم
      const accounts = await ethereum.request({method: "eth_requestAccounts"})
      setCurrentAccount(accounts[0])
      console.log("accounts: ", accounts)

      /**
        يتحقق هذا الرمز من وجود أي حسابات متاحة في المحفظة الخاصة باللمستخدم.
        إذا كان هناك، فإنه يقوم بتعيين الحساب الأول إلى متغير يسمى ويطبع رسالة في وحدة التحكم.
        إذا لم تكن هناك حسابات متاح، فإنها تطبع رسالة في وحدة التحكم.
      */
      if (accounts.length > 0) {
        const account = accounts[0]
        console.log("wallet is connected! ", account)
      } else {
        console.log("make sure MetaMask is connected")
      }
    } catch (error) {
      console.error(error)
    }
  }

  // تعمل هذه الوظيفة على اتصال المحفظة بالتطبيق
  const connectWallet = async () => {
    try {
      // يتم استخدام هذا للوصول إلى كائن اثيريوم والتي من تعد من الكائنات العامة
      const { ethereum } = window

      // يتحقق هذا لمعرفة ما إذا كان موفر شبكة اثيريوم متوفراً. إذا لم يكن متوفراً, فسيخرج رسالة
      if (!ethereum) {
        console.log("please install MetaMask")
      }

      // يقوم هذا بإرجاع مجموعة من عناوين شبكة اثيريوم المرتبطة بحساب المستخدم ويمكن استخدام هذا للوصول إلى حسابات المستخدم اثيريوم والتفاعل مع شبكة اثيريوم
      const accounts = await ethereum.request({method: "eth_requestAccounts"})

      setCurrentAccount(accounts[0])
    } catch (error) {
      console.error(error)
    }
  }

  // تعمل هذه الوظيفة بجلب المهام من العقد الذكي
  const getTasks = async () => {
    try {
      // يتم استخدام هذا للوصول إلى كائن اثيريوم والتي من تعد من الكائنات العامة
      const { ethereum } = window

      // يتحقق هذا لمعرفة ما إذا كان موفر شبكة اثيريوم متوفراً
      if (ethereum) {
        // يستخدم هذا للتفاعل مع البلوكتشين
        const provider = new ethers.providers.Web3Provider(ethereum, "any")
        // كائن مُوقع يتم استخدامه لمصادقة وتفويض المعاملات على البلوكتشين
        const signer = provider.getSigner()
        // يعمل هذا على اخذ مثيل للعقد بحيث نتمكن من التفاعل مع البلوكتشين
        const todolist = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        console.log("fetching tasks...")
        // يقوم بإستدعاء وظيفة جلب المهام من العقد الذكي
        const tasks = await todolist.getTasks()
        console.log("fetched!")
        setTasks(tasks)
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
      console.error(error)
    }
  }

  // تعمل هذه الوظيفة بإضافة المهام
  const addTask = async () => {
    try {
      // يتم استخدام هذا للوصول إلى كائن اثيريوم والتي من تعد من الكائنات العامة
      const {ethereum} = window

      // يتحقق هذا لمعرفة ما إذا كان موفر شبكة اثيريوم متوفراً
      if (ethereum) {
        // يستخدم هذا للتفاعل مع البلوكتشين
        const provider = new ethers.providers.Web3Provider(ethereum, "any")
        // كائن مُوقع يتم استخدامه لمصادقة وتفويض المعاملات على البلوكتشين
        const signer = provider.getSigner()
        // يعمل هذا على اخذ مثيل للعقد بحيث نتمكن من التفاعل مع البلوكتشين
        const todolist = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        // يقوم بإستدعاء وظيفة إضافة مهمة من العقد الذكي
        const taskTxn = await todolist.addTask(
          name ? name : "anon"
        )
        // انتظر حتى يتم تعدين الصفقة
        await taskTxn.wait()

        console.log("mined ", taskTxn.hash)
        setName("")
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
      console.error(error)
    }

  }

  // تعمل هذه الوظيفة بتحدث حالة مهمة معينة تريد تحديثها
  const updateStatus = async (index) => {
    try {
      // يتم استخدام هذا للوصول إلى كائن اثيريوم والتي من تعد من الكائنات العامة
      const { ethereum } = window

      // يتحقق هذا لمعرفة ما إذا كان موفر شبكة اثيريوم متوفراً
      if (ethereum) {
        // يستخدم هذا للتفاعل مع البلوكتشين
        const provider = new ethers.providers.Web3Provider(ethereum, "any")
        // كائن مُوقع يتم استخدامه لمصادقة وتفويض المعاملات على البلوكتشين
        const signer = provider.getSigner()
        // يعمل هذا على اخذ مثيل للعقد بحيث نتمكن من التفاعل مع البلوكتشين
        const todolist = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        // يقوم بإستدعاء وظيفة تحديث حالة المهمة من العقد الذكي
        const taskTxn = await todolist.updateStatus(index)
        // انتظر حتى يتم تعدين الصفقة
        await taskTxn.wait()
        console.log("Updated!")
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
      console.error(error)
    }
  }

  // تعمل هذه الوظيفة بإزالة مهمة معينة تريد إزالتها
  const deleteTask = async (index) => {
    try {
      // يتم استخدام هذا للوصول إلى كائن اثيريوم والتي من تعد من الكائنات العامة
      const { ethereum } = window

      // يتحقق هذا لمعرفة ما إذا كان موفر شبكة اثيريوم متوفراً
      if (ethereum) {
        // يستخدم هذا للتفاعل مع البلوكتشين
        const provider = new ethers.providers.Web3Provider(ethereum, "any")
        // كائن مُوقع يتم استخدامه لمصادقة وتفويض المعاملات على البلوكتشين
        const signer = provider.getSigner()
        // يعمل هذا على اخذ مثيل للعقد بحيث نتمكن من التفاعل مع البلوكتشين
        const todolist = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        // يقوم بإستدعاء وظيفة إزالة المهمة من العقد الذكي
        const taskTxn = await todolist.deleteTask(index)
        // انتظر حتى يتم تعدين الصفقة
        await taskTxn.wait()
        console.log("Deleted!")
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
      console.error(error)
    }
  }

  // تمثل المصفوفة في نهاية استدعاء الوظيفة ما هي تغييرات الحالة التي ستؤدي إلى هذا التغيير
  // في هذه الحالة كلما تغيرت قيم الوظيفتين سيتم استدعاء هذا التغيير مباشرة
  useEffect(() => {
    isConnectWallet()
    getTasks()
  }, [])

  return (
    <div dir='rtl'>
      <p className='text-center italic text-3xl text-rose-700 font-bold mt-10'>Todo-list Project</p>
      <div className="max-w-md px-4 mx-auto mt-12">
        <div className="flex justify-center">
          <input onChange={event => setName(event.target.value)} type="text" placeholder="ماهي مهمتك القادمة؟" className="w-full py-3 pl-12 pr-4 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-rose-700"/>

          <button onClick={addTask} className="px-4 mr-4 py-2 text-white bg-rose-600 rounded-lg duration-150 hover:bg-rose-700 active:shadow-lg">
            اضافة
          </button>
        </div>
      </div>

      <div className='mt-20'>
        <div>
          <p className='text-center text-xl text-rose-700 font-bold'>المهمات الخاصة بك</p>
          {
            currentAccount ? tasks.map((task, idx) => (
              <div key={idx}>
                {task.name && (
                  <div className='flex justify-center mt-5'>
                    <div className='flex justify-center'>
                      <input type="checkbox" checked={task.status} onClick={() => updateStatus(idx)} className="checkbox-item peer ml-2" />
                      <p className='text-xl text-right'>{task.name}</p>
                    </div>

                    <button onClick={() => deleteTask(idx)} className="px-4 mr-52 py-1 text-white bg-red-600 rounded-lg duration-150 hover:bg-red-700 active:shadow-lg">
                      حذف
                    </button>
                  </div>
                )}
              </div>
            )) : (
              <div className="flex justify-center">
                <button onClick={connectWallet} className="px-4 mr-8 mt-5 py-2 text-white bg-rose-600 rounded-lg duration-150 hover:bg-rose-700 active:shadow-lg">اتصل بالمحفظة</button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
