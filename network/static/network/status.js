document.addEventListener('DOMContentLoaded', () => {

    const statusId = document.querySelector('#status-id').innerHTML

    // Use buttons to toggle between views
    document.querySelector('#status-reply').addEventListener('click', () => 
        open_reply());
    document.querySelector('#status-edit').addEventListener('click', () => 
        open_edit());
    document.querySelector('#status-like').addEventListener('click', () => 
        react(statusId));

    document.querySelector('#status-form').addEventListener('submit', event => {
        event.preventDefault();
        edit_status(statusId);
    });
    document.querySelector('#comment-form').addEventListener('submit', () => {
        reply(statusId);
    });
    // Hide the comment box and status editor initially
    document.querySelector('#status-body').style.display = 'block'
    document.querySelector('#comment-box').style.display = 'none'
    document.querySelector('#status-form').style.display = 'none'
});

function open_reply() {

    // Clear out text field
    document.querySelector('#comment-body').value = ''

    // Display the comment box and add a click handler to send button
    document.querySelector('#comment-box').style.display = 'block'
}

function open_edit() {

    document.querySelector('#status-editor').value = document.querySelector('#status-body').innerHTML

    form = document.querySelector('#status-form').style.display
    body = document.querySelector('#status-body').style.display

    const display = [form, body]
    for (i in display) {
        if(display[i] === 'none')
            display[i] = 'block'
        else
            display[i] = 'none'
    }

    document.querySelector('#status-form').style.display = display[0]
    document.querySelector('#status-body').style.display = display[1]
}

function reply(statusId) {

    // Parse document and form for parameters and POST
    username = document.querySelector('#status-user').innerHTML
    body = document.querySelector('#comment-body').value

    fetch(`${statusId}/comment`, {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            body: body,
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.error) {
            console.log('Error:', result.error);
            return false;
        }
        console.log(result);
        //load_status(statusId)
    })
    window.location.reload()
}

function edit_status(statusId) {

    csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
    body = document.querySelector('#status-editor').value

    document.querySelector('#status-editor').value = '';
    document.querySelector('#status-form').style.display = 'none';
    document.querySelector('#status-body').style.display = 'block';
    document.querySelector('#status-body').innerHTML = body;
    fetch(`${statusId}/edit`, {
        method: 'PUT',
        headers: {'X-CSRFToken': csrftoken},
        body: JSON.stringify({
            body: body
        })
    })
    return false;
}

function react(statusId) {

    csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
    fetch(`${statusId}/react`, {
        method: 'POST',
        headers: {"X-CSRFToken": csrftoken},
    })
    .then(response => response.json())
    .then(result => {
        if (result.error) {
            console.log('Error:', result.error);
            return false;
        }
        console.log(result.message);
        document.querySelector('#status-reacts').innerHTML = result.reactions;
    })
}