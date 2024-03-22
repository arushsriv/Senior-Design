// // TODO new added
async function login(username, password) {
    try {
        console.log("feawfawef")
        console.log(username)
        console.log(password)
        console.log(JSON.stringify({ username, password }))
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        // if (response.status === 200) {
        //     const data = await response.json();
        //     // setLoggedIn(true);
        //     console.log("User data:", data);
        //     // window.location.href = '/home';
        // } else {
        //     // Handle non-200 responses here
            
        //     // TODO handle?
        //     alert('Invalid credentials!');
        //     console.error('Login failed with status:', response.status);
        // }
    } catch (error) {
        alert('Error during login. Please try again.');
        console.error('Error during login:', error);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Here, you would have your authentication logic.
        // Assuming the credentials are valid, redirect to the home page.

        // TODO 
        // backend
        console.log(username);


        
        // For demonstration, we assume any credentials are valid.
        // Replace this with actual validation logic.
        if (username && password) {

            // TODO
            // await login(username, password);

            // Redirect to popup.html
            // window.location.href = 'popup.html';
        } else {
            // TODO

            // Optionally handle incorrect credentials.
            alert('Invalid credentials!');
        }
    });
});