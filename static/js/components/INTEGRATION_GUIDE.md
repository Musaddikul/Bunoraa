# Component Library Integration Guide

## ðŸš€ Quick Start Integration

This guide will help you integrate the Pure JavaScript UI Component Library into your Django Bunoraa website.

---

## ðŸ“¦ What You Have

Located in: `static/js/components/`

**Core Files:**
- `BaseComponent.js` - Base class for all components
- `utils.js` - 20+ utility functions
- `index.js` - Central export file with all 60+ components

**Components:** 52 component files organized by tier
**Documentation:** README.md, DEMO.html, PROJECT_SUMMARY.md

---

## ðŸ”§ Integration Steps

### Step 1: Include in Your HTML Template

Add a script tag to reference the components in your Django template:

```html
<!-- Option A: Individual component import -->
<script type="module">
    import { Button, Card, Form } from '/static/js/components/index.js';
    
    // Your code here
</script>

<!-- Option B: Namespace import -->
<script type="module">
    import * as UI from '/static/js/components/index.js';
    
    const button = new UI.Button({ label: 'Click' }).create();
    document.body.appendChild(button);
</script>
```

### Step 2: Create Components in JavaScript

```javascript
// Import what you need
import { Button, Input, Card } from '/static/js/components/index.js';

// Create a button
const submitBtn = new Button({
    label: 'Submit Form',
    variant: 'primary',
    size: 'md',
    onClick: () => handleFormSubmit()
}).create();

// Create an input field
const emailInput = new Input({
    type: 'email',
    placeholder: 'Enter your email',
    onChange: (value) => console.log('Email:', value)
}).create();

// Create a card
const userCard = new Card({
    title: 'User Information',
    content: 'Your profile details',
    footer: 'Last updated: today'
}).create();

// Append to page
document.getElementById('form-container').appendChild(emailInput);
document.getElementById('form-container').appendChild(submitBtn);
document.getElementById('sidebar').appendChild(userCard);
```

### Step 3: Common Use Cases

#### Replace Django Form Inputs

**Before (Django Template):**
```html
<input type="text" name="email" placeholder="Email">
<textarea name="message"></textarea>
```

**After (Using Components):**
```html
<div id="form-container"></div>
<script type="module">
    import { Input, Textarea } from '/static/js/components/index.js';
    
    const emailInput = new Input({
        type: 'email',
        placeholder: 'Email'
    }).create();
    
    const textarea = new Textarea({
        placeholder: 'Message',
        rows: 5
    }).create();
    
    document.getElementById('form-container').appendChild(emailInput);
    document.getElementById('form-container').appendChild(textarea);
</script>
```

#### Create Modal Dialogs

```html
<button id="open-modal">Click me</button>
<div id="modal-container"></div>

<script type="module">
    import { Dialog } from '/static/js/components/index.js';
    
    const dialog = new Dialog({
        title: 'Confirm Action',
        content: 'Are you sure you want to continue?',
        closeButton: true,
        onClose: () => console.log('Dialog closed')
    });
    
    document.getElementById('open-modal').addEventListener('click', () => {
        dialog.open();
    });
</script>
```

#### Build Dynamic Tables

```html
<div id="table-container"></div>

<script type="module">
    import { DataTable } from '/static/js/components/index.js';
    
    const table = new DataTable({
        columns: ['Product', 'Price', 'Stock'],
        rows: [
            { Product: 'Widget A', Price: '$10.99', Stock: '50' },
            { Product: 'Widget B', Price: '$15.99', Stock: '30' },
            { Product: 'Widget C', Price: '$20.99', Stock: '0' }
        ],
        sortable: true,
        selectable: true
    }).create();
    
    document.getElementById('table-container').appendChild(table);
    
    // Get selected rows
    table.on('select', () => {
        const selected = table.getSelectedRows();
        console.log('Selected:', selected);
    });
</script>
```

#### Show Loading State

```html
<div id="content">Loading...</div>

<script type="module">
    import { Spinner } from '/static/js/components/index.js';
    
    const spinner = new Spinner({
        size: 'lg',
        color: 'blue'
    }).create();
    
    document.getElementById('content').innerHTML = '';
    document.getElementById('content').appendChild(spinner);
    
    // Later, replace with actual content
    setTimeout(() => {
        spinner.destroy();
        document.getElementById('content').innerHTML = '<p>Content loaded!</p>';
    }, 2000);
</script>
```

---

## ðŸŽ¨ Styling & Customization

### Add Custom Classes

