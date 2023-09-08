// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract Todolist {

    // تحديد هيكلية لتخزين مهمة
    struct Task {
        string name;
        bool status;
        uint timestamp;
    }

    mapping (address => Task[]) private Tasks;
    uint256 public taskIds;

    /**
        addTask - تعمل هذه الوظيفة بارسل مهمة جديدة في Tasks
    */
    function addTask(string calldata _name) public {
        // Add the task to storage.
        Tasks[msg.sender].push(Task({
            name: _name,
            status: false,
            timestamp: block.timestamp
        }));
        taskIds += 1;
    }

    /**
        updateStatus - تعمل هذه الوظيفة في تحديث حالة المهمة
    */
    function updateStatus(uint256 _index) public {
        Tasks[msg.sender][_index].status = !Tasks[msg.sender][_index].status;
    }

    /**
        deleteTask - تعمل هذه الوظيفة بحذف مهمة مطلوبة
    */
    function deleteTask(uint256 _index) public {
        delete Tasks[msg.sender][_index];
    }

    /**
        getTasks - تعمل هذه الوظيفة في جلب المهام المتعلقة بالمسخدم
    */
    function getTasks() public view returns (Task[] memory) {
        return Tasks[msg.sender];
    }
}

