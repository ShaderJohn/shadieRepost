document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.url-link');
    const channelLinks = document.querySelectorAll('.channel-link');
    const contents = document.querySelectorAll('.content');
    const toast = document.getElementById('toast');
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(navLink => {
        navLink.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.dataset.target;
            contents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(targetId).classList.add('active');
        });
    });

    function handleLinkClick(event) {
        showToast();
        setTimeout(() => {
            window.open(this.href, '_blank');
        }, 1000);
    }

    function preventContextMenu(event) {
        event.preventDefault();
    }

    links.forEach(link => {
        link.addEventListener('click', handleLinkClick);
        link.addEventListener('contextmenu', preventContextMenu);
    });

    channelLinks.forEach(channelLink => {
        channelLink.addEventListener('click', handleLinkClick);
        channelLink.addEventListener('contextmenu', preventContextMenu);
    });

    function showToast() {
        toast.className = 'toast show';
        setTimeout(function() {
            toast.className = toast.className.replace('show', '');
        }, 3000);
    }

    document.getElementById('downloads').classList.add('active');
});

// Advanced AES Encode and Decode Functions
async function encrypt() {
    const plaintext = document.getElementById('plaintext').value;
    const password = document.getElementById('encryptPassword').value;

    const ciphertext = await AdvancedAES.encode(plaintext, password);
    displayResult('Encrypted Text', ciphertext);
}

async function decrypt() {
    const ciphertext = document.getElementById('ciphertext').value;
    const password = document.getElementById('decryptPassword').value;

    const plaintext = await AdvancedAES.decode(ciphertext, password);
    displayResult('Decrypted Text', plaintext);
}

function displayResult(label, text) {
    const resultContainer = document.getElementById('result-container');
    const resultLabel = document.getElementById('result-label');
    const resultText = document.getElementById('result-text');
    const resultBox = document.getElementById('result-box');

    resultLabel.textContent = label;
    resultText.textContent = text;

    resultBox.style.height = 'auto';  // Reset height
    const height = resultBox.scrollHeight + 'px';  // Calculate new height
    resultBox.style.height = height;  // Set new height

    resultContainer.classList.remove('hidden');
}

function downloadFile(filename, content) {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
}

const AdvancedAES = {
    async encode(plaintext, password) {
        const encoder = new TextEncoder();
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await this.deriveKey(password, salt);
        const alg = { name: 'AES-GCM', iv: iv };

        const encryptedContent = await crypto.subtle.encrypt(alg, key, encoder.encode(plaintext));

        const encryptedBytes = new Uint8Array(encryptedContent);
        const ciphertext = new Uint8Array(iv.length + salt.length + encryptedBytes.length);
        ciphertext.set(iv, 0);
        ciphertext.set(salt, iv.length);
        ciphertext.set(encryptedBytes, iv.length + salt.length);

        return this.customEncode(ciphertext);
    },

    async decode(ciphertext, password) {
        const data = this.customDecode(ciphertext);
        const iv = data.slice(0, 12);
        const salt = data.slice(12, 28);
        const encryptedBytes = data.slice(28);
        const key = await this.deriveKey(password, salt);
        const alg = { name: 'AES-GCM', iv: iv };

        const decryptedContent = await crypto.subtle.decrypt(alg, key, encryptedBytes);
        const decoder = new TextDecoder();

        return decoder.decode(decryptedContent);
    },

    async deriveKey(password, salt) {
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            'PBKDF2',
            false,
            ['deriveKey']
        );
        return crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 200000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    },

    customEncode(data) {
        return btoa(String.fromCharCode.apply(null, data));
    },

    customDecode(data) {
        return new Uint8Array(atob(data).split('').map(c => c.charCodeAt(0)));
    }
};

// Custom Cursor
document.addEventListener('mousemove', function(e) {
    moveCursor(e.pageX, e.pageY);
});

document.addEventListener('touchmove', function(e) {
    const touch = e.touches[0];
    moveCursor(touch.pageX, touch.pageY);
});

document.addEventListener('mousedown', function() {
    setCursorState('big');
});

document.addEventListener('mouseup', function() {
    setCursorState('');
});

document.addEventListener('touchstart', function() {
    setCursorState('big');
});

document.addEventListener('touchend', function() {
    setCursorState('');
});

function moveCursor(x, y) {
    const cursor = document.getElementById('cursor');
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;

    const target = document.elementFromPoint(x, y);
    if (target && (target.tagName === 'BUTTON' || target.tagName === 'A')) {
        setCursorState('holding');
    } else {
        setCursorState('');
    }
}

function setCursorState(state) {
    const cursor = document.getElementById('cursor');
    cursor.className = 'cursor ' + state;
}