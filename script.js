"use script";


let li_links = document.querySelectorAll(".links ul li");
let view_wraps = document.querySelectorAll(".view_wrap");

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

function start() {

    toggleListView();
    getAndAppendData()

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

function getAndAppendData() {
    loadJSON()

    async function loadJSON() {
        const response = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
        const studentList = await response.json();

        prepareObjects(studentList);
    }

    function prepareObjects(studentList) {
        studentList.forEach(oneStudent => {
            const Student = {
                firstName: "",
                lastName: "",
                middleName: undefined,
                nickName: null,
                image: null,
                house: "",
                gender: "",
            };

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
            let house = "";
            let gender = "";
            let middle = fullname.substring(firstSpace + 1, lastSpace);
            if (middle.charAt(0) === `"`) {
                nickName = middle;
            } else {
                middleName = middle;
            }
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

            console.table(student);

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
        })
    }

}