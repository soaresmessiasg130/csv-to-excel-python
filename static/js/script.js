document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileInfo = document.getElementById('file-info');
    const filenameDisplay = document.getElementById('filename');
    const removeFileBtn = document.getElementById('remove-file');
    const previewSection = document.getElementById('preview-section');
    const previewTable = document.getElementById('preview-table');
    const convertBtn = document.getElementById('convert-btn');
    const historyTableBody = document.querySelector('#history-table tbody');
    const emptyHistory = document.getElementById('empty-history');
    const clearHistoryBtn = document.getElementById('clear-history');

    let currentFile = null;

    // Load History on Start
    loadHistory();

    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    // Drag & Drop Events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropZone.classList.add('dragover');
    }

    function unhighlight(e) {
        dropZone.classList.remove('dragover');
    }

    dropZone.addEventListener('drop', handleDrop, false);
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFiles);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files: files } });
    }

    function handleFiles(e) {
        const files = e.target.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                currentFile = file;
                showFileInfo(file.name);
                fetchPreview(file);
            } else {
                alert('Please upload a valid CSV file.');
            }
        }
    }

    function showFileInfo(name) {
        filenameDisplay.textContent = name;
        dropZone.style.display = 'none';
        fileInfo.style.display = 'flex';
    }

    removeFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentFile = null;
        fileInput.value = '';
        dropZone.style.display = 'block';
        fileInfo.style.display = 'none';
        previewSection.style.display = 'none';
    });

    async function fetchPreview(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/preview', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                renderPreview(data);
                previewSection.style.display = 'block';
            } else {
                alert('Error generating preview.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred.');
        }
    }

    function renderPreview(data) {
        previewTable.innerHTML = '';
        
        // Header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        data.columns.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        previewTable.appendChild(thead);

        // Body
        const tbody = document.createElement('tbody');
        data.data.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        previewTable.appendChild(tbody);
    }

    convertBtn.addEventListener('click', async () => {
        if (!currentFile) return;

        const formData = new FormData();
        formData.append('file', currentFile);

        try {
            const response = await fetch('/convert', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                // Trigger download
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                const downloadName = currentFile.name.replace('.csv', '.xlsx');
                a.download = downloadName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);

                // Save to History
                addToHistory(currentFile.name, downloadName);
            } else {
                alert('Error converting file.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during conversion.');
        }
    });

    function addToHistory(sourceName, destName) {
        const historyItem = {
            date: new Date().toLocaleString(),
            source: sourceName,
            destination: destName,
            user: 'User' // Hardcoded as per requirement, or could be dynamic if auth existed
        };

        let history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
        history.unshift(historyItem); // Add to top
        localStorage.setItem('conversionHistory', JSON.stringify(history));
        
        renderHistory();
    }

    function loadHistory() {
        renderHistory();
    }

    function renderHistory() {
        const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
        historyTableBody.innerHTML = '';

        if (history.length === 0) {
            emptyHistory.style.display = 'block';
        } else {
            emptyHistory.style.display = 'none';
            history.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.date}</td>
                    <td>${item.source}</td>
                    <td>${item.destination}</td>
                    <td>${item.user}</td>
                `;
                historyTableBody.appendChild(tr);
            });
        }
    }

    clearHistoryBtn.addEventListener('click', () => {
        localStorage.removeItem('conversionHistory');
        renderHistory();
    });
});
