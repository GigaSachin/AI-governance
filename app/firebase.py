import os
import json
import firebase_admin

from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import storage


# =========================================================
# FIREBASE INITIALIZATION
# =========================================================

firebase_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")

if firebase_json:
    # Render / production
    service_account_info = json.loads(firebase_json)
    cred = credentials.Certificate(service_account_info)

else:
    # Local development
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