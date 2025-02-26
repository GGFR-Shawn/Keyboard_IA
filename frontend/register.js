// frontend/register.js
document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();

        if (response.ok) {
            alert('Inscription réussie !');
            window.location.href = '/login.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
        alert('Une erreur s\'est produite.');
    }
});
