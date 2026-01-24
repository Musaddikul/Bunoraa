(function($) {
    $(document).ready(function() {
        if ($('#category-tree-source').length === 0) {
            return;
        }

        const sourceList = $('#category-tree-source');
        const displayContainer = $('#category-tree-display');
        const hiddenInput = $('input[name="primary_category"]');
        const INDENTATION_UNIT = 20; // 20px for a 4-space equivalent indent

        let categories = {};
        let roots = [];

        sourceList.find('li').each(function() {
            const el = $(this);
            categories[el.data('id')] = {
                id: el.data('id'),
                parentId: el.data('parent-id'),
                name: el.text(),
                depth: el.data('depth'),
                children: []
            };
        });

        for (const id in categories) {
            const category = categories[id];
            if (category.parentId && categories[category.parentId]) {
                categories[category.parentId].children.push(category);
            } else {
                roots.push(category);
            }
        }

        function buildTreeHtml(nodes) {
            let html = '<ul class="space-y-1">';
            nodes.forEach(function(node) {
                const paddingLeft = node.depth * INDENTATION_UNIT;
                html += '<li class="category-node" data-id="' + node.id + '">';
                html += '<div class="flex items-center">';

                if (node.children.length > 0) {
                    html += '<span class="toggle w-6 text-center cursor-pointer font-bold text-gray-500">[+]</span>';
                } else {
                    html += '<span class="w-6"></span>'; // Spacer
                }

                html += '<span class="label flex-grow p-1 rounded-md cursor-pointer hover:bg-gray-100" style="padding-left: ' + paddingLeft + 'px;">' + node.name + '</span>';
                html += '</div>';

                if (node.children.length > 0) {
                    html += '<div class="children hidden pl-6">' + buildTreeHtml(node.children) + '</div>';
                }
                html += '</li>';
            });
            html += '</ul>';
            return html;
        }

        displayContainer.html(buildTreeHtml(roots));

        const initialValue = hiddenInput.val();
        if (initialValue) {
            const selectedLabel = displayContainer.find('.category-node[data-id="' + initialValue + '"] > .flex > .label');
            if (selectedLabel.length) {
                selectedLabel.addClass('bg-blue-500 text-white');
                selectedLabel.closest('.category-node').find('> .children').removeClass('hidden');
                selectedLabel.closest('.category-node').find('> .flex > .toggle').text('[-]');
            }
        }

        displayContainer.on('click', '.toggle', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const toggle = $(this);
            const children = toggle.closest('.category-node').find('> .children');
            children.toggleClass('hidden');
            toggle.text(children.hasClass('hidden') ? '[+]' : '[-]');
        });

        displayContainer.on('click', '.label', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const label = $(this);
            const nodeId = label.closest('.category-node').data('id');

            displayContainer.find('.label.bg-blue-500').removeClass('bg-blue-500 text-white');
            label.addClass('bg-blue-500 text-white');
            hiddenInput.val(nodeId);
        });
    });
})(django.jQuery);