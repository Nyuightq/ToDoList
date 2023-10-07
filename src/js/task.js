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
                            <span class="d-flex center px-1 py-1" value="${processedTime}" id="processedTime">
                                <span id="timeNone">-</span>
                                <div class="numeric d-none me-1" id="hr">
                                    <span class="numInput editable">${Math.floor(processedTime / (60*60))}</span> <span>h</span>
                                </div>
                                <div class="numeric d-none me-1" id="min">
                                    <span class="numInput editable">${Math.floor(processedTime / 60) % 60}</span> <span>min</span>
                                </div>
                                <div class="numeric d-none" id="sec">
                                    <span class="numInput editable">${processedTime % (60)}</span> <span>sec</span>
                                </div>
                            </span>
                            <i class="fa-solid fa-hourglass-half ms-1 py-1"></i>
                        </div>
                    </div>
                    <div class="badge text-bg-warning py-0 mx-1">
                        <div class="d-flex align-items-center justify-content-center text-end py-1" data-bs-toggle="tooltip" 
                        data-bs-placement="bottom" data-bs-title="Estimate time">
                            <span class="d-flex align-items-center center p-2 px-1 py-1" value="${estTime}" id="estTime">
                                <span id="timeNone">-</span>
                                <div class="numeric d-none me-1" id="hr">
                                    <span class="numInput editable">${Math.floor(estTime / (60*60))}</span> <span>h</span>
                                </div>
                                <div class="numeric d-none me-1" id="min">
                                    <span class="numInput editable">${Math.floor(estTime / 60) % 60}</span> <span>min</span>
                                </div>
                                <div class="numeric d-none" id="sec">
                                    <span class="numInput editable">${estTime % (60)}</span> <span>sec</span>
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
        let num=0;
        var todos = JSON.parse(localStorage.getItem("TaskList"));
        // Initialize local storage data.
        todos.forEach(function (task) {
            prepareTaskDOM(task.id, task.content, task.processedTime, task.estTime, task.status);
            num++;

            const target = document.getElementById(task.id);
            displayNumericInput(target);
            convertNumericInput(target);
            showTimeDiv(target.querySelector("#processedTime"));
            showTimeDiv(target.querySelector("#estTime"));
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
            return;
        }
        
        editableElements.forEach(function (element) {
            element.contentEditable = false;
            element.classList.remove("editing");
        });
        editButton.classList.remove("editingBtn");
        convertNumericInput(task.querySelector("#processedTime"));
        convertNumericInput(task.querySelector("#estTime"));

        showTimeDiv(task.querySelector("#processedTime"));
        showTimeDiv(task.querySelector("#estTime"));

        updateTaskInfo(task);
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

    function showTimeDiv(timeDiv){
        const hrElement = timeDiv.querySelector("#hr");
        const minElement = timeDiv.querySelector("#min");
        const secElement = timeDiv.querySelector("#sec");
        const targetNone = timeDiv.querySelector("#timeNone");

        if(parseInt(hrElement.querySelector(".numInput").textContent) > 0){
            hrElement.classList.remove("d-none");
            minElement.classList.remove("d-none");
            secElement.classList.remove("d-none");
            targetNone.classList.add("d-none");
            return;
        }else if(parseInt(minElement.querySelector(".numInput").textContent) > 0){
            hrElement.classList.add("d-none");
            minElement.classList.remove("d-none");
            secElement.classList.remove("d-none");
            targetNone.classList.add("d-none");
        }else if(parseInt(secElement.querySelector(".numInput").textContent) > 0){
            hrElement.classList.add("d-none");
            minElement.classList.add("d-none");
            secElement.classList.remove("d-none");
            targetNone.classList.add("d-none");
        }
        else{
            hrElement.classList.add("d-none");
            minElement.classList.add("d-none");
            secElement.classList.add("d-none");
            targetNone.classList.remove("d-none");
        }
    }

    function convertNumericInput(timeDiv){
        const hrElement = timeDiv.querySelector("#hr").querySelector(".numInput");
        const minElement = timeDiv.querySelector("#min").querySelector(".numInput");
        const secElement = timeDiv.querySelector("#sec").querySelector(".numInput");

        const hr = parseInt(hrElement.textContent);
        const min = parseInt(minElement.textContent);
        const sec = parseInt(secElement.textContent);

        hrElement.textContent = Math.max(Math.min(hr + Math.floor(min / 60) + Math.floor (sec/(60*60)), 24), 0);
        minElement.textContent = Math.max((min % 60 + Math.floor(sec / 60)) % 60, 0);
        secElement.textContent = Math.max(sec % 60, 0);

        timeDiv.setAttribute("value", (parseInt(hrElement.textContent*(60*60)) + parseInt(minElement.textContent*60) + parseInt(secElement.textContent)));
    }

    function initNumericInput(){
        const target = document.querySelectorAll(".numInput");

        target.forEach(function(element){
            element.addEventListener("keypress", function(e) {
                if (isNaN(String.fromCharCode(e.which))) e.preventDefault();
            });
            element.addEventListener("blur", function(){
                element.textContent = parseInt(element.textContent);
                if(isNaN(element.textContent)) element.textContent = "0";
            });
        })
    }

    function updateTaskInfo(task){
        const content = task.querySelector("#content").textContent;
        const proTime = parseInt(task.querySelector("#processedTime").getAttribute("value"));
        const estTime = parseInt(task.querySelector("#estTime").getAttribute("value"));

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
        localStorage.setItem("TaskList", JSON.stringify(todos)); 
    }

    setInterval(function(){
        const taskList = document.getElementById("workingList");
        const tasks = taskList.querySelectorAll("#processedTime");
        tasks.forEach(function (timer) {
            const task = timer.parentElement.parentElement.parentElement.parentElement;
            if(task.querySelector(".editing") !== null){
                return;
            }

            let value = parseInt(timer.getAttribute("value")) + 1;
            timer.setAttribute("value", value);

            const hrElement = timer.querySelector("#hr").querySelector(".numInput");
            const minElement = timer.querySelector("#min").querySelector(".numInput");
            const secElement = timer.querySelector("#sec").querySelector(".numInput");

            hrElement.textContent = Math.floor(value/(60*60));
            minElement.textContent = Math.floor(value/60) % 60;
            secElement.textContent = value % 60;
            showTimeDiv(timer);

            todos = todos.map(function(todo) {
                if (todo.id == task.id) {
                    todo.processedTime = value;
                    return todo;
                }
                return todo;
            });
        });
        localStorage.setItem("TaskList", JSON.stringify(todos));
    }, 1000);


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