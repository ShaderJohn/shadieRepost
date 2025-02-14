document.getElementById('loginButton').addEventListener('click', function() {
    const token = document.getElementById('userToken').value;
    if (token) {
        localStorage.setItem('userToken', token);
        fetchUser Profile(token);
    } else {
        document.getElementById('errorMessage').innerText = 'Please enter a valid token.';
    }
});

async function fetchUser Profile(token) {
    try {
        const response = await fetch('https://discord.com/api/v10/users/@me', {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });
        if (!response.ok) throw new Error('Failed to fetch user profile');
        const userData = await response.json();
        displayUser Profile(userData);
        showPage('dashboard');
    } catch (error) {
        document.getElementById('errorMessage').innerText = error.message;
    }
}

function displayUser Profile(userData) {
    const profileInfo = `
        <p><strong>Username:</strong> ${userData.username}#${userData.discriminator}</p>
        <p><strong>User ID:</strong> ${userData.id}</p>
        <img src="https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png" alt="Avatar" />
    `;
    document.getElementById('profileInfo').innerHTML = profileInfo;
}

document.getElementById('sendMessageButton').addEventListener('click', async function() {
    const token = localStorage.getItem('userToken');
    const channelId = document.getElementById('channelId').value;
    const messageContent = document.getElementById('messageContent').value;

    if (channelId && messageContent) {
        try {
            const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: messageContent })
            });
            if (!response.ok) throw new Error('Failed to send message');
            document.getElementById('messageStatus').innerText = 'Message sent successfully!';
        } catch (error) {
            document.getElementById('messageStatus').innerText = error.message;
        }
    } else {
        document.getElementById('messageStatus').innerText = 'Please fill in all fields.';
    }
});

document.getElementById('deleteMessageButton').addEventListener('click', async function() {
    const token = localStorage.getItem('userToken');
    const channelId = document.getElementById('channelId').value;
    const messageId = prompt("Enter the message ID to delete:");

    if (channelId && messageId) {
        try {
            const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token
                }
            });
            if (!response.ok) throw new Error('Failed to delete message');
            document.getElementById('messageStatus').innerText = 'Message deleted successfully!';
        } catch (error) {
            document.getElementById('messageStatus').innerText = error.message;
        }
    } else {
        document.getElementById('messageStatus').innerText = 'Please fill in all fields.';
    }
});

function showPage(page) {
    const pages = ['home', 'login', 'dashboard', 'profile'];
    pages.forEach(p => {
        document.getElementById(p).style.display = (p === page) ? 'block' : 'none';
    });
}