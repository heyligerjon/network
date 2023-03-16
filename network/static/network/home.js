document.addEventListener('DOMContentLoaded', () => {

    // Use buttons to toggle between views
    document.querySelector('#new-status-form').addEventListener('submit', add_status);

    // By default, load the statuses
    load_statuses();
});

function add_status(e) {
    
    e.preventDefault();

    // Parse the status form for content
    body = document.querySelector('#status-body').value
    fetch('/status/new', {
        method: 'POST',
        body: JSON.stringify({
            body: body
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.error) {
            console.log('Error:', result.error);
            return false;
        }
        console.log(result);
        load_statuses();
    })
}

function format_date() {

}

function load_statuses() {
    document.querySelector('#status-body').value = '';
    currentUser = document.querySelector('#profile-link').innerHTML;

    fetch('/home')
    .then(response => response.json())
    .then(statuses => {
        statuses.forEach(element => {
            const statusDiv = document.createElement('a');
            statusDiv.id = 'status-' + element.id;
            statusDiv.href = `status/${element.id}`
            statusDiv.className = 'list-group-item list-group-item-action';
            if (element.username === currentUser) {

                statusDiv.innerHTML = `
                <div class="d-lg-flex w-100 justify-content-lg-between" style="padding-top: .5rem;">
                    <div id="status-header" class="d-flex-lg w-25">
                        <img src="${element.profile_img}" style="max-width: 50px; border-radius: 100%; margin: 0 1rem 0 0;>"
                        <h4 class="mb-1">${element.name}</h4>
                    </div>
                    <small>${element.timestamp}</small>
                </div>
                <h5>@${element.username}</h6>
                <p class="mb-1">${element.body}</p>
                <div id="status-options" class="d-flex w-25 justify-content-start">
                    <button type="button" id="status-like" class="btn btn-primary">Like</button>
                    <p class="mb-1" id="status-reacts">${element.id}</p>
                    <button type="button" id="status-edit" class="btn btn-primary">Edit</button>
                </div>
            `
            }
            else {

                statusDiv.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <h4 class="mb-1">${element.name}</h4>
                    <small>${element.timestamp}</small>
                </div>
                <h6>@${element.username}</h6>
                <p class="mb-1">${element.body}</p>
                <div id="status-options" class="d-flex w-25 justify-content-start">
                    <button type="button" id="status-like" class="btn btn-primary">Like</button>
                    <p class="mb-1" id="status-reacts">${element.id}</p>
                </div>
            `
            }
            statusDiv.addEventListener('click', () => load_status(element.id))
            container = document.querySelector('.list-group');
            container.insertBefore(statusDiv, container.firstChild);
        })
    })
}