/*

By kenharris from TypingMind Discord.

TypingMind Extension: Model Search & Full Model Names

Model Search Functionality: The model selector now includes a search
bar at the top. You can easily search and filter models by typing in
their names

Full Model Names Displayed: I've also adjusted the dropdown so that 
model names are fully visible without any truncation. You can now see
the entire model name without the "..." cutting it off.

*/

(function () {
    let isInitialized = false;

    function createSearchInput() {
        const searchDiv = document.createElement('div');
        searchDiv.style.cssText = 'padding:10px;position:sticky;top:0;background-color:inherit;z-index:1;';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search models...';
        searchInput.style.cssText = 'width:100%;padding:5px;border:1px solid #ccc;border-radius:4px;';

        searchDiv.appendChild(searchInput);
        return { searchDiv, searchInput };
    }

    function setupDropdown(container) {
        if (!container || isInitialized) return;
        isInitialized = true;

        container.style.cssText = 'width:400px;max-width:80vw;min-width:400px;right:auto;left:0;transform:translateX(0);';

        const { searchDiv, searchInput } = createSearchInput();
        container.insertBefore(searchDiv, container.firstChild);

        const menuItems = Array.from(container.querySelectorAll('[role="menuitem"]'));
        const originalDisplay = new WeakMap();

        menuItems.forEach(item => {
            originalDisplay.set(item, item.style.display || '');

            const modelNameSpan = item.querySelector('span[title]');
            if (modelNameSpan) {
                modelNameSpan.classList.remove('truncate', 'max-w-[180px]');
                modelNameSpan.classList.add('whitespace-normal', 'break-words');
                modelNameSpan.style.width = '100%';
            }

            const flexContainer = item.querySelector('.flex.items-center.justify-between');
            if (flexContainer) {
                flexContainer.style.cssText = 'display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;';
            }
        });

        const scrollableContainer = container.querySelector('.py-2.max-h-\\[300px\\].overflow-auto');
        if (scrollableContainer) {
            scrollableContainer.style.cssText = 'max-height:400px;padding-top:0;';
        }

        function filterItems() {
            const searchTerms = searchInput.value.toLowerCase().split(/\s+/).filter(Boolean);
            menuItems.forEach(item => {
                const modelName = item.querySelector('span[title]')?.textContent.toLowerCase() || '';
                const shouldDisplay = searchTerms.every(term => modelName.includes(term));
                item.style.display = shouldDisplay ? originalDisplay.get(item) : 'none';
            });
        }

        searchInput.addEventListener('input', filterItems);

        // Prevent default behavior for space key
        searchInput.addEventListener('keydown', e => {
            if (e.key === ' ') e.stopPropagation();
        });

        // Focus the search input after the dropdown is displayed
        setTimeout(() => searchInput.focus(), 0);
    }

    function handleClick(event) {
        const modelSelector = event.target.closest('[id^="headlessui-menu-button-"]');
        if (modelSelector) {
            const dropdownMenu = document.querySelector('[role="menu"][id^="headlessui-menu-items-"]');
            if (dropdownMenu) {
                setupDropdown(dropdownMenu);
            } else {
                const observer = new MutationObserver((mutations, obs) => {
                    for (const mutation of mutations) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE && node.getAttribute('role') === 'menu') {
                                setupDropdown(node);
                                obs.disconnect();
                                return;
                            }
                        }
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
                // Failsafe disconnect after 1 second
                setTimeout(() => observer.disconnect(), 1000);
            }
        } else if (isInitialized && !event.target.closest('[role="menu"]')) {
            isInitialized = false;
        }
    }

    document.addEventListener('click', handleClick);

    console.log('Optimized model dropdown with improved search is ready. It will activate when you click the model selector.');
})();
