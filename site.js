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
				createElement(task);
		  })
		: [];
}
function eventListeners() {
	btnAddNewTask.addEventListener("click", addNewTask);
	btnDeleteAll.addEventListener("click", deleteAll);
	taskList.addEventListener("click", deleteUpdateItem);
	btnUpdateTask.addEventListener("click", updateValue);
	search.addEventListener("keyup", filterElement);
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
		tasks.push(createElement(txtInput.value.trim()));
		localStorage.setItem("tasks", JSON.stringify(tasks));
		txtInput.value = "";
		index++;
		badge.textContent = tasks.length;
	}
}
function createElement(text) {
	const li = document.createElement("li");
	li.classList =
		index % 2 == 1
			? "list-group-item fs-5 d-flex justify-content-between"
			: "list-group-item list-group-item-dark fs-5 d-flex justify-content-between";
	li.appendChild(document.createTextNode(text));
	const div = document.createElement("div");
	div.classList = "d-flex px-2";
	const checkedDiv = document.createElement("div");
	checkedDiv.classList = "form-check form-switch";
	const checkedInput = document.createElement("input");
	checkedInput.classList = "form-check-input";
	checkedInput.setAttribute("type", "checkbox");
	checkedInput.setAttribute("id", "flexSwitchCheck");
	checkedDiv.appendChild(checkedInput);
	const a = document.createElement("a");
	a.classList = "float-end";
	a.setAttribute("href", "#");
	a.innerHTML =
		"<i class='bi bi-pencil-square fs-5 text-warning px-2'></i><i class='bi bi-x-circle fs-5 text-danger px-2'></i>";
	div.appendChild(a);
	div.appendChild(checkedDiv);
	li.appendChild(div);
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
	if (e.target.className === "bi bi-x-circle fs-5 text-danger px-2") {
		e.target.parentElement.parentElement.parentElement.remove();
		console.log(e.target.parentElement.parentElement.parentElement.textContent);
		let newTasks = tasks.filter((item) => {
			return (
				item !=
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
		tasks.forEach((item, index) => {
			if (
				item ===
				e.target.parentElement.parentElement.parentElement.textContent.trim()
			)
				updateIndex = index;
		});
	} else if (e.target.className === "form-check-input") {
	}
	liCollection = document.querySelectorAll("li");
	liArray = Array.from(liCollection);
	badge.textContent = tasks.length;
}
function updateValue() {
	liArray.forEach((item, index) => {
		if (index == updateIndex) {
			item.textContent = txtInput.value.trim();
			const div = document.createElement("div");
			div.classList = "d-flex px-2";
			const checkedDiv = document.createElement("div");
			checkedDiv.classList = "form-check form-switch";
			const checkedInput = document.createElement("input");
			checkedInput.classList = "form-check-input";
			checkedInput.setAttribute("type", "checkbox");

			checkedInput.setAttribute("id", "flexSwitchCheck");

			checkedDiv.appendChild(checkedInput);
			const a = document.createElement("a");
			a.classList = "float-end";
			a.setAttribute("href", "#");
			a.innerHTML =
				"<i class='bi bi-pencil-square fs-5 text-warning px-2'></i><i class='bi bi-x-circle fs-5 text-danger px-2'></i>";
			div.appendChild(a);
			div.appendChild(checkedDiv);

			item.appendChild(div);

			tasks[index] = item.textContent.trim();
			localStorage.setItem("tasks", JSON.stringify(tasks));
		}
	});

	modeUpdate = false;
	txtInput.value = "";
	btnUpdateHide();
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
