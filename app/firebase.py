import firebase_admin

from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import storage


# =========================================================
# FIREBASE INITIALIZATION
# =========================================================

cred = credentials.Certificate(
    "serviceAccountKey.json"
)

firebase_admin.initialize_app(
    cred,
    {
        "storageBucket": "ai-governance-f94d2.firebasestorage.app"
    }
)


# =========================================================
# FIRESTORE
# =========================================================

db = firestore.client()


# =========================================================
# FIREBASE STORAGE
# =========================================================

bucket = storage.bucket()