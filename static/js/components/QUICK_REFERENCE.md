# Component Library - Quick Reference Card

## ðŸš€ Quick Start (Copy & Paste)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="app"></div>
    
    <script type="module">
        import { Button, Card, Input } from '/static/js/components/index.js';
        
        // Create a button
        const btn = new Button({
            label: 'Click Me',
            variant: 'primary',
            onClick: () => alert('Hello!')
        }).create();
        
        // Create an input
        const input = new Input({
            type: 'text',
            placeholder: 'Enter text...'
        }).create();
        
        // Create a card
        const card = new Card({
            title: 'Welcome',
            content: 'This is a card component'
        }).create();
        
        // Add to page
        const app = document.getElementById('app');
        app.appendChild(card);
    </script>
</body>
</html>
```

---

## ðŸ“¦ Available Components (52 Total)

### Tier 1: Basic (8)
`Button` | `Badge` | `Label` | `Separator` | `Typography` | `Kbd` | `Spinner` | `Item`

### Tier 2: Input (8)
`Input` | `InputGroup` | `Textarea` | `Checkbox` | `RadioGroup` | `Toggle` | `Switch` | `NativeSelect`

### Tier 3: Container (6)
`Card` | `Avatar` | `Alert` | `Skeleton` | `Progress` | `Slider`

### Tier 4: Interactive (5)
`ButtonGroup` | `Tabs` | `Breadcrumb` | `ToggleGroup` | `Pagination`

### Tier 5: Complex (9)
`Dialog` | `AlertDialog` | `Tooltip` | `Popover` | `Drawer` | `Sheet` | `HoverCard` | `ContextMenu` | `DropdownMenu`

### Tier 6: Advanced (6)
`Select` | `Calendar` | `InputOTP` | `DatePicker` | `Combobox` | `Command`

### Tier 7: Specialized (5)
`Collapsible` | `Carousel` | `AspectRatio` | `ScrollArea` | `Sidebar`

### Tier 8: Data/Form (5)
`Empty` | `Form` | `DataTable` | `Toast` | `Chart`

---

## ðŸŽ¯ Common Patterns

### Create & Mount
```javascript
import { Button } from '/static/js/components/index.js';

const button = new Button({ label: 'Click' }).create();
document.body.appendChild(button);
```

### Event Handling
```javascript
const button = new Button({ label: 'Click' });
button.on('click', () => console.log('Clicked'));
const element = button.create();
document.body.appendChild(element);
```

### Get Values from Input
```javascript
const input = new Input({ type: 'email' });
const element = input.create();
input.on('change', (value) => {
    console.log('Email:', value);
});
```

### Open/Close Dialog
```javascript
const dialog = new Dialog({
    title: 'Confirm?',
    content: 'Are you sure?'
});

// Open dialog
dialog.open();

// Close dialog
dialog.close();
```

### Show Toast
```javascript
import { Toast } from '/static/js/components/index.js';

Toast.show({
    type: 'success',
    message: 'Success!',
    position: 'top-right'
});
```

### Form with Validation
```javascript
const form = new Form({
    fields: [
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'message', label: 'Message', type: 'textarea' }
    ],
    onSubmit: (values) => {
        console.log(values);  // { email: '...', message: '...' }
    }
}).create();
```

### Data Table
```javascript
const table = new DataTable({
    columns: ['Name', 'Email'],
    rows: [
        { Name: 'John', Email: 'john@example.com' },
        { Name: 'Jane', Email: 'jane@example.com' }
    ],
    sortable: true,
    selectable: true
}).create();

// Get selected rows
table.on('select', () => {
    const selected = table.getSelectedRows();
    console.log('Selected:', selected);
});
```

---

## ðŸŽ¨ Component Options Quick Ref

### Button Options
```javascript
{
    label: 'string',
    variant: 'primary|secondary|destructive|outline|ghost',
    size: 'sm|md|lg',
    disabled: false,
    className: 'additional classes',
    onClick: () => {}
}
```

### Input Options
```javascript
{
    type: 'text|email|password|number|tel|url',
    placeholder: 'string',
    value: 'initial value',
    disabled: false,
    className: 'additional classes',
    onChange: (value) => {}
}
```

### Card Options
```javascript
{
    title: 'string',
    subtitle: 'string',
    content: 'string or HTML',
    footer: 'string or HTML',
    hoverable: false,
    className: 'additional classes'
}
```

### Alert Options
```javascript
{
    type: 'info|success|warning|error',
    content: 'string or HTML',
    closeable: true,
    className: 'additional classes'
}
```

### Dialog Options
```javascript
{
    title: 'string',
    content: 'string or HTML',
    closeButton: true,
    closeOnBackdrop: true,
    className: 'additional classes',
    onClose: () => {}
}
```

---

## ðŸ”„ Lifecycle Methods

```javascript
// Create instance
const component = new Button({ label: 'Test' });

// Create DOM element
const element = component.create();

// Mount to DOM
document.body.appendChild(element);

