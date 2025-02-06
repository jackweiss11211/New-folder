const form = document.getElementById('search-form');
const queryInput = document.getElementById('query');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = queryInput.value.trim();
  if (query) {
    fetch('/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
      .then((response) => response.json())
      .then((data) => {
        const resultsText = data.map((result) => {
          return `${result.title}\n${result.description}\n\n`;
        }).join('');
        const blob = new Blob([resultsText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'search_results.txt';
        a.click();
      })
      .catch((error) => console.error(error));
  }
});