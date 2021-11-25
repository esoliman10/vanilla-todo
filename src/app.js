// MGA TO DO ELEMENTS
window.onload = function () {
  const clear = document.querySelector('.clear');
  const dateElement = document.getElementById('date');
  const list = document.getElementById('list');
  const input = document.getElementById('input');
  const showCompletedBtn = document.getElementById('showCompleted');
  const showActiveBtn = document.getElementById('showActive');
  const showAllBtn = document.getElementById('showAll');
  const listeners = [];

  // MGA TO DO CLASSES
  const CHECK = 'fa-check-circle';
  const UNCHECK = 'fa-circle-thin';
  const LINE_THROUGH = 'lineThrough';

  localStorage.setItem('showAll', 'yes');
  localStorage.setItem('showDone', 'no');

  // MGA VARIABLES
  let LIST;
  let id;

  // KUNIN ANG ITEM SA LOCALSTORAGE
  let data = localStorage.getItem('TODO');

  // TIGNAN KUNG MERONG TASK NA NILAGAY
  if (data) {
    LIST = JSON.parse(data);
    id = LIST.length; // ISET ANG SUSUNOD NA ID NUMBER SA LIST
    loadList(LIST); // ILOAD ANG LIST SA USER INTERFACE
  } else {
    LIST = [];
    id = 0;
  }

  // ILOAD ANG ITEM SA USER INTERFACE
  function loadList(array = [], showAll = true, renderDoneOnly = false) {
    if (showAll) {
      return array.forEach(function (item) {
        addToDo(item.name, item.id, item.done, item.trash);
      });
    }

    return array
      .filter(function (item) {
        return renderDoneOnly ? item.done : !item.done;
      })
      .forEach(function (item) {
        addToDo(item.name, item.id, item.done, item.trash);
      });
  }

  showActiveBtn.addEventListener('click', function () {
    list.innerHTML = '';
    localStorage.setItem('showAll', 'no');
    localStorage.setItem('showDone', 'no');
    loadList(LIST, false, false);
  });

  showCompletedBtn.addEventListener('click', function () {
    list.innerHTML = '';
    localStorage.setItem('showAll', 'no');
    localStorage.setItem('showDone', 'yes');
    loadList(LIST, false, true);
  });

  showAllBtn.addEventListener('click', function () {
    list.innerHTML = '';
    localStorage.setItem('showAll', 'yes');
    loadList(LIST, true);
  });

  // ALISIN LAHAT NG TASK
  clear.addEventListener('click', function () {
    localStorage.clear();
    location.reload();
  });

  // ANG PETSA NGAYONG ARAW
  const options = {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  const today = new Date();
  dateElement.innerHTML = today.toLocaleDateString('en-US', options);

  // ADD NG TO DO FUNCTION
  function addToDo(toDo, id, done, trash) {
    if (trash) {
      return;
    }

    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : '';

    const item = `
                    <li class="item">
                      <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                      <p class="text ${LINE}"> ${toDo} </p>
                      <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                    </li>
                  `;

    const position = 'beforeend';

    list.insertAdjacentHTML(position, item);
  }

  // ADD NG ITEM SA LIST GAMIT ANG ENTER KEY
  document.addEventListener('keyup', function (event) {
    const isShowAll = localStorage.getItem('showAll');
    const isShowDone = localStorage.getItem('showDone');

    if (event.keyCode === 13) {
      const toDo = input.value;

      // KAPAG ANG INPUT AY WALA
      if (toDo) {
        if (isShowAll === 'yes' || isShowDone === 'no') {
          addToDo(toDo, id, false, false);
        }

        LIST.push({
          name: toDo,
          id: id,
          done: false,
          trash: false,
        });

        // PAGSAVE NG MGA TASK
        // laging gamitin kapag may list na gustong iupdate
        localStorage.setItem('TODO', JSON.stringify(LIST));

        id++;
      }
      input.value = '';
    }
  });

  // COMPLETE NA ANG TODO
  function completeToDo(element) {
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector('.text').classList.toggle(LINE_THROUGH);

    LIST[element.id].done = LIST[element.id].done ? false : true;
  }

  // REMOVE ANG TO DO
  function removeToDo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);

    LIST[element.id].trash = true;
  }

  // TARGETIN ANG ITEM NA GINAWA
  list.addEventListener('click', function (event) {
    const element = event.target; // return the click element inside list
    const elementJob = element.attributes.job.value; // complete or delete

    if (elementJob === 'complete') {
      completeToDo(element);
    } else if (elementJob === 'delete') {
      removeToDo(element);
    }

    // PAGSAVE NG MGA TASK
    // laging gamitin kapag may list na gustong iupdate
    localStorage.setItem('TODO', JSON.stringify(LIST));
  });
};
