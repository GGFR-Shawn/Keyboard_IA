document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            alert('Connecté avec succès');
            window.location.href = '/index.html'; // Redirige vers la page principale après connexion
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
        alert('Une erreur s\'est produite.');
    }
});
