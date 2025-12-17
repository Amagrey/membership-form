const fullName = document.getElementById('full-name');
const stateCode = document.getElementById('state-code');
const ppa = document.getElementById('ppa');
const phone = document.getElementById('phone');
const addEl = document.getElementById('add-el');
const membersForm = document.getElementById('membersForm');
const closeEl = document.getElementById('close-el');
const submitBtn = document.getElementById('submit-btn');
const membersTbody = document.querySelector('.members-info');
const searchBar = document.getElementById('searchBar');

// error elements
const fnErr = document.getElementById('fn-err');
const scErr = document.getElementById('sc-err');
const paErr = document.getElementById('pa-err');
const phnErr = document.getElementById('phn-err');


// validation while submitting
submitBtn.addEventListener('click', (e) => {
  e.preventDefault();

  let hasErrors = false;


  if (fullName.value.trim() === '') {
    fnErr.textContent = 'full name cannot be empty';
    fnErr.style.color = 'red';
    fullName.style.border = '1px solid red';
    hasErrors = true;
  } else {
    fnErr.textContent = '';
    fullName.style.border = '1px solid #ccc';
  }

  if (stateCode.value.trim() === '') {
    scErr.textContent = 'state code is required';
    scErr.style.color = 'red';
    stateCode.style.border = '1px solid red';
    hasErrors = true;
  } else {
    scErr.textContent = '';
    stateCode.style.border = '1px solid #ccc';
  }

  if (ppa.value.trim() === '') {
    paErr.textContent = 'ppa is required';
    paErr.style.color = 'red';
    ppa.style.border = '1px solid red';
    hasErrors = true;
  } else {
    paErr.textContent = '';
    ppa.style.border = '1px solid #ccc';
  }

  const phoneRegex = /^\d{11}$/;

  if (!phoneRegex.test(phone.value.trim())) {
    phnErr.textContent = 'phone number must be 11 digits';
    phnErr.style.color = 'red';
    phone.style.border = '1px solid red';
    hasErrors = true;
  } else {
    phnErr.textContent = '';
    phone.style.border = '1px solid #ccc';
  }

  if (hasErrors) {
    membersForm.style.display = 'block';
    return;
  }

  const members = JSON.parse(localStorage.getItem('members') || '[]');  

  //edit button
  const editId = membersForm.dataset.editId;

  const member = {
    name: fullName.value.trim(),
    code: stateCode.value.trim(),
    ppa: ppa.value.trim(),
    phone: phone.value.trim(),
    id: editId ? Number(editId) : Date.now(),
  };

  if (editId) {
    // updating existing member
    const index = members.findIndex((m) => m.id === Number(editId));

    // for editing the old data
    members[index] = member;


    // clearing edit info on the form after updated
    membersForm.dataset.editId = ''; // pining this

  } else {
    // adding new data uses '.push'
    members.push(member);
  }

  // saving to localStorage and refresh table
  localStorage.setItem('members', JSON.stringify(members));
  loadMembers();
  membersForm.reset();
  membersForm.style.display = 'none';
});

// for the add member button to display the form
addEl.addEventListener('click', (e) => {
  e.preventDefault();
  membersForm.style.display = 'block';
});

// close form with the close icon
closeEl.addEventListener('click', (e) => {
  e.preventDefault();
  membersForm.style.display = 'none';
});

// load members
function loadMembers() {
  membersTbody.innerHTML = '';
  const members = JSON.parse(localStorage.getItem('members') || '[]');
  members.forEach(addMemberToTable);
}

// adding member (inputed information, rather than using the one in html) to table
function addMemberToTable(member) {
  const tr = document.createElement('tr');
  tr.setAttribute('data-id', member.id);
  tr.innerHTML = `
    <td>${member.name}</td>
    <td>${member.code}</td>
    <td>${member.ppa}</td>
    <td>${member.phone}</td>
    <td>
      <a href="#" onclick="editMember(${member.id})" class="editbtn">Edit</a>
      <a href="#" onclick="deleteMember(${member.id})" class="deletebtn">Delete</a>
    </td>
  `;
  membersTbody.appendChild(tr);
}


loadMembers();

function editMember(memberId) {
  const members = JSON.parse(localStorage.getItem('members') || '[]');
  const memberToEdit = members.find((member) => member.id === memberId);

  if (!memberToEdit) return;

  membersForm.style.display = 'block';

  fullName.value = memberToEdit.name;
  stateCode.value = memberToEdit.code;
  ppa.value = memberToEdit.ppa;
  phone.value = memberToEdit.phone;

  membersForm.dataset.editId = memberId;
  submitBtn.textContent = 'Update';
}

function deleteMember(memberId) {
  
  let members = JSON.parse(localStorage.getItem('members')) || [];

  members = members.filter(member => member.id !== memberId);

  localStorage.setItem('members', JSON.stringify(members));


  loadMembers();
}

searchBar.addEventListener('keyup', function () {
  const searchValue = searchBar.value.toLowerCase();
  const rows = membersTbody.querySelectorAll('tr');

  rows.forEach(row => {
    const rowText = row.innerText.toLowerCase();

    if (rowText.includes(searchValue)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});

// Things to note
// you can write inside javascript to display like html 