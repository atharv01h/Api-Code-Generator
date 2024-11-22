let supportedOptions = {};

// Fetch supported languages and frameworks on load
fetch('/supported')
    .then(response => response.json())
    .then(data => {
        supportedOptions = data;
        const languageSelect = document.getElementById('language');
        
        // Populate language dropdown
        Object.keys(data).forEach(lang => {
            const option = document.createElement('option');
            option.value = lang;
            option.textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
            languageSelect.appendChild(option);
        });
    });

// Update frameworks when language changes
document.getElementById('language').addEventListener('change', (e) => {
    const frameworkSelect = document.getElementById('framework');
    frameworkSelect.innerHTML = '<option value="">Select Framework</option>';
    
    if (e.target.value) {
        supportedOptions[e.target.value].forEach(framework => {
            const option = document.createElement('option');
            option.value = framework;
            option.textContent = framework.charAt(0).toUpperCase() + framework.slice(1);
            frameworkSelect.appendChild(option);
        });
    }
});

// Handle form submission
document.getElementById('generatorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const language = document.getElementById('language').value;
    const framework = document.getElementById('framework').value;
    const method = document.getElementById('method').value;
    const endpoint = document.getElementById('endpoint').value;
    const body = document.getElementById('body').value;
    
    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                language,
                framework,
                method,
                endpoint,
                body: body ? JSON.parse(body) : undefined
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('output').textContent = data.code;
        } else {
            document.getElementById('output').textContent = `Error: ${data.error}`;
        }
    } catch (error) {
        document.getElementById('output').textContent = `Error: ${error.message}`;
    }
});

// Copy to clipboard functionality
document.getElementById('copyButton').addEventListener('click', () => {
    const code = document.getElementById('output').textContent;
    navigator.clipboard.writeText(code).then(() => {
        const button = document.getElementById('copyButton');
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = 'Copy to Clipboard';
        }, 2000);
    });
});