```javascript
const button = new Button({
    label: 'Custom Styled',
    className: 'shadow-lg border-2 border-blue-400 rounded-full'
}).create();
```

### Use Component Variants

All components support variants (when applicable):

```javascript
// Button variants
new Button({ label: 'Primary', variant: 'primary' });
new Button({ label: 'Secondary', variant: 'secondary' });
new Button({ label: 'Destructive', variant: 'destructive' });
new Button({ label: 'Outline', variant: 'outline' });
new Button({ label: 'Ghost', variant: 'ghost' });

// Alert variants
new Alert({ type: 'info', content: 'Info message' });
new Alert({ type: 'success', content: 'Success!' });
new Alert({ type: 'warning', content: 'Warning!' });
new Alert({ type: 'error', content: 'Error!' });
```

### Override Tailwind Defaults

Modify `static/js/components/utils.js`:

```javascript
// In utils.js, update the css object
export const css = {
    colors: {
        primary: 'bg-indigo-600',        // Change from blue-600
        secondary: 'bg-purple-600',      // Change from gray-200
        success: 'bg-emerald-600',       // Change from green-600
    }
};
```

---

## ðŸ”— Django Integration Patterns

### Pattern 1: Template with Components

```html
<!-- products/list.html -->
{% extends "base.html" %}

{% block content %}
<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Products</h1>
    
    <!-- Filter Card -->
    <div id="filter-card"></div>
    
    <!-- Products Table -->
    <div id="products-table"></div>
    
    <!-- Toast Container -->
    <div id="toast-container"></div>
</div>

<script type="module">
    import { Card, DataTable, Toast } from '/static/js/components/index.js';
    
    // Create filter card
    const filterCard = new Card({
        title: 'Filter Products',
        content: '<select id="category"><option>All</option></select>'
    }).create();
    document.getElementById('filter-card').appendChild(filterCard);
    
    // Load and display products table
    fetch('/api/products/')
        .then(res => res.json())
        .then(data => {
            const table = new DataTable({
                columns: ['Name', 'Price', 'Category'],
                rows: data.products,
                sortable: true
            }).create();
            document.getElementById('products-table').appendChild(table);
        })
        .catch(err => {
            Toast.show({
                type: 'error',
                message: 'Failed to load products',
                position: 'top-right'
            });
        });
</script>
{% endblock %}
```

### Pattern 2: AJAX Form with Components

```html
<!-- checkout/form.html -->
<div id="checkout-form"></div>

<script type="module">
    import { Form, Toast } from '/static/js/components/index.js';
    
    const form = new Form({
        fields: [
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'address', label: 'Address', type: 'textarea', required: true },
            { name: 'payment', label: 'Payment Method', type: 'select', required: true }
        ],
        onSubmit: async (values) => {
            try {
                const response = await fetch('/api/checkout/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values)
                });
                
                if (response.ok) {
                    Toast.show({
                        type: 'success',
                        message: 'Order placed successfully!',
                        position: 'top-right'
                    });
                } else {
                    throw new Error('Checkout failed');
                }
            } catch (error) {
                Toast.show({
                    type: 'error',
                    message: error.message,
                    position: 'top-right'
                });
            }
        }
    }).create();
    
    document.getElementById('checkout-form').appendChild(form);
</script>
```

### Pattern 3: Real-time Updates with Components

```html
<!-- analytics/dashboard.html -->
<div id="dashboard"></div>

<script type="module">
    import { Card, Progress, Chart } from '/static/js/components/index.js';
    
    // Create dashboard cards
    const conversionCard = new Card({
        title: 'Conversion Rate',
        content: '<div id="conversion-progress"></div>'
    }).create();
    
    const revenueChart = new Chart({
        title: 'Revenue Trend',
        type: 'line',
        data: { labels: [], values: [] }
    }).create();
    
    document.getElementById('dashboard').appendChild(conversionCard);
    document.getElementById('dashboard').appendChild(revenueChart);
    
    // Update with real data
    const progressContainer = conversionCard.querySelector('#conversion-progress');
    const progress = new Progress({ value: 0 }).create();
    progressContainer.appendChild(progress);
    
    // Poll for updates
    setInterval(async () => {
        const data = await fetch('/api/analytics/').then(r => r.json());
        progress.setValue(data.conversionRate);
        revenueChart.setData(data.revenueData);
    }, 5000);
</script>
```

---

## ðŸ§¹ Cleanup & Memory Management

### Always Destroy Components

