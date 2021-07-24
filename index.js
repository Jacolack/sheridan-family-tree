const masterList = document.getElementById('master-list')
var modal = document.getElementById("myModal");
var closeBtn = document.getElementById("close-modal");
var modalNickName = document.getElementById("modal-nick-name");
var modalFullName = document.getElementById("modal-full-name");
var modalBirthday = document.getElementById("modal-birthday");
var modalDiedLabel = document.getElementById("modal-died-label");
var modalDeathday = document.getElementById("modal-deathday");
const form = document.getElementById('form');
const passField = document.getElementById('inputPassword');
const loginModal = document.getElementById('loginModal');
const loginError = document.getElementById('loginError');
const development = false;
var nextBdayRecord = null
var nextBdayList = []

function checkQuestion(person) {
    return person.birthday.includes('?') || person.fullname.includes('?')
}

function checkBirthday(person) {
    if (person.birthday.includes('?')) {
        return false
    }
    var d = new Date();

    const bd = new Date((person.birthday + "T00:00:00").replace(/-/g, '\/').replace(/T.+/, ''))
    bd.setFullYear(d.getFullYear())
    if (bd < d) {
        bd.setFullYear(d.getFullYear() + 1)
    }

    if (!nextBdayRecord || nextBdayRecord.birthdate > bd) {
        nextBdayRecord = person
        nextBdayRecord.birthdate = bd
        nextBdayList = [nextBdayRecord]
    } else if (nextBdayRecord.birthdate.getTime() === bd.getTime()) {
        const tiedRecord = person
        tiedRecord.birthdate = bd
        nextBdayList.push(tiedRecord)
    }

    var datestring = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    const personBirthDate = new Date((person.birthday + "T00:00:00").replace(/-/g, '\/').replace(/T.+/, ''))
    personBirthDate.setFullYear(d.getFullYear())
    var personBirthdateStr = personBirthDate.getFullYear() + '-' + (personBirthDate.getMonth() + 1) + '-' + personBirthDate.getDate()
    return (personBirthdateStr === datestring)
}

function printChildren(family, personId, mateId, childList) {
    const person = family[personId]
    const children = family[person.mates[mateId]].children

    if (children) {
        children.forEach((element, index) => {
            const child = family[element]
            if (child.mates.length == 0) {
                const childItem = document.createElement("LI");
                childItem.className = "child-item"
                childList.appendChild(childItem)

                const childLink = document.createElement("A");
                //childLink.className = "blood-mate"
                if (checkBirthday(child)) {
                    childLink.className = "birthday"
                    childLink.innerHTML = "<span class='birthdayCake'>&#x1F382;</span>" + child.nickname
                } else if (checkQuestion(child)) {
                    childLink.innerHTML = child.nickname + "<span class='questionMark'>&#x2753;</span>"
                } else {
                    childLink.innerText = child.nickname
                }
                childLink.onclick = () => {
                    showModal(child)
                }
                childItem.appendChild(childLink)
            } else {
                const mateListItem = document.createElement("LI");
                mateListItem.className = "mate-list-item"
                childList.appendChild(mateListItem)

                const mateList = document.createElement("UL");
                mateList.className = "mate-list"
                mateListItem.appendChild(mateList)

                printMates(family, element, mateList)
            }
        });
    }
}

function printMates(family, personId, mateList) {
    const person = family[personId]
    person.mates.forEach((element, index) => {

        const mateItem = document.createElement("LI");
        mateItem.className = "mate-item"
        mateList.appendChild(mateItem)

        const matesHolder = document.createElement("DIV");
        matesHolder.className = "mates-holder"
        mateItem.appendChild(matesHolder)
        const bloodMateHolder = document.createElement("DIV");
        bloodMateHolder.className = "blood-mate-holder"
        matesHolder.appendChild(bloodMateHolder)


        if (index === 0) {
            const bloodMate = document.createElement("A");
            if (checkBirthday(person)) {
                bloodMate.className = "birthday blood-mate"
                bloodMate.innerHTML = "<span class='birthdayCake'>&#x1F382;</span>" + person.nickname
            } else if (checkQuestion(person)) {
                bloodMate.className = "blood-mate"
                bloodMate.innerHTML = person.nickname + "<span class='questionMark'>&#x2753;</span>"
            } else {
                bloodMate.className = "blood-mate"
                bloodMate.innerText = person.nickname
            }
            bloodMate.onclick = () => {
                showModal(person)
            }
            bloodMateHolder.appendChild(bloodMate)
        }

        const mateObj = family[element]
        const mateHolder = document.createElement("DIV");
        mateHolder.className = "mate-holder"
        matesHolder.appendChild(mateHolder)

        const mate = document.createElement("A");
        mate.className = "mate"

        if (checkBirthday(mateObj)) {
            mate.className = "birthday mate"
            mate.innerHTML = "<span class='birthdayCake'>&#x1F382;</span>" + mateObj.nickname
        } else if (checkQuestion(mateObj)) {
            mate.className = "mate"
            mate.innerHTML = mateObj.nickname + "<span class='questionMark'>&#x2753;</span>"
        } else {
            mate.className = "mate"
            mate.innerText = mateObj.nickname
        }

        mate.onclick = () => {
            showModal(mateObj)
        }
        mateHolder.appendChild(mate)

        if (family[family[personId].mates[index]].children) {
            const childList = document.createElement("UL");
            childList.className = "child-list"
            mateItem.appendChild(childList)
            printChildren(family, personId, index, childList)
        }
    });
}



