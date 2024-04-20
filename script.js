"strict mode";
const notesContainer = document.querySelector(".notes-input");
const createBtn = document.querySelector(".create--note--btn");

let notes = [];

const renderNote = function (note = {}) {
  const markup = `<div class="note--box" data-id = "${note.id ? note.id : ""}" >
    <textarea class="note--body" name="note" rows="4" cols="20">${
      note.content ? note.content : ""
    }
    </textarea>
    <button class="note--delete">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="#000000"
        viewBox="0 0 256 256"
        class="btn-del--icon"
      >
        <path
          d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"
        ></path>
      </svg>
    </button>
    </div>`;

  notesContainer.insertAdjacentHTML("beforeend", markup);
};

const createNote = function (selectedEl) {
  const newNote = {
    id: Date.now(),
    content: selectedEl.value.trim(),
  };
  notes.push(newNote);
  updateLocalStorage();
};

const updateLocalStorage = function () {
  localStorage.setItem("Note", JSON.stringify(notes));
};

const loadSavedNotes = function () {
  const savedNotes = JSON.parse(localStorage.getItem("Note")) || [];
  notes = savedNotes;
  notes.forEach((note) => {
    renderNote(note);
  });
};

const deleteNote = function (clickedEl) {
  const confirmation = confirm("Are you sure you want to delete this note?");
  if (confirmation) {
    const clickedNote = clickedEl.closest(".note--box");
    clickedNote.remove();
    const removedNoteId = Number(clickedNote.dataset.id);
    notes = notes.filter((note) => note.id !== removedNoteId);
    updateLocalStorage();
  }
};

// Event-Listeners:

// 1. Render Saved Notes from Local Storage
window.addEventListener("load", loadSavedNotes);

// 2. Create New Notes
createBtn.addEventListener("click", renderNote);

// 3. Add and Update notes
notesContainer.addEventListener("change", function (e) {
  if (
    e.target.tagName.toLowerCase() === "textarea" &&
    !e.target.closest(".note--box").dataset.id
  ) {
    createNote(e.target);
  }
  if (
    e.target.tagName.toLowerCase() === "textarea" &&
    e.target.closest(".note--box").dataset.id
  ) {
    const editedNoteId = Number(e.target.closest(".note--box").dataset.id);
    const editedNoteContent = e.target
      .closest(".note--box")
      .firstElementChild.value.trim();

    notes = notes.map((note) => {
      if (note.id === editedNoteId) {
        note.content = editedNoteContent;
      }
      return note;
    });
    updateLocalStorage();
  }
});

// 4. Delete notes
notesContainer.addEventListener("click", function (e) {
  const deleteBtn = e.target.closest(".note--delete");
  if (!deleteBtn) return;
  deleteNote(deleteBtn);
});
