from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from firebase_admin import auth

from datetime import datetime, timezone
from pathlib import Path
import uuid

from app.ai.gemini import analyze_citizen_request
from app.firebase import db, bucket
from app.bigquery import save_to_bigquery


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="AI Governance Backend",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# =========================================================
# ADMIN AUTHENTICATION
# =========================================================

security = HTTPBearer()


# IMPORTANT:
# Firebase Authentication mein jo email admin ke liye
# create kiya hai, wahi email yahan hona chahiye.

ADMIN_EMAILS = {
    "sachin9543@gmail.com"
}


def verify_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Verify Firebase ID token and confirm that
    the authenticated user is an authorized admin.
    """

    token = credentials.credentials

    try:

        # -------------------------------------------------
        # VERIFY FIREBASE ID TOKEN
        # -------------------------------------------------

        decoded_token = auth.verify_id_token(token)

        email = decoded_token.get("email")

        if not email:
            raise HTTPException(
                status_code=403,
                detail="Admin email not found."
            )

        # -------------------------------------------------
        # CHECK ADMIN EMAIL
        # -------------------------------------------------

        if email.lower() not in {
            admin.lower()
            for admin in ADMIN_EMAILS
        }:
            raise HTTPException(
                status_code=403,
                detail="Admin access denied."
            )

        # -------------------------------------------------
        # ADMIN VERIFIED
        # -------------------------------------------------

        print(
            f"ADMIN VERIFIED: {email}"
        )

        return decoded_token

    except HTTPException:
        raise

    except Exception as e:

        print(
            "ADMIN AUTH ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token."
        )


# =========================================================
# ADMIN AUTH CHECK
# =========================================================

@app.get("/api/admin/verify")
def verify_admin_access(
    admin=Depends(verify_admin)
):

    return {
        "success": True,
        "admin": True,
        "email": admin.get("email")
    }

# =========================================================
# HOME / HEALTH CHECK
# =========================================================

@app.get("/")
def home():

    return {
        "status": "online",
        "service": "AI Governance Backend"
    }


# =========================================================
# UPLOAD IMAGE TO FIREBASE STORAGE
# =========================================================

def upload_complaint_image(
    image: UploadFile,
    request_id: str
):

    try:

        # -------------------------------------------------
        # Validate file type
        # -------------------------------------------------

        allowed_types = {
            "image/jpeg",
            "image/png",
            "image/webp",
        }

        if image.content_type not in allowed_types:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Invalid image type. "
                    "Only JPG, PNG and WEBP are allowed."
                )
            )


        # -------------------------------------------------
        # Validate filename
        # -------------------------------------------------

        original_name = (
            image.filename
            or "complaint-image"
        )


        # -------------------------------------------------
        # Get extension
        # -------------------------------------------------

        extension = Path(
            original_name
        ).suffix.lower()


        if not extension:
            extension = ".jpg"


        # -------------------------------------------------
        # Generate unique storage filename
        # -------------------------------------------------

        file_name = (
            f"{uuid.uuid4().hex}{extension}"
        )


        # -------------------------------------------------
        # Firebase Storage path
        # -------------------------------------------------

        storage_path = (
            f"complaints/{request_id}/{file_name}"
        )


        # -------------------------------------------------
        # Create Firebase Storage blob
        # -------------------------------------------------

        blob = bucket.blob(
            storage_path
        )


        # -------------------------------------------------
        # Upload file
        # -------------------------------------------------

        image.file.seek(0)

        blob.upload_from_file(
            image.file,
            content_type=image.content_type
        )


        # -------------------------------------------------
        # Make image publicly readable
        # -------------------------------------------------

        blob.make_public()


        # -------------------------------------------------
        # Get public URL
        # -------------------------------------------------

        image_url = blob.public_url


        return image_url


    except HTTPException:
        raise


    except Exception as e:

        print(
            "ERROR uploading image:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to upload complaint image."
        )


# =========================================================
# ANALYZE CITIZEN REQUEST
# =========================================================

@app.post("/api/analyze-request")
async def analyze_request(

    text: str = Form(...),

    latitude: float = Form(...),

    longitude: float = Form(...),

    image: UploadFile = File(...)

):

    try:

        # =================================================
        # 1. BASIC VALIDATION
        # =================================================

        text = text.strip()


        if not text:

            raise HTTPException(
                status_code=400,
                detail="Complaint description cannot be empty."
            )


        # =================================================
        # 2. VALIDATE IMAGE
        # =================================================

        allowed_types = {
            "image/jpeg",
            "image/png",
            "image/webp",
        }


        if image.content_type not in allowed_types:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Invalid image type. "
                    "Only JPG, PNG and WEBP are allowed."
                )
            )


        # =================================================
        # 3. CHECK IMAGE SIZE
        # =================================================

        image.file.seek(0)

        image_data = await image.read()

        image_size = len(image_data)

        max_size = 10 * 1024 * 1024


        if image_size > max_size:

            raise HTTPException(
                status_code=400,
                detail="Image must be smaller than 10 MB."
            )


        # Reset file pointer

        image.file.seek(0)


        # =================================================
        # 4. GEMINI ANALYSIS
        # =================================================

        print(
            "Analyzing citizen complaint..."
        )


        analysis = analyze_citizen_request(
            text
        )


        print(
            "Gemini analysis completed."
        )


        # =================================================
        # 5. CREATE FIRESTORE DOCUMENT ID
        # =================================================

        doc_ref = (
            db
            .collection(
                "citizen_requests"
            )
            .document()
        )


        request_id = doc_ref.id


        # =================================================
        # 6. UPLOAD IMAGE TO FIREBASE STORAGE
        # =================================================

        print(
            "Uploading complaint image..."
        )


        image_url = upload_complaint_image(
            image,
            request_id
        )


        print(
            "Image uploaded successfully:"
        )

        print(
            image_url
        )


        # =================================================
        # 7. PREPARE FIRESTORE DATA
        # =================================================

        data = {

            "request_id": request_id,

            "raw_text": text,

            "category": analysis.get(
                "category"
            ),

            "sub_category": analysis.get(
                "sub_category"
            ),

            "priority": analysis.get(
                "priority"
            ),

            "issue": analysis.get(
                "issue"
            ),

            "summary": analysis.get(
                "summary"
            ),

            "location": analysis.get(
                "location"
            ),

            "latitude": latitude,

            "longitude": longitude,

            "sentiment": analysis.get(
                "sentiment"
            ),

            # Initial status
            "status": "submitted",

            "image_url": image_url,

            "created_at": datetime.now(
                timezone.utc
            ).isoformat(),

        }


        # =================================================
        # 8. SAVE TO FIRESTORE
        # =================================================

        print(
            "Saving complaint to Firestore..."
        )


        doc_ref.set(
            data
        )


        print(
            "Firestore save successful."
        )


        # =================================================
        # 9. SAVE TO BIGQUERY
        # =================================================

        bigquery_data = {
            key: value
            for key, value in data.items()
            if key != "image_url"
        }


        try:

            save_to_bigquery(
                bigquery_data
            )

            bigquery_success = True

            print(
                "BigQuery save successful."
            )


        except Exception as bq_error:

            # BigQuery failure should NOT destroy
            # successful complaint submission.

            bigquery_success = False

            print(
                "WARNING: BigQuery save failed:",
                str(bq_error)
            )


        # =================================================
        # 10. RETURN RESPONSE
        # =================================================

        return {

            "success": True,

            "request_id": request_id,

            "analysis": analysis,

            "location": {

                "latitude": latitude,

                "longitude": longitude

            },

            "image_url": image_url,

            "database": {

                "firebase": True,

                "bigquery": bigquery_success

            }

        }


    except HTTPException:
        raise


    except Exception as e:

        print(
            "ERROR /api/analyze-request:",
            str(e)
        )


        raise HTTPException(

            status_code=500,

            detail=(
                "Failed to analyze and save complaint."
            )

        )


# =========================================================
# GET ALL COMPLAINTS
# =========================================================
#
# Used by:
# - Admin Dashboard
# - Complaint Map
# - Hotspot Detection
#
# =========================================================


@app.get("/api/complaints")
async def get_complaints():
    try:

        complaints = []


        # =================================================
        # FETCH FIRESTORE DOCUMENTS
        # =================================================

        docs = (
            db
            .collection(
                "citizen_requests"
            )
            .stream()
        )


        for doc in docs:

            data = doc.to_dict()


            # =================================================
            # GPS
            # =================================================

            latitude = data.get(
                "latitude"
            )

            longitude = data.get(
                "longitude"
            )


            # Ignore records without coordinates

            if (
                latitude is None
                or longitude is None
            ):

                continue


            # =================================================
            # SAFE FLOAT CONVERSION
            # =================================================

            try:

                latitude = float(
                    latitude
                )

                longitude = float(
                    longitude
                )

            except (
                TypeError,
                ValueError
            ):

                continue


            # =================================================
            # PREPARE COMPLAINT
            # =================================================

            complaint = {

                "request_id": data.get(
                    "request_id",
                    doc.id
                ),

                "raw_text": data.get(
                    "raw_text",
                    ""
                ),

                "category": data.get(
                    "category"
                ),

                "sub_category": data.get(
                    "sub_category"
                ),

                "priority": data.get(
                    "priority"
                ),

                "issue": data.get(
                    "issue"
                ),

                "summary": data.get(
                    "summary"
                ),

                "location": data.get(
                    "location"
                ),

                "latitude": latitude,

                "longitude": longitude,

                "sentiment": data.get(
                    "sentiment"
                ),

                # Current complaint status
                "status": data.get(
                    "status",
                    "submitted"
                ),

                "image_url": data.get(
                    "image_url"
                ),

                "created_at": data.get(
                    "created_at"
                ),

                "updated_at": data.get(
                    "updated_at"
                )

            }


            complaints.append(
                complaint
            )


        # =================================================
        # RETURN
        # =================================================

        return {

            "success": True,

            "count": len(
                complaints
            ),

            "complaints": complaints

        }


    except Exception as e:

        print(
            "ERROR /api/complaints:",
            str(e)
        )


        raise HTTPException(

            status_code=500,

            detail=(
                "Failed to fetch complaints."
            )

        )


# =========================================================
# STATUS UPDATE MODEL
# =========================================================

class StatusUpdateRequest(BaseModel):

    status: str


# =========================================================
# UPDATE COMPLAINT STATUS
# =========================================================

class ComplaintStatusUpdate(BaseModel):
    status: str


@app.patch("/api/complaints/{request_id}/status")
def update_complaint_status(
    request_id: str,
    request: ComplaintStatusUpdate
):
    try:
        # Allowed status flow
        allowed_statuses = {
            "submitted",
            "in_progress",
            "resolved"
        }

        if request.status not in allowed_statuses:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Invalid status. Allowed values: "
                    "submitted, in_progress, resolved"
                )
            )

        # Complaints are stored inside citizen_requests
        doc_ref = db.collection("citizen_requests").document(request_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(
                status_code=404,
                detail="Complaint not found."
            )

        current_status = doc.to_dict().get("status", "submitted")

        # Enforce: submitted -> in_progress -> resolved
        next_status = {
            "submitted": "in_progress",
            "in_progress": "resolved",
            "resolved": "resolved"
        }

        if current_status == "resolved" and request.status != "resolved":
            raise HTTPException(
                status_code=400,
                detail="Resolved complaints cannot be moved backwards."
            )

        if current_status in {"submitted", "in_progress"} and request.status != next_status[current_status]:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Invalid status transition: {current_status} -> {request.status}. "
                    f"Expected: {next_status[current_status]}."
                )
            )

        # Update status and timestamp
        doc_ref.update({
            "status": request.status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        })

        return {
            "success": True,
            "message": "Complaint status updated successfully.",
            "request_id": request_id,
            "status": request.status
        }

    except HTTPException:
        raise

    except Exception as e: 
        print(
            "ERROR /api/complaints/{request_id}/status:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to update complaint status."
        )
