"use script";

let li_links = document.querySelectorAll(".links ul li");
let view_wraps = document.querySelectorAll(".view_wrap");
let newAtt;

let filterBy = "all";
let sortBy;
let sortDir;


const Student = {
    firstName: "",
    lastName: "",
    middleName: undefined,
    nickName: null,
    image: null,
    house: "",
    gender: "",
};

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

function start() {

    toggleListView();
    loadJSON();
    document.querySelectorAll(".filter").forEach(filterButton => {
        filterButton.addEventListener("click", GetFilterAttribute);
    });
    document.querySelectorAll("[data-action='sort']").forEach(sortButton => {
        sortButton.addEventListener("click", getSortingAttribute);
    });

}

function toggleListView() {

    li_links.forEach(function (link) {
        link.addEventListener("click", function () {
            li_links.forEach(function (item) {
                item.classList.remove("active");
            })

            link.classList.add("active");
            let li_view = link.getAttribute("data-view");
            view_wraps.forEach(function (view) {
                view.style.display = "none";
            })
            if (li_view === "list-view") {
                document.querySelector("." + li_view).style.display = "";
            } else {
                document.querySelector("." + li_view).style.display = "";
            }
        })
    })
}

async function loadJSON() {
    const response = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
    const studentList = await response.json();

    prepareObjects(studentList);
}

function prepareObjects(studentList) {
    studentList.forEach(oneStudent => {
        const fullname = oneStudent.fullname.trim();
        const firstSpace = fullname.indexOf(" ");
        const lastSpace = fullname.lastIndexOf(" ");
        let firstName = "";
        let lastName = "";
        if (lastSpace != -1) {
            firstName = fullname.substring(0, firstSpace);
            lastName = fullname.substring(lastSpace + 1);
        } else {
            firstName = fullname;
            lastName = "";
        }
        let middleName = "";
        let nickName = "";
        let middle = fullname.substring(firstSpace + 1, lastSpace);
        if (middle.charAt(0) === `"`) {
            nickName = middle;
        } else {
            middleName = middle;
        }

        let house = "";
        let gender = "";
        gender = oneStudent.gender;
        house = oneStudent.house.trim();

        middleName = capitalization(middleName);
        firstName = capitalization(firstName);
        nickName = capitalization(nickName);
        lastName = capitalization(lastName);
        house = capitalization(house);
        gender = oneStudent.gender;
        if (lastName === "Patil") {
            image = lastName.toLowerCase(0) + "_" + firstName.toLowerCase(0) + ".png";
        }
        else if (lastName === "Finch-Fletchley") {
            image = lastName.substring(lastName.indexOf("-") + 1).toLowerCase(0) +
                "_" +
                firstName.charAt(0).toLowerCase() +
                ".png";
        }
        else {
            image =
                lastName.toLowerCase(0) +
                "_" +
                firstName.charAt(0).toLowerCase() +
                ".png";
        }

        function capitalization(data) {


            if (data.indexOf("-") != -1) {
                let hyphen = data.indexOf("-");
                return data.substring(0, hyphen + 1) + data.charAt(hyphen + 1).toUpperCase() + data.substring(hyphen + 2).toLowerCase();
            } else {
                return data.charAt(0).toUpperCase() + data.slice(1).toLowerCase();
            }
        }
        const student = Object.create(Student);
        student.firstName = firstName;
        student.middleName = middleName;
        student.lastName = lastName;
        student.nickName = nickName;
        student.house = house;
        student.gender = gender;
        student.image = image;
        allStudents.push(student);

    })
    console.log(allStudents);
    displayList(allStudents);
    return student;

}
function GetFilterAttribute(event) {
    let oldAtt = newAtt;
    newAtt = event.target.dataset.filter;
    let button = document.querySelector(`[data-filter="${newAtt}"]`);
    let oldbutton = document.querySelector(`[data-filter="${oldAtt}"]`);
    console.log(oldAtt);
    console.log(newAtt);
    if (oldAtt === newAtt) {
        filterBy = "";
        setFilter(filterBy);
        button.style.padding = "4px 8px";
        newAtt = undefined;
    } else {
        if (oldbutton !== null) {
            button.style.padding = "4px 8px"
        }
        filterBy = newAtt;
        button.style.padding = "2px 4px"
        // filterList(filterBy);
        console.log(filterBy);
        setFilter(filterBy)
    }
}
function setFilter(filter) {
    buildList();
    filterBy = filter;

}

function filterList(filteredList) {
    // let filteredList;
    if (filterBy === "Gryffindor") {
        filteredList = allStudents.filter(isGryffindor);
    } else if (filterBy === "Slytherin") {
        filteredList = allStudents.filter(isSlytherin);
    } else if (filterBy === "Hufflepuff") {
        filteredList = allStudents.filter(isHufflepuff);
    } else if (filterBy === "Ravenclaw") {
        filteredList = allStudents.filter(isRavenclaw);
    } else {
        filteredList = allStudents;
    }
    return filteredList;
}
function isGryffindor(student) {
    return student.house === "Gryffindor";
}
function isSlytherin(student) {
    return student.house === "Slytherin";
}
function isHufflepuff(student) {
    return student.house === "Hufflepuff";
}
function isRavenclaw(student) {
    return student.house === "Ravenclaw";
}


function getSortingAttribute(event) {
    sortBy = event.target.dataset.sort;
    sortDir = event.target.dataset.sortDirection;

    if (sortDir === "asc") {
        event.target.dataset.sortDirection = "desc";
    } else {
        event.target.dataset.sortDirection = "asc";
    }
    setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
    sortBy = sortBy;
    sortDir = sortDir;
    buildList();

}

function sortingList(sortedList) {
    let direction = 1;

    if (sortDir === "asc") {
        direction = -1;
    }
    sortedList = sortedList.sort(compare);


    function compare(a, b) {
        if (a[sortBy] < b[sortBy]) {
            return -1 * direction
        } else { return 1 * direction }
    }
    // displayList(sortedList);
    return sortedList;
}
function buildList() {
    const curentList = filterList(allStudents);
    currentList = sortingList(curentList);
    displayList(currentList);
}

function displayList(students) {
    document.querySelector("tbody").innerHTML = "";
    document.querySelector("#grid-students").innerHTML = "";
    students.forEach(displayStudentList);
}

function displayStudentList(student) {
    const template = document.querySelector("#tableTemp").content;
    const copy = template.cloneNode(true);

    copy.querySelector(".table_firstName").innerHTML = student.firstName;
    copy.querySelector(".table_lastName").innerHTML = student.lastName;
    copy.querySelector(".table_house").innerHTML = student.house;
    copy.querySelector(".table_image img").src = `./images/${student.image}`
    document.querySelector("tbody").appendChild(copy);


    const templateGrid = document.querySelector("#gridTemp").content;
    const copyGrid = templateGrid.cloneNode(true);

    copyGrid.querySelector(".grid_firstName").innerHTML = student.firstName;
    copyGrid.querySelector(".grid_lastName").innerHTML = student.lastName;
    copyGrid.querySelector(".grid_house").innerHTML = student.house;
    copyGrid.querySelector(".grid_image img").src = `./images/${student.image}`
    document.querySelector("#grid-students").appendChild(copyGrid);
}