// Add event listeners
component.on('click', handler);

// Update component
component.setClassName('bg-blue-500');
component.setText('New Label');

// Clean up (important!)
component.destroy();
```

---

## ðŸ“ Import Examples

### Import Single Component
```javascript
import { Button } from '/static/js/components/index.js';
const btn = new Button({ label: 'Click' }).create();
```

### Import Multiple Components
```javascript
import { Button, Card, Input } from '/static/js/components/index.js';
```

### Import Everything
```javascript
import * as UI from '/static/js/components/index.js';
const btn = new UI.Button({ label: 'Click' }).create();
```

### Import Utilities
```javascript
import { clsx, createElement } from '/static/js/components/utils.js';
```

---

## ðŸŽ¨ Tailwind Classes Quick Reference

### Common Utilities Used in Components
```
Colors: text-blue-600, bg-blue-600, border-gray-300, text-white
Spacing: px-4, py-2, mb-4, mt-2, gap-3, space-y-2
Display: hidden, block, flex, inline-flex, grid
Sizing: w-full, h-12, min-h-10, max-w-md
Styling: rounded, border, shadow, shadow-lg
States: hover:, focus:, disabled:, active:
Animations: animate-spin, transition, duration-200
Responsive: md:, lg:, sm:
```

### Add Custom Classes
```javascript
new Button({
    label: 'Custom',
    className: 'shadow-xl border-2 border-blue-400 rounded-full'
}).create()
```

---

## ðŸ› Common Issues & Solutions

### Issue: Component not visible
```javascript
// âŒ Wrong
const btn = new Button({ label: 'Test' });
document.body.appendChild(btn);

// âœ… Right
const btn = new Button({ label: 'Test' });
const el = btn.create();
document.body.appendChild(el);
```

### Issue: Click handler not working
```javascript
// âŒ Wrong
const btn = new Button({ label: 'Test' });
const el = btn.create();
el.addEventListener('click', () => {}); // Won't work!

// âœ… Right
const btn = new Button({ label: 'Test' });
btn.on('click', () => {});  // Use component's method
const el = btn.create();
```

### Issue: Styling not applied
```javascript
// Ensure Tailwind is loaded in your HTML
<script src="https://cdn.tailwindcss.com"></script>

// Or in your CSS
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Issue: Memory leak
```javascript
// Always clean up when done!
component.destroy();
element.remove();
```

---

## ðŸ“š Documentation Files

- **README.md** - Comprehensive documentation
- **DEMO.html** - Interactive component showcase
- **INTEGRATION_GUIDE.md** - Integration patterns and examples
- **PROJECT_SUMMARY.md** - Project overview and architecture
- **QUICK_REFERENCE.md** - This file

---

## ðŸ”— File Locations

All files are in: `/static/js/components/`

```
components/
â”œâ”€â”€ BaseComponent.js         â† Base class
â”œâ”€â”€ utils.js                â† Utility functions
â”œâ”€â”€ Button.js               â† Components
â”œâ”€â”€ ... (50+ more)
â”œâ”€â”€ index.js                â† Export file (import from this)
â”œâ”€â”€ DEMO.html               â† Visual examples
â”œâ”€â”€ README.md               â† Full documentation
â”œâ”€â”€ INTEGRATION_GUIDE.md     â† Integration examples
â”œâ”€â”€ PROJECT_SUMMARY.md       â† Project overview
â””â”€â”€ QUICK_REFERENCE.md       â† This file
```

---

## âš¡ Performance Tips

1. **Lazy load components** - Only import what you need
2. **Destroy unused components** - Call `.destroy()` when done
3. **Use event delegation** - Attach listeners to parent elements
4. **Debounce/throttle handlers** - For rapid events like scroll/resize

```javascript
import { debounce } from '/static/js/components/utils.js';

const handleResize = debounce(() => {
    console.log('Resized');
}, 300);

window.addEventListener('resize', handleResize);
```

---

## âœ… Checklist for Using Components

- [ ] Tailwind CSS loaded (`<script src="https://cdn.tailwindcss.com"></script>`)
- [ ] Using `type="module"` on script tags
- [ ] Importing from `index.js`
- [ ] Calling `.create()` on components
- [ ] Appending element to DOM
- [ ] Using `.on()` for event listeners
- [ ] Calling `.destroy()` when done
- [ ] Testing in browser console (no errors)
- [ ] Checking network tab (no 404s)

---

## ðŸŽ“ Learning Path

**Start Here:**
1. Copy the quick start code above
2. Open DEMO.html in browser
3. Try creating simple components

**Next:**
1. Read README.md
2. Explore INTEGRATION_GUIDE.md
3. Try form and table components

**Advanced:**
1. Study BaseComponent.js
2. Review utils.js
3. Extend components with custom code

---

## ðŸš€ You're Ready!

Everything you need is set up and ready to use. Start building! 

Questions? Check the documentation files or look at DEMO.html for examples.

**Happy coding!** ðŸŽ‰
