export function searchBox() {
    document.addEventListener('DOMContentLoaded', function() {
        const searchInput = document.getElementById('search');
        const resultsFrame = document.getElementById('results-frame');
        const resultsList = document.getElementById('results');

        searchInput.addEventListener('input', async function() {
            const searchTerm = this.value.toLowerCase();
            resultsList.innerHTML = ''; // Clear previous results

            if (searchTerm === '') {
                // Clear the results frame when the search input is empty
                resultsFrame.style.display = 'none';
            } else {
                
                try {
                    const response = await fetch(`/api/search?q=${searchTerm}`);
                    const data = await response.json();
                
                    if (data.length > 0) {
                      resultsFrame.style.display = 'block';
                    } else {
                      resultsFrame.style.display = 'none';
                    }
                
                    data.forEach(item => {
                      // Create a link for each item that navigates to the details page
                      const listItem = document.createElement('li');
                      const itemLink = document.createElement('a');
                      itemLink.textContent = item.name; // Display the item name
                      itemLink.setAttribute('href', `/pizza-details/${item._id}`); // Include the item's ID in the URL
                      listItem.appendChild(itemLink);
                      resultsList.appendChild(listItem);
                    });
                  } catch (error) {
                    console.error(error);
                    // Handle error
                  }
            }
        });
    });
}
