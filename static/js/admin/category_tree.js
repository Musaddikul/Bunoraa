(function() {
  function buildTreeFromOptions(select) {
    const options = Array.from(select.querySelectorAll('option'));
    const nodes = {};

    options.forEach(opt => {
      const id = opt.value;
      const parent = opt.getAttribute('data-parent') || '';
      const level = parseInt(opt.getAttribute('data-level') || '0', 10);
      nodes[id] = { id, parent, label: opt.textContent.trim(), option: opt, children: [], level, selected: opt.selected };
    });

    const root = [];
    Object.values(nodes).forEach(node => {
      if (node.parent && nodes[node.parent]) {
        nodes[node.parent].children.push(node);
      } else {
        root.push(node);
      }
    });

    function createList(items) {
      const ul = document.createElement('ul');
      ul.className = 'category-tree';
      items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'category-item';
        li.dataset.id = item.id;
        li.dataset.level = item.level;
        li.classList.add('pl-1');

        const row = document.createElement('div');
        row.className = 'category-row';
        row.tabIndex = 0; // make row focusable for keyboard navigation
        row.classList.add('flex','items-center','gap-2','rounded','p-1','hover:bg-gray-50','dark:hover:bg-slate-800','focus:outline-none','focus:ring-2','focus:ring-indigo-400');

        // Toggle / caret
        if (item.children.length > 0) {
          const toggle = document.createElement('button');
          toggle.type = 'button';
          toggle.className = 'toggle-children';
          toggle.setAttribute('aria-expanded', 'false');
          toggle.innerHTML = '<span class="caret">▸</span>';
          toggle.classList.add('w-5','h-5','flex','items-center','justify-center','text-sm','text-gray-500','dark:text-slate-300');
          toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
            if (childUl) {
              childUl.classList.toggle('collapsed');
            }
            toggle.querySelector('.caret').textContent = expanded ? '▸' : '▾';
          });
          row.appendChild(toggle);
        } else {
          const spacer = document.createElement('span');
          spacer.className = 'toggle-spacer';
          spacer.textContent = ' ';
          spacer.classList.add('w-5');
          row.appendChild(spacer);
        }

        // Node icon
        const nodeIcon = document.createElement('span');
        nodeIcon.className = 'node-icon';
        nodeIcon.textContent = item.children.length > 0 ? '📁' : '📄';
        nodeIcon.classList.add('w-5','text-center');
        row.appendChild(nodeIcon);

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.id = item.id;
        checkbox.checked = item.selected;
        checkbox.className = 'category-checkbox';
        checkbox.classList.add('w-4','h-4');
        checkbox.tabIndex = -1; // keep focus on row

        const label = document.createElement('label');
        label.className = 'category-label';
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + item.label));
        label.classList.add('flex','items-center','gap-2','text-sm','text-gray-700','dark:text-slate-200');

        row.appendChild(label);
        li.appendChild(row);

        if (item.children.length > 0) {
          var childUl = createList(item.children);
          childUl.classList.add('collapsed');
          li.appendChild(childUl);
        }

        ul.appendChild(li);
      });
      return ul;
    }

    return { rootList: createList(root), nodes };
  }

  function updateAncestorStates(li) {
    let parentLi = li.parentElement && li.parentElement.closest('li.category-item');
    while (parentLi) {
      const childCheckboxes = Array.from(parentLi.querySelectorAll(':scope > ul li input.category-checkbox'));
      const allChecked = childCheckboxes.length > 0 && childCheckboxes.every(cb => cb.checked && !cb.indeterminate);
      const noneChecked = childCheckboxes.every(cb => !cb.checked && !cb.indeterminate);
      const parentCb = parentLi.querySelector(':scope > .category-row input.category-checkbox');
      if (parentCb) {
        parentCb.checked = allChecked;
        parentCb.indeterminate = !allChecked && !noneChecked;
      }
      parentLi = parentLi.parentElement && parentLi.parentElement.closest('li.category-item');
    }
  }

  function setDescendantsState(li, checked) {
    li.querySelectorAll('ul li input.category-checkbox').forEach(cb => {
      cb.checked = checked;
      cb.indeterminate = false;
      const opt = document.querySelector(`select[name="categories"] option[value="${cb.dataset.id}"]`);
      if (opt) opt.selected = cb.checked;
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    const select = document.querySelector('select[name="categories"]');
    if (!select) return;

    // Hide original select but keep it in the DOM for form submission
    select.style.display = 'none';

    const wrapper = document.createElement('div');
    wrapper.className = 'category-tree-wrapper';
    wrapper.classList.add('bg-white','dark:bg-slate-900','rounded-md','p-2','border','border-gray-200','dark:border-slate-700','text-gray-700','dark:text-slate-200');

    const controls = document.createElement('div');
    controls.className = 'category-tree-controls';
    controls.classList.add('flex','gap-2','mb-2');

    const expandAll = document.createElement('button');
    expandAll.type = 'button';
    expandAll.textContent = 'Expand all';
    expandAll.classList.add('px-2','py-1','text-sm','rounded','bg-transparent','border','border-gray-200','dark:border-slate-700','text-gray-700','dark:text-slate-200','hover:bg-gray-100','dark:hover:bg-slate-800');
    expandAll.addEventListener('click', function() {
      wrapper.querySelectorAll('ul.category-tree ul').forEach(u => u.classList.remove('collapsed'));
      wrapper.querySelectorAll('button.toggle-children').forEach(b => b.setAttribute('aria-expanded', 'true'));
      wrapper.querySelectorAll('.toggle-children .caret').forEach(c => c.textContent = '▾');
    });

    const collapseAll = document.createElement('button');
    collapseAll.type = 'button';
    collapseAll.textContent = 'Collapse all';
    collapseAll.classList.add('px-2','py-1','text-sm','rounded','bg-transparent','border','border-gray-200','dark:border-slate-700','text-gray-700','dark:text-slate-200','hover:bg-gray-100','dark:hover:bg-slate-800');
    collapseAll.addEventListener('click', function() {
      wrapper.querySelectorAll('ul.category-tree ul').forEach(u => u.classList.add('collapsed'));
      wrapper.querySelectorAll('button.toggle-children').forEach(b => b.setAttribute('aria-expanded', 'false'));
      wrapper.querySelectorAll('.toggle-children .caret').forEach(c => c.textContent = '▸');
    });

    controls.appendChild(expandAll);
    controls.appendChild(collapseAll);
    wrapper.appendChild(controls);

    const { rootList } = buildTreeFromOptions(select);
    wrapper.appendChild(rootList);
    select.parentNode.insertBefore(wrapper, select.nextSibling);

    // Initialize indeterminate states for parents based on selected options
    wrapper.querySelectorAll('li.category-item').forEach(li => {
      const checkbox = li.querySelector(':scope > .category-row input.category-checkbox');
      if (!checkbox) return;
      const childCheckboxes = Array.from(li.querySelectorAll(':scope > ul li input.category-checkbox'));
      if (childCheckboxes.length > 0) {
        const allChecked = childCheckboxes.every(cb => cb.checked);
        const noneChecked = childCheckboxes.every(cb => !cb.checked);
        checkbox.checked = allChecked;
        checkbox.indeterminate = !allChecked && !noneChecked;
      }
    });

    // Handle checkbox changes with indeterminate/parent logic
    wrapper.addEventListener('change', function(e) {
      const cb = e.target;
      if (cb.tagName.toLowerCase() !== 'input' || cb.type !== 'checkbox') return;
      const li = cb.closest('li.category-item');
      if (!li) return;

      // Set descendants
      setDescendantsState(li, cb.checked);

      // Update corresponding option for this checkbox and descendants
      const opt = select.querySelector(`option[value="${cb.dataset.id}"]`);
      if (opt) opt.selected = cb.checked;
      li.querySelectorAll('ul li input.category-checkbox').forEach(ch => {
        const optc = select.querySelector(`option[value="${ch.dataset.id}"]`);
        if (optc) optc.selected = ch.checked;
      });

      // Update ancestors
      updateAncestorStates(li);

      // Update visual selected classes using Tailwind utilities
      li.querySelectorAll('.category-row').forEach(r => {
        const checked = !!r.querySelector('input.category-checkbox').checked;
        r.classList.toggle('bg-indigo-50', checked);
        r.classList.toggle('dark:bg-indigo-900/20', checked);
      });

      // Trigger change on select so any listeners (e.g., admin JS) update
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Click / label handling and keyboard navigation
    wrapper.addEventListener('click', function(e) {
      const row = e.target.closest('.category-row');
      if (!row) return;
      const li = row.closest('li.category-item');
      const cb = row.querySelector('input.category-checkbox');
      // If click target was toggle button or caret, ignore (handled elsewhere)
      if (e.target.closest('.toggle-children')) return;
      // Toggle checkbox when clicking row
      if (cb && e.target.tagName.toLowerCase() !== 'input') {
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Keyboard navigation: arrow keys & space to toggle
    wrapper.addEventListener('keydown', function(e) {
      const row = e.target.closest('.category-row');
      if (!row) return;
      if (e.key === 'ArrowRight') {
        // expand
        const toggle = row.querySelector('.toggle-children');
        if (toggle) toggle.click();
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        const toggle = row.querySelector('.toggle-children');
        if (toggle && toggle.getAttribute('aria-expanded') === 'true') toggle.click();
        else {
          // move focus to parent
          const parentLi = row.closest('li.category-item').parentElement.closest('li.category-item');
          if (parentLi) parentLi.querySelector('.category-row').focus();
        }
        e.preventDefault();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        const cb = row.querySelector('input.category-checkbox');
        if (cb) { cb.checked = !cb.checked; cb.dispatchEvent(new Event('change', { bubbles: true })); }
        e.preventDefault();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        // Move focus to next/previous visible row
        const visibleRows = Array.from(wrapper.querySelectorAll('.category-row')).filter(r => r.offsetParent !== null);
        const idx = visibleRows.indexOf(row);
        const next = e.key === 'ArrowDown' ? visibleRows[idx+1] : visibleRows[idx-1];
        if (next) next.focus();
        e.preventDefault();
      }
    });

    // Initialize selected class states using Tailwind bg utilities
    wrapper.querySelectorAll('li.category-item').forEach(li => {
      const row = li.querySelector('.category-row');
      const cb = row.querySelector('input.category-checkbox');
      const checked = !!cb.checked;
      row.classList.toggle('bg-indigo-50', checked);
      row.classList.toggle('dark:bg-indigo-900/20', checked);
    });

  });
})();
