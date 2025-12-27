from django.db import models
from django.utils import timezone


class Keyword(models.Model):
    INTENT_CHOICES = [
        ('informational', 'Informational'),
        ('transactional', 'Transactional'),
        ('navigational', 'Navigational'),
    ]

    term = models.CharField(max_length=255, unique=True)
    intent = models.CharField(max_length=24, choices=INTENT_CHOICES, default='informational')
    monthly_volume = models.IntegerField(null=True, blank=True)
    is_target = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_target', '-monthly_volume', 'term']

    def __str__(self):
        return self.term


class KeywordURLMapping(models.Model):
    keyword = models.ForeignKey(Keyword, on_delete=models.CASCADE, related_name='mappings')
    url = models.CharField(max_length=2000)
    score = models.FloatField(default=0.0)
    intent = models.CharField(max_length=24, choices=Keyword.INTENT_CHOICES, default='informational')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['keyword', 'url']

    def __str__(self):
        return f"{self.keyword.term} -> {self.url}"


class SERPSnapshot(models.Model):
    """Top results snapshot for a keyword at a timestamp."""
    keyword = models.ForeignKey(Keyword, on_delete=models.CASCADE, related_name='serp_snapshots')
    date = models.DateField(default=timezone.now)
    search_engine = models.CharField(max_length=50, default='google')
    position = models.PositiveSmallIntegerField()
    url = models.CharField(max_length=2000)
    title = models.CharField(max_length=512, blank=True)
    snippet = models.TextField(blank=True)
    raw = models.JSONField(null=True, blank=True)
    source = models.CharField(max_length=50, default='scrape')

    class Meta:
        ordering = ['keyword', 'date', 'position']

    def __str__(self):
        return f"{self.keyword.term} [{self.date}] #{self.position} -> {self.url}"


class GSCMetric(models.Model):
    """Store aggregated GSC metrics per keyword per day."""
    keyword = models.ForeignKey(Keyword, on_delete=models.CASCADE, related_name='gsc_metrics')
    date = models.DateField(default=timezone.now)
    clicks = models.IntegerField(default=0)
    impressions = models.IntegerField(default=0)
    ctr = models.FloatField(default=0.0)
    position = models.FloatField(null=True, blank=True)
    raw = models.JSONField(null=True, blank=True)

    class Meta:
        ordering = ['-date']
        unique_together = ['keyword', 'date']

    def __str__(self):
        return f"GSC {self.keyword.term} {self.date} p:{self.position} clicks:{self.clicks}"


class ContentBrief(models.Model):
    """A generated content brief for a keyword based on current SERP."""
    keyword = models.ForeignKey(Keyword, on_delete=models.CASCADE, related_name='content_briefs')
    created_at = models.DateTimeField(auto_now_add=True)
    generated_by = models.CharField(max_length=100, default='analysis')
    top_urls = models.JSONField(default=list)
    suggested_headings = models.JSONField(default=list)
    top_terms = models.JSONField(default=list)
    recommended_word_count = models.IntegerField(null=True, blank=True)
    notes = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Brief for {self.keyword.term} @ {self.created_at.date()}"