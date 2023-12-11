export async function createPost(content) {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error('Error creating post');
    return response.json();
  }
  
  export async function updatePost(id, content) {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error('Error updating post');
    return response.json();
  }
  
  export async function deletePost(id) {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error deleting post');
  }
