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

function prepareTaskDOM(id, content, processedTime, estTime, status){
    const script = `
            <div draggable="true" class="task border border-dark-subtle p-2 rounded-3 mb-3" id="${id}">
                <div class="d-flex align-items-center justify-content-between">
                    <span class="editable text-break flex-grow-1" style="user-select: none;" disable="true" id="content">
                        ${content}
                    </span>
                    <div class="d-flex justify-content-end ms-1">
                        <button type="button" class="btn-edit btn btn-light p-1 d-flex rounded-circle" 
                                data-bs-toggle="tooltip" data-bs-title="Edit task"
                                onclick="editTask(this)">
                            <i class="fa-solid fa-pencil"></i>
                        </button>
                        <button type="button" class="btn-delete btn btn-light p-1 d-flex rounded-circle" 
                                data-bs-toggle="tooltip" data-bs-title="Delete task"
                                onclick="deleteTask(this)">
                            <i class="fa-solid fa-circle-xmark"></i>
                        </button>
                    </div>
                </div>
                <hr class="my-1">
                <div class="d-flex justify-content-end flex-wrap">
                    <div class="badge text-bg-primary py-0 mx-1">
                        <div class="d-flex align-items-center justify-content-center text-end py-1" 
                                data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Progressed time">
                            <span class="d-flex center px-1 py-1" value=${processedTime} id="processedTime">
                                <span id="timeNone">-</span>
                                <div class="numeric d-none me-1" id="hr">
                                    <span class="editable">${Math.floor(processedTime / (60*60))}</span> <span>h</span>
                                </div>
                                <div class="numeric d-none me-1" id="min">
                                    <span class="editable">${processedTime % (60*60)}</span> <span>min</span>
                                </div>
                                <div class="numeric d-none" id="sec">
                                    <span class="editable">${processedTime % (60)}</span> <span>sec</span>
                                </div>
                            </span>
                            <i class="fa-solid fa-hourglass-half ms-1 py-1"></i>
                        </div>
                    </div>
                    <div class="badge text-bg-warning py-0 mx-1">
                        <div class="d-flex align-items-center justify-content-center text-end py-1" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Estimate time">
                            <span class="d-flex align-items-center center p-2 px-1 py-1" value=${estTime} id="estTime">
                                <span id="timeNone">-</span>
                                <div class="numeric d-none me-1" id="hr">
                                    <span class="editable">${Math.floor(processedTime / (60*60))}</span> <span>h</span>
                                </div>
                                <div class="numeric d-none me-1" id="min">
                                    <span class="editable">${processedTime % (60*60)}</span> <span>min</span>
                                </div>
                                <div class="numeric d-none" id="sec">
                                    <span class="editable">${processedTime % (60)}</span> <span>sec</span>
                                </div>
                            </span>
                            <i class="fa-solid fa-stopwatch ms-1 py-1"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
    let parser = new DOMParser();
    let doc = parser.parseFromString(script, 'text/html');
    let taskCode = doc.body.firstChild;
        

    let taskContainer;
    switch(status){
        case "workingList": taskContainer = document.getElementById("workingList");
                        break;
        case "doneList":    taskContainer = document.getElementById("doneList");
                        break;
        default:        taskContainer = document.getElementById("pendingList");
    }
    taskContainer.appendChild(taskCode);
    initTooltip();
    initNumericInput();
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
            prepareTaskDOM(task.id, task.content, task.processedTime, task.estTime, task.status);
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
            prepareTaskDOM(task.id, task.content, task.processedTime, task.estTime, task.status);
            document.getElementById("newTaskName").value = "";
            initTooltip();
            initNumericInput();
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
                displayNumericInput(task);
            });
            editButton.classList.add("editingBtn");
        } else {
            editableElements.forEach(function (element) {
                element.contentEditable = false;
                element.classList.remove("editing");
            });
            editButton.classList.remove("editingBtn");
            updateTaskInfo(task);
            hideNumericInput(task);
        }
    }

    function displayNumericInput(task){
        const target = task.querySelectorAll(".numeric");
        const targetText = task.querySelectorAll("#timeNone");

        targetText.forEach(function (element){
            element.classList.add("d-none");
        });
        
        target.forEach(function (element) {
            element.classList.remove("d-none");
            element.classList.add("numericDisplay");
        });
    }

    function hideNumericInput(task){
        const target = task.querySelectorAll(".numericDisplay");
        const targetText = task.querySelectorAll("#timeNone");

        let num = 0;
        target.forEach(function (element) {
            if(parseInt(element.textContent) > 0){
                num++;
            }
        });

        if(num==0){
            targetText.forEach(function (element){
                element.classList.remove("d-none");
            });
            
            target.forEach(function(element){
                element.classList.remove("numericDisplay");
                element.classList.add("d-none");
            });
        }
    }

    function initNumericInput(){
        const target = document.querySelectorAll(".numeric");
        target.forEach(function(element){
            element.addEventListener("keypress", function(e) {
                if (isNaN(String.fromCharCode(e.which))) e.preventDefault();
            });
            element.addEventListener("blur", function(e){
                element.textContent = parseInt(element.textContent);
            })
        })
    }

    function updateTaskInfo(task){
        const content = task.querySelector("#content").textContent;
        const proTime = parseInt(task.querySelector("#processedTime").textContent);
        const estTime = parseInt(task.querySelector("#estTime").textContent);
        console.log(proTime, estTime);

        todos = todos.map(function(todo){
            if(todo.id == task.id){
                if(todo.content != content)
                    todo.content = content;
                
                if(todo.estTime != estTime)
                    todo.estTime = estTime;

                if(todo.processedTime != proTime)
                    todo.processedTime = proTime;

                return todo;
            }
            return todo;
        });
        localStorage.setItem("TaskList", JSON.stringify(todos)); 
    }

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