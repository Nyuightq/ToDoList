window.onload = function(){
    initTooltip();
}
function initTooltip(){
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        const isInit = tooltipTriggerEl.hasAttribute('data-tooltip-initialized');
        if(!isInit){
            new bootstrap.Tooltip(tooltipTriggerEl);
            tooltipTriggerEl.setAttribute('data-tooltip-initialized', 'true');
        }
    })
}

function deleteTooltip(){
    const elements = document.getElementsByClassName('tooltip');
    const elementArray = Array.from(elements);
    
    elementArray.forEach(element => {
        element.remove();
    });
}



// Task functions
    if(localStorage.getItem("TaskList") === null){
        var todos = [];
    }
    else{
        var todos = JSON.parse(localStorage.getItem("TaskList"));
        console.log(todos);

        // Initialize local storage data.
        todos.forEach(function (task){
            const script = `
                <div draggable="true" class="task border border-dark-subtle p-2 rounded-3 mb-3" id="${task.id}">
                    <div class="d-flex align-items-center justify-content-between">
                        <span class="editable pe-2 text-break" style="user-select: none;">
                        ${task.content}
                        </span>
                    <div class="d-flex justify-content-end">
                        <button type="button" class="btn-edit btn btn-light p-1 d-flex rounded-circle" data-bs-toggle="tooltip" data-bs-title="Edit task"
                                onclick="editTask(this)">
                            <i class="fa-solid fa-pencil"></i>
                        </button>
                        <button type="button" class="btn-delete btn btn-light p-1 d-flex rounded-circle" data-bs-toggle="tooltip" data-bs-title="Delete task"
                        onclick="deleteTask(this)">
                            <i class="fa-solid fa-circle-xmark"></i>
                        </button>
                    </div>
                    </div>
                    <hr class="my-1">
                    <div class="d-flex justify-content-end flex-wrap">
                        <div class="badge text-bg-primary py-0 mx-1">
                            <div class="d-flex align-items-center justify-content-end text-end" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Progressed time">
                                <span class="editable align-items-center center p-2 px-1" value=${task.processedTime}>
                                    -
                                </span>
                                <i class="fa-solid fa-hourglass-half"></i>
                            </div>
                        </div>
                        <div class="badge text-bg-warning py-0 mx-1">
                            <div class="d-flex align-items-center justify-content-end text-end" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Estimate time">
                                <span class="editable align-items-center center p-2 px-1" value=${task.estTime}>
                                    -
                                </span>
                                <i class="fa-solid fa-stopwatch"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            let parser = new DOMParser();
            let doc = parser.parseFromString(script, 'text/html');
            let taskCode = doc.body.firstChild;

            let taskContainer;
            switch(task.status){
                case "workingList": taskContainer = document.getElementById("workingList");
                                break;
                case "doneList":    taskContainer = document.getElementById("doneList");
                                break;
                default:        taskContainer = document.getElementById("pendingList");
            }
            taskContainer.appendChild(taskCode);
        });
    }
    const input = document.getElementById("newTaskName");
    input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("btn-create").click();
    }});
    


    function newTask(){
        const inputValue = document.getElementById("newTaskName").value;
        if (inputValue) {
            const task = {
                id: Date.now(),
                content: inputValue,
                status: "pendingList",
                estTime: 0,
                processedTime: 0
            };
            todos.push(task);
            localStorage.setItem("TaskList", JSON.stringify(todos));
            const script = `
                <div draggable="true" class="task border border-dark-subtle p-2 rounded-3 mb-3" id="${Date.now()}">
                    <div class="d-flex align-items-center justify-content-between">
                        <span class="editable pe-2 text-break" style="user-select: none;">
                        ${inputValue}
                        </span>
                    <div class="d-flex justify-content-end">
                        <button type="button" class="btn-edit btn btn-light p-1 d-flex rounded-circle" data-bs-toggle="tooltip" data-bs-title="Edit task"
                                onclick="editTask(this)">
                            <i class="fa-solid fa-pencil"></i>
                        </button>
                        <button type="button" class="btn-delete btn btn-light p-1 d-flex rounded-circle" data-bs-toggle="tooltip" data-bs-title="Delete task"
                        onclick="deleteTask(this)">
                            <i class="fa-solid fa-circle-xmark"></i>
                        </button>
                    </div>
                    </div>
                    <hr class="my-1">
                    <div class="d-flex justify-content-end flex-wrap">
                        <div class="badge text-bg-primary py-0 mx-1">
                            <div class="d-flex align-items-center justify-content-end text-end" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Progressed time">
                                <span class="editable align-items-center center p-2 px-1" value=0>
                                    -
                                </span>
                                <i class="fa-solid fa-hourglass-half"></i>
                            </div>
                        </div>
                        <div class="badge text-bg-warning py-0 mx-1">
                            <div class="d-flex align-items-center justify-content-end text-end" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Estimate time">
                                <span class="editable align-items-center center p-2 px-1" value=0>
                                    -
                                </span>
                                <i class="fa-solid fa-stopwatch"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            let parser = new DOMParser();
            let doc = parser.parseFromString(script, 'text/html');
            let taskCode = doc.body.firstChild;

            const taskContainer = document.getElementById("pendingList");
            taskContainer.appendChild(taskCode);
            document.getElementById("newTaskName").value = "";
            initTooltip();
        }
    }

    function deleteTask(e) {
        deleteTooltip();
        // Delete by filtering task by using div's ID.
        todos = todos.filter(function(todo){
            return todo.id != e.parentElement.parentElement.parentElement.id;
        })
        // Update localStorage
        localStorage.setItem("TaskList", JSON.stringify(todos)); 
        e.parentElement.parentElement.parentElement.remove();
    }

    function editTask(editButton) {
        const task = editButton.parentElement.parentElement.parentElement;
        const editableElements = task.querySelectorAll(".editable");

        if (!editButton.matches(".editingBtn")) {
            editableElements.forEach(function (element) {
                element.contentEditable = true;
                element.classList.add("editing");
                element.addEventListener("keypress", function(event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    element.blur();
                    }
                });
            });
            editButton.classList.add("editingBtn");
        } else {
            editableElements.forEach(function (element) {
                element.contentEditable = false;
                element.classList.remove("editing");
            });
            editButton.classList.remove("editingBtn");
        }
    }

    // function updateTaskInfo(task){
    //     todos = todos.map(function(todo){
    //         console.log("pass");
    //         if(todo.id == task.id){
    //             if(todo.content != task.content)
    //                 todo.content = task.content;
                
    //             if(todo.estTime != task.estTime)
    //                 todo.estTime = task.estTime;

    //             if(todo.processedTime != task.processedTime)
    //                 todo.processedTime = task.processedTime;

    //             return todo;
    //         }
    //         return todo;
    //     });
    // }

    function updateTaskStatus(task){
        todos = todos.map(function(todo){
            if(todo.id == task.id){
                const type = task.parentElement.id;
                todo.status = type;
                return todo;
            }
            return todo;
        });
        // Update localStorage
        localStorage.setItem("TaskList", JSON.stringify(todos)); 
    }


//
// Task drag and drop function, with instant arrangement.
//

    const lists = document.querySelectorAll('.task-list');
    let sourceNode;
    
    lists.forEach(function (list){
        list.ondragstart = e => {
            
            if(!e.target.matches('.task'))
                return

            sourceNode = e.target;
            setTimeout(() => {
                e.target.classList.add('moving');
            }, 0);
            e.dataTransfer.effectAllowed = 'move';
        };

        list.ondragend = e => {
            e.target.classList.remove('moving');
            updateTaskStatus(e.target);
        }

        list.ondragover = e => {
            e.preventDefault();
        }

        list.ondragenter = e => {
            e.preventDefault();
            if (e.target === list || e.target === sourceNode) {
                return;
            }
            
            const children = Array.from(list.children);
            const sourceIndex = children.indexOf(sourceNode);
            const targetIndex = children.indexOf(e.target);

            if (sourceIndex < targetIndex) {
                list.insertBefore(sourceNode, e.target.nextElementSibling);
            } else {
                list.insertBefore(sourceNode, e.target);
            }
        };
    });