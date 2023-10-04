window.onload = function(){
    initTooltip();
}
function initTooltip(){
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
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

    var todos = [];
    var isEditing = false;

    var input = document.getElementById("newTaskName");
    input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("btn-create").click();
    }
    });
    
    function newTask(){
        var inputValue = document.getElementById("newTaskName").value;
        if (inputValue) {
            var taskCode = document.createElement("div");
            taskCode.innerHTML = `
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
                                <span class="editable align-items-center center p-2 px-1">
                                    -
                                </span>
                                <i class="fa-solid fa-hourglass-half"></i>
                            </div>
                        </div>
                        <div class="badge text-bg-warning py-0 mx-1">
                            <div class="d-flex align-items-center justify-content-end text-end" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Estimate time">
                                <span class="editable align-items-center center p-2 px-1">
                                    -
                                </span>
                                <i class="fa-solid fa-stopwatch"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        var taskContainer = document.getElementById("pendingList");
        taskContainer.appendChild(taskCode);
        document.getElementById("newTaskName").value = "";
        initTooltip();
        }
    }

    function deleteTask(e) {
        deleteTooltip();
        e.parentElement.parentElement.parentElement.remove();
        initTooltip();
    }

    function editTask(editButton) {
        var task = editButton.parentElement.parentElement.parentElement;
        var editableElements = task.querySelectorAll(".editable");

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
            console.log(e.target);

            setTimeout(() => {
                e.target.classList.add('moving');
            }, 0);
            e.dataTransfer.effectAllowed = 'move';
        };

        list.ondragend = e => {
            e.target.classList.remove('moving');
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

            last([e.target, sourceNode]);
            console.log(children.indexOf(sourceNode) + "+" + children.indexOf(e.target));
        };
    });

    function record(eleAll){
        for (let i=0; i < eleAll.length; i++){
            const {top, left} = eleAll[i].getBoundingClientRect();
            eleAll[i]._top = top;
            eleAll[i]._left = left;
        }
    }

    function last(eleAll){
        for(let i=0;i<eleAll.length;i++){
            const dom=eleAll[i];
            const {top,left}=dom.getBoundingClientRect();
            if(dom._left){
                dom.style.transform=`translate3d(${dom._left-left}px,${dom._top-top}px,0px)`;
                let rafId=requestAnimationFrame(function(){
                    dom.style.transition='transform 0.3s ease-out';
                    dom.style.transform='none';
                })
                dom.addEventListener('transitionend',()=>{
                    dom.style.transition='none';
                    cancelAnimationFrame(rafId);
                })
            }
        }
    }