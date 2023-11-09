document.getElementById('post-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
  
    const content = form.elements.content.value;
  
    const data = { content };
  
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  
    if (response.ok) {
      // form.reset(); // Reset the form fields after successful post submission
      window.location.reload();
    } else {
      // Handle or display error
      alert("Failed to create post. Please try again.");
    }
  });