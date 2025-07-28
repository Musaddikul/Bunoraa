# reviews/tests.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from products.models import Product
from .models import Review, ReviewVote, ReviewFlag
from .services import submit_review, vote_review, flag_review

User = get_user_model()

class ReviewAppTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('u','u@x.com','pw')
        self.product = Product.objects.create(name="P",slug="p",price=10)

    def test_submit_and_moderate(self):
        r = submit_review(self.user, self.product, 5, "Great!")
        self.assertTrue(r.is_approved)

    def test_vote_review(self):
        r = submit_review(self.user, self.product, 4, "Nice")
        other = User.objects.create_user('o','o@x.com','pw2')
        helpful, not_help = vote_review(other, r.id, True)
        self.assertEqual(helpful, 1)
        self.assertEqual(not_help, 0)

    def test_flag_review(self):
        r = submit_review(self.user, self.product, 3, "Ok")
        fcount = flag_review(self.user, r.id, "spam")
        self.assertEqual(fcount, 1)
