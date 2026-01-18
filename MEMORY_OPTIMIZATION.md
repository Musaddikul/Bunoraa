# Memory Optimization Guide for 512MB Deployment

## Problem
The application is experiencing memory exhaustion on Render's 512MB instance limit, particularly due to:
1. Heavy ML libraries (torch, transformers) being loaded in memory
2. Celery workers not recycling memory properly
3. Database connection pools holding onto memory
4. Django middleware and middleware initialization

## Solutions Implemented

### 1. Celery Worker Optimization
**Files**: `core/celery.py`, `core/settings/production.py`

- **Worker Prefetch**: Reduced from 4 to 1 task at a time
  - Prevents workers from loading multiple large tasks simultaneously
  - Only loads the next task after completing the current one
  
- **Max Tasks Per Child**: Set to 500
  - Celery workers are recycled every 500 tasks
  - Forces garbage collection and memory cleanup
  - Prevents memory accumulation from long-running workers

- **Task Acknowledgment**: Using `task_acks_late = True`
  - Tasks acknowledged only after completion
  - Ensures failed tasks are retried rather than lost

### 2. Gunicorn Configuration
**File**: `gunicorn_conf.py`

Already optimized with:
- **Worker Recycling**: `max_requests = 1000` (recycle every 1000 requests)
- **Reduced Threads**: `threads = 2` (minimal threading to reduce memory)
- **Worker Class**: Using `gthread` (threaded workers, more memory-efficient than sync)
- **Low Log Level**: Set to 'warning' (reduces logging overhead)

### 3. Database Connection Pooling
**File**: `core/settings/production.py`

- **Connection Max Age**: 300 seconds (5 minutes)
  - Closes idle database connections to free memory
  - Prevents connection pool from accumulating old connections

- **Connection Timeout**: 10 seconds
  - Prevents stuck connections

### 4. Redis Cache Configuration
**File**: `core/settings/production.py`

- **Max Connections**: Limited to 50
  - Prevents connection pool explosion
- **Socket Timeout**: 5 seconds
  - Prevents hanging connections

## Additional Recommendations

### For Render Deployment

1. **Use Starter or Higher Plan**
   - Current 512MB is marginal for this stack
   - Recommend upgrading to at least 1GB ($10/month)

2. **Disable Unnecessary Features**
   - Disable DEBUG toolbar in production
   - Disable verbose logging
   - Disable unnecessary middleware

3. **Scale Horizontally**
   - Use separate instances for:
     - Web application (Gunicorn)
     - Background workers (Celery)
     - ML tasks (separate queue with isolated workers)

4. **ML Model Optimization**
   - Load ML models lazily (only when needed)
   - Use model quantization to reduce memory
   - Consider using ONNX models (smaller footprint)
   - Implement model caching to avoid reloading

### Code Optimizations

#### Lazy Loading for ML Models
```python
# In apps that use ML models:
from functools import lru_cache

@lru_cache(maxsize=1)
def get_model():
    """Load model only when first requested"""
    from ml_module import load_model
    return load_model()

# In views/tasks:
model = get_model()  # Loads only once, cached thereafter
```

#### Query Optimization
```python
# Use select_related and prefetch_related to reduce queries
from django.db.models import Prefetch

# Bad (N+1 queries)
products = Product.objects.all()
for product in products:
    print(product.category.name)

# Good (single query with JOIN)
products = Product.objects.select_related('category')
for product in products:
    print(product.category.name)
```

#### Async Tasks for Long-Running Operations
```python
# Move memory-intensive operations to background tasks
from celery import shared_task

@shared_task
def train_model_async(model_type):
    """Train model in background, freeing up web worker"""
    # ML training code here
    pass

# In views: queue the task rather than running synchronously
train_model_async.delay('ncf')
```

## Monitoring Memory Usage

### On Render
1. Go to your service dashboard
2. Check the "Recent Logs" section for OOM (Out of Memory) errors
3. Monitor Memory Usage graph to see peak consumption

### Locally
```bash
# Monitor Celery worker memory
celery -A core worker -l info --max-memory-per-child=200000

# Monitor Gunicorn memory
ps aux | grep gunicorn
```

## Testing Memory Usage

```bash
# Stress test with concurrent requests
ab -n 1000 -c 20 https://bunoraa.onrender.com/

# Monitor Celery task memory usage
celery -A core worker --monitor
```

## Future Improvements

1. **Use Redis Streams** instead of RabbitMQ for lighter message queue
2. **Implement Model Serving** with TorchServe or TensorFlow Serving (separate from Django)
3. **Use Celery Concurrency** with `solo` pool for minimal memory
4. **Implement Request Batching** for ML inference
5. **Consider Serverless** for ML prediction (AWS Lambda, Google Cloud Functions)

## References
- [Gunicorn Worker Configuration](https://docs.gunicorn.org/en/stable/settings.html)
- [Celery Worker Memory Management](https://docs.celeryproject.org/en/stable/userguide/workers.html)
- [Django Database Connection Pooling](https://docs.djangoproject.com/en/stable/ref/databases/)
- [Render Instance Types](https://render.com/docs/specifications)
