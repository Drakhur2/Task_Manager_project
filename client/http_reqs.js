// const { response } = require("express");

const http = new Library();
window.addEventListener('load', () => {
    const form = document.querySelector('#task');
    const input = document.querySelector('#task-input'); 
    const list = document.querySelector('#tasks');
    // Add task to the list
    let uri = 'http://localhost:3000/tasks';
    requestTasks();
    async function requestTasks(){
        let tasks;
        tasks = await http.Get(uri);
        console.log(tasks);
        showTasts(tasks);
    };

    async function showTasts(tasks){                      //this function handles most of the display and event listeners

        let addTasks = tasks.tsks;
        for (let i=0;i<addTasks.length;i++){
            console.log(addTasks[i].name);
            const task_element = document.createElement("div");
            task_element.classList.add("Task");

            const task_cont_el = document.createElement("div");
            task_cont_el.classList.add("content");

            task_element.appendChild(task_cont_el);                    //create a heirachical structure for the elements
                                                                           
            const task_input_el = document.createElement('input');
            task_input_el.classList.add("text");
            task_input_el.type= 'text';
            task_input_el.id = addTasks[i]._id;
            task_input_el.value= addTasks[i].name;
            task_input_el.setAttribute('readonly', 'readonly');

            task_cont_el.appendChild(task_input_el);

            const task_actions= document.createElement('div');
            task_actions.classList.add("actions");                                    //add action buttons

            const task_edit = document.createElement('button');
            task_edit.classList.add('edit');
            task_edit.innerHTML='Edit';

            const task_delete = document.createElement('button');
            task_delete.classList.add('delete');
            task_delete.innerHTML='Delete';

            const task_done = document.createElement('button');
            
            if (addTasks[i].completed) {
                task_input_el.style.color= 'green';                  //when the task is marked done it changes color and has line through
                task_input_el.style.textDecoration="line-through" ;
                task_done.classList.add('done');
                task_done.innerText = 'undo'; 
            }else{
                task_input_el.style.color= '#eceff1';
                task_done.classList.add('done');
                task_done.innerText='Done';
            }
            
            task_actions.appendChild(task_edit);
            task_actions.appendChild(task_delete);
            task_actions.appendChild(task_done);

            task_element.appendChild(task_actions);


            list.appendChild(task_element);

            // when a task is done it is marked and crossed out
            task_done.addEventListener('click', (event) => {

                event.stopPropagation();

                let isCompleted = task_done.innerText.toLocaleLowerCase() === 'done';
                task_input_el.style.color = isCompleted ? 'green' : '#eceff1';                  //event listener for done and undo
                task_input_el.style.textDecoration = isCompleted ? "line-through" : 'none';
                task_done.innerText = isCompleted ? 'Undo' : 'Done';
    
                const taskToUpdate = {
                    id: task_input_el.id,
                    name: task_input_el.value,
                    completed: isCompleted
                };
                sendRequest(taskToUpdate, 'done');
            });

            task_edit.addEventListener('click', () =>{
        
                if(task_edit.innerText.toLocaleLowerCase() == "edit"){
                    task_input_el.removeAttribute('readonly');
                    task_input_el.style.color = '#8b5cf6';
                    task_input_el.focus();
                    task_edit.innerText = "Save";
                }else{
                    
                    const taskToAdd = {
                        id: task_input_el.id,
                        name: task_input_el.value,
                        completed: false                                    // changes the status to false;
                    };
                    task_input_el.setAttribute("readonly", "readonly");
                    task_edit.innerText = 'Edit';
                    marker = 'edit'; 
                    sendRequest(taskToAdd, marker);
                }
            });

            //the task is deleted
            task_delete.addEventListener('click', () => {

                const taskToDelete = {
                    id :task_input_el.id,                         //i used the server id that was it makes it easy to delete
                    name: task_input_el.value,
                };

                sendRequest(taskToDelete, 'delete');         //sends the request to delete it and removes the element
                list.removeChild(task_element);
                
            });
        }
    }

    async function sendRequest(req, type){
        let response;
        try{
            switch(type){
                case 'edit':
                    response = await http.Put(`${uri}/${req.id}`, req);    
                    break;
                case 'done':
                    response = await http.Put(`${uri}/${req.id}`, req);
                    break;
                case 'delete':
                    response = await http.Delete(`${uri}/${req.id}`, req);
                    break;
                case 'add':                                                 //the function that sends the http requests to the library
                    console.log('posting');
                    response = await http.Post(uri, req);
                    console.log('worked');
                    break;
                default:
                    throw new error(`error: unknown request type ${type}`);                
            }
            console.log('Sending requests');
            requestTasks();
            return;

        }catch(error){
            window.alert(`Possiblly a duplicate: ${error}`);               //post will throw an error if a task already exists
        }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = input.value;
        
        if(!task){
            alert("Please enter a valid task");                  //adding a new task to the list
            return;
        }  
        input.value = "";
        let newTask = {
            name: task,
            completed: false
        };
        sendRequest(newTask, 'add');
    });

});