```javascript
// When removing a component
const component = new Button({ label: 'Click' });
const element = component.create();
document.body.appendChild(element);

// Later, when done
component.destroy();  // Cleans up event listeners
element.remove();      // Removes from DOM
```

### Remove Event Listeners

```javascript
const button = new Button({ label: 'Click' });
const element = button.create();

const handler = () => console.log('Clicked');
button.on('click', handler);

// When navigating away
button.destroy();  // Automatically removes all listeners
```

---

## ðŸš¨ Troubleshooting

### Components Not Appearing

```javascript
// âŒ Wrong - Forgot to create DOM element
const button = new Button({ label: 'Test' });
document.body.appendChild(button);

// âœ… Correct - Call create() first
const button = new Button({ label: 'Test' });
const element = button.create();
document.body.appendChild(element);
```

### Events Not Firing

```javascript
// âŒ Wrong - Adding listener to element directly
const button = new Button({ label: 'Test' });
const element = button.create();
element.addEventListener('click', handler);

// âœ… Correct - Use component's on() method
const button = new Button({ label: 'Test' });
button.on('click', handler);
const element = button.create();
document.body.appendChild(element);
```

### Styling Issues

```javascript
// Verify Tailwind CSS is loaded in your base template
// In base.html, ensure:
<script src="https://cdn.tailwindcss.com"></script>

// Or in your Tailwind CSS file:
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Module Import Errors

```html
<!-- Ensure you're using type="module" -->
<script type="module">
    import { Button } from '/static/js/components/index.js';
    // This works
</script>

<!-- Don't use type="text/javascript" for ES6 modules -->
<!-- This won't work:
<script type="text/javascript">
    import { Button } from '/static/js/components/index.js';
</script>
-->
```

---

## ðŸ“š Component API Quick Reference

### Button
```javascript
new Button({
    label: string,
    variant: 'primary|secondary|destructive|outline|ghost',
    size: 'sm|md|lg',
    disabled: boolean,
    onClick: function
}).create()
```

### Input
```javascript
new Input({
    type: 'text|email|password|number|...',
    placeholder: string,
    value: string,
    onChange: function,
    disabled: boolean
}).create()
```

### Card
```javascript
new Card({
    title: string,
    subtitle: string,
    content: string|HTMLElement,
    footer: string,
    hoverable: boolean
}).create()
```

### Dialog
```javascript
new Dialog({
    title: string,
    content: string|HTMLElement,
    closeButton: boolean,
    closeOnBackdrop: boolean,
    onClose: function
}).open()  // Opens dialog
.close()   // Closes dialog
```

### Form
```javascript
new Form({
    fields: Array<{name, label, type, required}>,
    onSubmit: function(values)
}).create()

// Methods:
.getValues()
.setValues(values)
```

### DataTable
```javascript
new DataTable({
    columns: Array<string>,
    rows: Array<object>,
    sortable: boolean,
    selectable: boolean
}).create()

// Methods:
.getSelectedRows()
.addRow(data)
.removeRow(index)
```

---

## ðŸŽ¯ Best Practices for Integration

1. **Use Module Imports** - Always use `type="module"` for scripts
2. **Clean Up** - Call `.destroy()` when removing components
3. **Event Delegation** - Use component's `.on()` method, not `addEventListener`
4. **Error Handling** - Wrap API calls in try/catch
5. **Performance** - Lazy load components if page is heavy
6. **Accessibility** - Components include ARIA labels; don't remove them
7. **Responsive** - All components are mobile-friendly by default
8. **Testing** - Test in different browsers and screen sizes

---

## ðŸ“ž Getting Help

1. Check DEMO.html for visual examples
2. Read README.md for detailed documentation
3. Review PROJECT_SUMMARY.md for architecture overview
4. Look at component source code - it's well-commented
5. Check inline JSDoc comments in each component file

---

## âœ… Integration Checklist

- [ ] Tailwind CSS is loaded in base template
- [ ] Static files are properly configured in Django
- [ ] `type="module"` is used in script tags
- [ ] Components are imported from `index.js`
- [ ] `.create()` is called on all components
- [ ] Created elements are appended to DOM
- [ ] Event handlers use `.on()` method
- [ ] Components are destroyed when no longer needed
- [ ] Error handling is in place
- [ ] Tested in different browsers

---

## ðŸŽ‰ You're Ready!

Your Pure JavaScript UI Component Library is ready to use. Start with the DEMO.html file to see all components in action, then integrate them into your Django templates following the patterns above.

Happy coding! ðŸš€
