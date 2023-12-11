import { deletePost } from './api.js';

async function deletePostId(id) {
    try {
      await deletePost(id);
      // TODO - remove the post from the DOM instead of reloading the page?
      location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
}
  
// Make deletePost available globally
window.deletePostId = deletePostId;

document.querySelectorAll('#followForm, #unfollowForm').forEach(form => {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const response = await fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            // Update the button text and form action/method based on the current action
            const button = form.querySelector('button');
            if (form.id === 'followForm') {
                button.textContent = 'Unfollow';
                form.action = form.action.replace('/follow', '/unfollow');
                form.id = 'unfollowForm';
            } else {
                button.textContent = 'Follow';
                form.action = form.action.replace('/unfollow', '/follow');
                form.id = 'followForm';
            }
        } else {
            console.error('Failed to follow/unfollow');
        }
    });
});
