$(document).ready(function () {
    // Elementit
    const $todoForm = $('#todoForm');
    const $taskInput = $('#taskInput');
    const $todoList = $('#todoList');
    const $errorMsg = $('#errorMsg');

    // Haetaan tehtävät localStoragesta
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Päivitä UI, kun sivu ladataan
    renderTodos();

    // Tehtävän lisääminen
    $todoForm.on('submit', function (e) {
        e.preventDefault();
        const taskText = $taskInput.val().trim();

        if (taskText === '' || taskText.length < 3) {
            $errorMsg.text('Tehtävän on oltava vähintään 3 merkkiä pitkä.');
            $taskInput.addClass('is-invalid'); // Bootstrapin luokka
        } else {
            $errorMsg.text('');
            $taskInput.removeClass('is-invalid');

            // Lisää tehtävä slideDown-tehostella
            const newTask = { text: taskText, completed: false };
            todos.push(newTask);
            saveTodos();
            renderTodos();

            // Puhdista syötekenttä ja lisää tehoste
            $taskInput.val('');
            $('#todoList li:last').hide().slideDown();
        }
    });

    // Renderöi tehtävät listaan
    function renderTodos() {
        $todoList.empty(); // Tyhjennä lista
        todos.forEach((todo, index) => {
            const $li = $('<li>')
                .addClass('list-group-item d-flex justify-content-between align-items-center')
                .toggleClass('list-group-item-success', todo.completed);

            const $taskText = $('<span>').text(todo.text);

            // Merkitse tehtävä tehdyksi (fadeOut > fadeIn)
            const $completeBtn = $('<button>')
                .addClass('btn btn-sm btn-primary me-2')
                .text(todo.completed ? 'Peruuta' : 'Valmis')
                .on('click', function () {
                    $li.fadeOut(300, function () {
                        todos[index].completed = !todos[index].completed;
                        saveTodos();
                        renderTodos();
                        $li.fadeIn(300);
                    });
                });

            // Poista tehtävä (fadeOut)
            const $deleteBtn = $('<button>')
                .addClass('btn btn-sm btn-danger')
                .text('Poista')
                .on('click', function () {
                    $li.fadeOut(300, function () {
                        todos.splice(index, 1);
                        saveTodos();
                        renderTodos();
                    });
                });

            $li.append($taskText, $completeBtn, $deleteBtn);
            $todoList.append($li);
        });
    }

    // Tehtävien tallennus localStorageen
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
});

