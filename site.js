const ul = document.querySelector("ul");
const search = document.querySelector("#txtSearch");
const taskForm = document.querySelector("#taskForm");
const btnDeleteAll = document.querySelector("#btnDeleteAll");
const txtInput = document.querySelector("#txtInput");
const btnAddNewTask = document.querySelector("#btnAddNewTask");
const taskList = document.querySelector("#task-list");
const btnUpdateTask = document.querySelector("#btnUpdateTask");
const badge = document.querySelector("#badge");
const toastTrigger = document.getElementById("btnAddNewTask");
const toastLiveExample = document.getElementById("liveToast");

let updateIndex;
let updatedText = "";
let modeUpdate = false;
let liCollection = [];
let liArray = [];
let tasks = [];
let elements = [];
const objTasks = {};

let index = 1;

loadTasks();
eventListeners();

function loadTasks() {
	tasks = localStorage.getItem("tasks")
		? JSON.parse(localStorage.getItem("tasks"))
		: [];
	tasks
		? tasks.forEach((task) => {
				createElement(task[0], task[1]);
		  })
		: [];
}
function eventListeners() {
	btnAddNewTask.addEventListener("click", addNewTask);
	btnDeleteAll.addEventListener("click", deleteAll);
	taskList.addEventListener("click", deleteUpdateItem);
	btnUpdateTask.addEventListener("click", updateValue);
	search.addEventListener("keyup", filterElement);
	taskList.addEventListener("change", checkInput);
}
function addNewTask(e) {
	e.preventDefault();
	if (txtInput.value.trim().length == 0) {
		const toastBootstrap =
			bootstrap.Toast.getOrCreateInstance(toastLiveExample);
		txtInput.value.trim() === "" && toastBootstrap.show();
		txtInput.value = "";
		return;
	}
	if (modeUpdate) {
		updateValue();
	} else {
		elements.push(createElement(txtInput.value.trim()));
		elements.push(false);
		tasks.push(elements);
		localStorage.setItem("tasks", JSON.stringify(tasks));
		txtInput.value = "";
		elements = [];
		index++;
		badge.textContent = tasks.length;
	}
}
function createElement(task, task2) {
	const li = document.createElement("li");
	li.classList =
		index % 2 == 1
			? "list-group-item fs-5 d-flex justify-content-between"
			: "list-group-item list-group-item-dark fs-5 d-flex justify-content-between";
	li.appendChild(document.createTextNode(task));
	const div = document.createElement("div");
	div.classList = "d-flex px-2";
	const checkedDiv = document.createElement("div");
	checkedDiv.classList = "form-check form-switch";
	const checkedInput = document.createElement("input");
	checkedInput.classList = "form-check-input";
	checkedInput.setAttribute("type", "checkbox");
	checkedInput.setAttribute("id", "flexSwitchCheck");
	task2 == true && checkedInput.setAttribute("checked", "checked");
	checkedDiv.appendChild(checkedInput);
	const a = document.createElement("a");
	a.classList = "float-end";
	a.setAttribute("href", "#");
	a.innerHTML =
		"<i class='bi bi-pencil-square fs-5 text-warning px-2'></i><i class='bi bi-x-circle fs-5 text-danger px-2 me-2'></i>";
	div.appendChild(a);
	div.appendChild(checkedDiv);
	li.appendChild(div);

	task2 == true
		? li.classList.add(
				"bg-success",
				"text-light",
				"text-decoration-line-through"
		  )
		: li.classList.remove(
				"bg-success",
				"text-light",
				"text-decoration-line-through"
		  );
	taskList.appendChild(li);
	return li.textContent.trim();
}
function deleteAll() {
	const taskCount = tasks.length;
	if (taskCount != 0 && confirm("Are you sure?")) taskList.innerHTML = "";
	localStorage.clear();
	badge.textContent = tasks.length;
}
function deleteUpdateItem(e) {
	if (e.target.className === "bi bi-x-circle fs-5 text-danger px-2 me-2") {
		e.target.parentElement.parentElement.parentElement.remove();
		console.log(e.target.parentElement.parentElement.parentElement.textContent);
		let newTasks = tasks.filter((task) => {
			return (
				task[0] !=
				e.target.parentElement.parentElement.parentElement.textContent.trim()
			);
		});
		tasks = newTasks;
		localStorage.setItem("tasks", JSON.stringify(newTasks));
	} else if (
		e.target.className === "bi bi-pencil-square fs-5 text-warning px-2"
	) {
		txtInput.value =
			e.target.parentElement.parentElement.parentElement.textContent.trim();
		btnUpdateShow();
		modeUpdate = true;
		tasks.forEach((task, index) => {
			if (
				task[0] ===
				e.target.parentElement.parentElement.parentElement.textContent.trim()
			)
				updateIndex = index;
		});
	}
	liCollection = document.querySelectorAll("li");
	liArray = Array.from(liCollection);
	badge.textContent = tasks.length;
}
function updateValue() {
	tasks.forEach((task, index) => {
		if (index == updateIndex) {
			console.log(index, updateIndex);
			task[0] = txtInput.value.trim();
		}
	});

	localStorage.setItem("tasks", JSON.stringify(tasks));
	taskList.innerHTML = "";
	loadTasks();
	modeUpdate = false;
	txtInput.value = "";
	btnUpdateHide();
}
function checkInput(e) {
	console.log(e.target.parentElement.parentElement.parentElement.textContent);
	tasks.forEach((task) => {
		if (
			e.target.parentElement.parentElement.parentElement.textContent == task[0]
		)
			if (e.target.checked) {
				task[1] = true;
				console.log("true çalışıyor");
				e.target.parentElement.parentElement.parentElement.classList.add(
					"bg-success",
					"text-light",
					"text-decoration-line-through"
				);
			} else {
				task[1] = false;
				console.log("false çalışıyor");
				e.target.parentElement.parentElement.parentElement.classList.remove(
					"bg-success",
					"text-light",
					"text-decoration-line-through"
				);
			}
	});
	localStorage.setItem("tasks", JSON.stringify(tasks));
}
function btnUpdateHide() {
	btnAddNewTask.classList.remove("d-none");
	btnAddNewTask.classList.add("d-block");
	btnUpdateTask.classList.remove("d-block");
	btnUpdateTask.classList.add("d-none");
}
function btnUpdateShow() {
	btnUpdateTask.classList.remove("d-none");
	btnUpdateTask.classList.add("d-block");
	btnAddNewTask.classList.remove("d-block");
	btnAddNewTask.classList.add("d-none");
}
const filterFunc = (filterValue) => {
	Array.from(ul.children)
		.filter((todo) => !todo.textContent.toLowerCase().includes(filterValue))
		.forEach((todo) => todo.classList.add("filtered"));

	Array.from(ul.children)
		.filter((todo) => todo.textContent.toLowerCase().includes(filterValue))
		.forEach((todo) => todo.classList.remove("filtered"));
};
function filterElement() {
	const filterValue = search.value.trim().toLowerCase();
	filterFunc(filterValue);
}
