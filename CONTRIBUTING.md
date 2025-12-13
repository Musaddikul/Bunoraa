# Contributing to Bunoraa

First off, thank you for considering contributing to Bunoraa! It's people like you that make Bunoraa such a great platform.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

**Bug Report Template:**
```
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows 11]
 - Browser: [e.g. Chrome 120]
 - Python Version: [e.g. 3.11]
 - Django Version: [e.g. 5.0]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- A clear and descriptive title
- A detailed description of the proposed enhancement
- Examples of how the enhancement would be used
- Why this enhancement would be useful to most users

### Pull Requests

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Run the tests (`make test`)
5. Run the linters (`make lint`)
6. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
7. Push to the branch (`git push origin feature/AmazingFeature`)
8. Open a Pull Request

## Development Setup

### Prerequisites

- Python 3.11+
- PostgreSQL 14+
- Redis 7+
- Node.js 18+

### Installation

1. Clone your fork:
```bash
git clone https://github.com/yourusername/bunoraa.git
cd bunoraa
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. Install dependencies:
```bash
make install
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your settings
```

5. Run migrations:
```bash
make migrate
```

6. Create superuser:
```bash
make superuser
```

7. Start development server:
```bash
make dev
```

## Coding Guidelines

### Python Style Guide

We follow PEP 8 with some modifications:

- Maximum line length: 100 characters
- Use double quotes for strings
- Use trailing commas in multi-line structures
- Use type hints where appropriate

```python
# Good
def get_product_by_slug(slug: str) -> Product | None:
    """
    Retrieve a product by its slug.
    
    Args:
        slug: The product's URL-friendly identifier.
        
    Returns:
        The Product instance if found, None otherwise.
    """
    return Product.objects.filter(slug=slug, is_active=True).first()
```

### JavaScript Style Guide

- Use ES6+ features (modules, arrow functions, destructuring)
- No semicolons (configured in ESLint)
- Single quotes for strings
- 2-space indentation

```javascript
// Good
export const formatCurrency = (amount, currency = 'BDT') => {
  const formatter = new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency,
  })
  return formatter.format(amount)
}
```

### HTML/Templates Style Guide

- Use semantic HTML5 elements
- Keep templates DRY using includes and blocks
- Use meaningful class names (BEM or TailwindCSS utilities)

### Commit Messages

Use conventional commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(cart): add quantity update functionality
fix(checkout): resolve payment gateway timeout issue
docs(readme): update installation instructions
```

## Testing

### Running Tests

```bash
# Run all tests
make test

# Run with coverage
make test-cov

# Run specific app tests
python manage.py test products

# Run specific test
python manage.py test products.tests.test_models.ProductModelTest
```

### Writing Tests

```python
from django.test import TestCase
from products.models import Product


class ProductModelTest(TestCase):
    def setUp(self):
        self.product = Product.objects.create(
            name="Test Product",
            price=100.00,
            is_active=True,
        )

    def test_product_str(self):
        """Test product string representation."""
        self.assertEqual(str(self.product), "Test Product")

    def test_product_slug_generated(self):
        """Test that slug is auto-generated."""
        self.assertEqual(self.product.slug, "test-product")
```

## Documentation

- Update the README.md if you change any setup steps
- Add docstrings to all functions and classes
- Comment complex logic
- Update API documentation for endpoint changes

## Review Process

1. All PRs require at least one review
2. CI must pass (tests, linting)
3. Code coverage must not decrease
4. Documentation must be updated if needed

## Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

Thank you for contributing! 🎉