function fixProblem1() {
    const matesHolders = document.getElementsByClassName("mates-holder");
    for (let element of matesHolders) {
        var bloodWidth = 0
        if (element.children[0].children[0]) {
            bloodWidth = element.children[0].children[0].getBoundingClientRect().width
        }
        const mateWidth = element.children[1].children[0].getBoundingClientRect().width
        if (bloodWidth > mateWidth) {
            element.style.width = 2 * bloodWidth + 40 + 'px'
        } else {
            element.style.width = 2 * mateWidth + 40 + 'px'
        }
    }

}

function fixProblem1Vert() {

    const bloodMateHolders = document.getElementsByClassName("blood-mate-holder");
    const mateHolders = document.getElementsByClassName("mate-holder");
    const childItems = document.getElementsByClassName("child-item");

    var maxLinkWidth = 0
    for (let element of bloodMateHolders) {
        if (element.children[0]) {
            const thisWidth = element.children[0].getBoundingClientRect().width
            if (thisWidth > maxLinkWidth) {
                maxLinkWidth = thisWidth
            }
        }
    }
    for (let element of mateHolders) {
        const thisWidth = element.children[0].getBoundingClientRect().width
        if (thisWidth > maxLinkWidth) {
            maxLinkWidth = thisWidth
        }
    }
    for (let element of childItems) {
        const thisWidth = element.children[0].getBoundingClientRect().width
        if (thisWidth > maxLinkWidth) {
            maxLinkWidth = thisWidth
        }
    }

    for (let element of bloodMateHolders) {
        element.style.width = maxLinkWidth + 'px'
    }
    for (let element of mateHolders) {
        element.style.width = maxLinkWidth + 'px'
    }
    for (let element of childItems) {
        element.style.width = maxLinkWidth + 'px'
    }
}


var ciphertext = ""
var familystr = ""
var familyJson = {}
function logSubmit(event) {
    try {
        if (!development) {
            event.preventDefault();

            console.log("wtf")
            console.log(ciphertext)
            console.log(passField.value)
            var bytes = CryptoJS.AES.decrypt(ciphertext, passField.value);
            const family = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } else {
            familyJson = JSON.parse(familystr);
        }
        printMates(familyJson, '0', masterList)
        fixProblem1Vert()
        buildNextBday()
        loginModal.hidden = true
    } catch (e) {
        console.log(e)
        loginError.hidden = false
        setTimeout(function () { loginError.hidden = true }, 1000)
    }
}

const log = document.getElementById('log');
form.addEventListener('submit', logSubmit);

var request = new XMLHttpRequest();

request.onload = () => {
    ciphertext = request.response
    form.hidden = false
};
request.open("get", "cipher.txt", true);
request.send();


var request2 = new XMLHttpRequest();

request2.onload = () => {
    familystr = request2.response
    if (development) {
        loginModal.hidden = true
        logSubmit()
    }
};
request2.open("get", "family.json", true);
request2.send();




// When the user clicks on <span> (x), close the modal
closeBtn.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


function showModal(personObj) {
    modalNickName.innerText = personObj.nickname
    modalFullName.innerText = personObj.fullname
    if (personObj.birthday.includes('?')) {
        modalBirthday.innerText = personObj.birthday
    } else {
        const d = new Date((personObj.birthday + "T00:00:00").replace(/-/g, '\/').replace(/T.+/, '')).toDateString().split(' ')
        modalBirthday.innerText = d[1] + ' ' + d[2] + ' ' + d[3]
    }

    if (personObj.deathday) {
        modalDiedLabel.style.display = "block";
        modalDeathday.innerText = personObj.deathday
    } else {
        modalDiedLabel.style.display = "none";
        modalDeathday.innerText = ""
    }
    modal.style.display = "block";
}

function buildNextBday() {
    const nextBday = document.getElementById('nextBday')
    const nextBdayTitle = document.createElement("h3");
    if (nextBdayList.length == 1) {
        nextBdayTitle.innerText = "Next birthday:"
    } else {
        nextBdayTitle.innerText = "Next birthdays:"
    }
    nextBday.appendChild(nextBdayTitle)
    nextBdayList.forEach(element => {
        const nextBdayPerson = document.createElement("h4");
        const d = element.birthdate.toDateString().split(' ')
        nextBdayPerson.innerText = element.fullname + ': ' + d[1] + ' ' + d[2]
        nextBday.appendChild(nextBdayPerson)

    });
}
