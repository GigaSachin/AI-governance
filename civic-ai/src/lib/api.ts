// =========================================================
// CIVIC AI API
// =========================================================

export const API_URL =
  "http://127.0.0.1:8000/api/analyze-request";


// Gemini can take some time
const REQUEST_TIMEOUT_MS = 45_000;


// =========================================================
// REQUEST PAYLOAD
// =========================================================

export interface AnalyzeRequestPayload {
  text: string;
  latitude: number | null;
  longitude: number | null;
  image: File | null;
}


// =========================================================
// RESPONSE
// =========================================================

export interface AnalyzeResponse {
  complaintId?: string;

  category?: string;

  subCategory?: string;

  priority?: string;

  issue?: string;

  summary?: string;

  sentiment?: string;

  locationCaptured?: boolean;

  imageUrl?: string;

  database?: {
    firebase?: boolean;
    bigQuery?: boolean;
  };

  raw: unknown;
}


// =========================================================
// ERROR TYPES
// =========================================================

export type ApiErrorKind =
  | "network"
  | "timeout"
  | "bad_request"
  | "server_error"
  | "malformed_response"
  | "unknown";


export class ApiError extends Error {

  kind: ApiErrorKind;

  status?: number;


  constructor(
    kind: ApiErrorKind,
    message: string,
    status?: number
  ) {

    super(message);

    this.kind = kind;

    this.status = status;

    this.name = "ApiError";
  }
}


// =========================================================
// FRIENDLY ERROR MESSAGE
// =========================================================

export function friendlyErrorMessage(
  error: unknown
): string {

  if (error instanceof ApiError) {

    switch (error.kind) {

      case "network":

        return (
          "We couldn't reach the CIVIC AI service. " +
          "Check that the server is running and try again."
        );


      case "timeout":

        return (
          "This is taking longer than expected. " +
          "The service may be busy — please try again."
        );


      case "bad_request":

        return (
          "We couldn't understand that report. " +
          "Try describing the issue in a bit more detail."
        );


      case "server_error":

        return (
          "Something went wrong on our end while " +
          "analyzing your report. Please try again shortly."
        );


      case "malformed_response":

        return (
          "We received an unexpected response while " +
          "analyzing your report. Please try again."
        );


      default:

        return (
          "Something went wrong while submitting " +
          "your report. Please try again."
        );
    }
  }


  return (
    "Something went wrong while submitting " +
    "your report. Please try again."
  );
}


// =========================================================
// PICK STRING
// =========================================================

function pick(
  obj: Record<string, unknown>,
  keys: string[]
): string | undefined {

  for (const key of keys) {

    const value = obj[key];


    if (
      typeof value === "string" &&
      value.trim().length > 0
    ) {

      return value;
    }


    if (typeof value === "number") {

      return String(value);
    }
  }


  return undefined;
}


// =========================================================
// PICK BOOLEAN
// =========================================================

function pickBool(
  obj: Record<string, unknown>,
  keys: string[]
): boolean | undefined {

  for (const key of keys) {

    if (typeof obj[key] === "boolean") {

      return obj[key] as boolean;
    }
  }


  return undefined;
}


// =========================================================
// NORMALIZE RESPONSE
// =========================================================

function normalize(
  json: unknown
): AnalyzeResponse {

  if (
    typeof json !== "object" ||
    json === null
  ) {

    throw new ApiError(
      "malformed_response",
      "Response was not a JSON object."
    );
  }


  const obj =
    json as Record<string, unknown>;


  // -------------------------------------------------------
  // Backend analysis object
  // -------------------------------------------------------

  const analysis =
    typeof obj.analysis === "object" &&
    obj.analysis !== null

      ? obj.analysis as Record<string, unknown>

      : typeof obj.data === "object" &&
        obj.data !== null

        ? obj.data as Record<string, unknown>

        : obj;


  // -------------------------------------------------------
  // Database object
  // -------------------------------------------------------

  const dbSource =
    typeof obj.database === "object" &&
    obj.database !== null

      ? obj.database as Record<string, unknown>

      : typeof obj.db === "object" &&
        obj.db !== null

        ? obj.db as Record<string, unknown>

        : {};


  // -------------------------------------------------------
  // Location
  // -------------------------------------------------------

  const locationSource =
    typeof obj.location === "object" &&
    obj.location !== null

      ? obj.location as Record<string, unknown>

      : {};


  return {

    complaintId: pick(
      obj,
      [
        "request_id",
        "complaint_id",
        "complaintId",
        "id",
        "complaintID"
      ]
    ),


    category: pick(
      analysis,
      [
        "category",
        "Category"
      ]
    ),


    subCategory: pick(
      analysis,
      [
        "sub_category",
        "subCategory",
        "subcategory",
        "Sub-category"
      ]
    ),


    priority: pick(
      analysis,
      [
        "priority",
        "Priority"
      ]
    ),


    issue: pick(
      analysis,
      [
        "issue",
        "Issue"
      ]
    ),


    summary: pick(
      analysis,
      [
        "summary",
        "Summary"
      ]
    ),


    sentiment: pick(
      analysis,
      [
        "sentiment",
        "Sentiment"
      ]
    ),


    imageUrl: pick(
      obj,
      [
        "image_url",
        "imageUrl"
      ]
    ),


    locationCaptured:
      pickBool(
        obj,
        [
          "location_captured",
          "locationCaptured"
        ]
      )
      ??
      (
        typeof locationSource.latitude === "number" &&
        typeof locationSource.longitude === "number"
      ),


    database: {

      firebase: pickBool(
        dbSource,
        [
          "firebase",
          "Firebase"
        ]
      ),


      bigQuery: pickBool(
        dbSource,
        [
          "bigquery",
          "bigQuery",
          "BigQuery"
        ]
      )

    },


    raw: json
  };
}


// =========================================================
// ANALYZE COMPLAINT
// =========================================================

export async function analyzeComplaint(
  payload: AnalyzeRequestPayload
): Promise<AnalyzeResponse> {

  const controller =
    new AbortController();


  const timeout =
    setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS
    );


  try {

    // =====================================================
    // IMPORTANT:
    // Backend now expects multipart/form-data
    // =====================================================

    const formData =
      new FormData();


    // -----------------------------------------------------
    // Complaint text
    // -----------------------------------------------------

    formData.append(
      "text",
      payload.text
    );


    // -----------------------------------------------------
    // Latitude
    // -----------------------------------------------------

    if (
      payload.latitude !== null &&
      payload.latitude !== undefined
    ) {

      formData.append(
        "latitude",
        String(payload.latitude)
      );

    } else {

      formData.append(
        "latitude",
        "0"
      );
    }


    // -----------------------------------------------------
    // Longitude
    // -----------------------------------------------------

    if (
      payload.longitude !== null &&
      payload.longitude !== undefined
    ) {

      formData.append(
        "longitude",
        String(payload.longitude)
      );

    } else {

      formData.append(
        "longitude",
        "0"
      );
    }


    // -----------------------------------------------------
    // IMAGE
    // -----------------------------------------------------

    if (payload.image) {

      formData.append(
        "image",
        payload.image,
        payload.image.name
      );

    } else {

      throw new ApiError(
        "bad_request",
        "Please upload an image."
      );
    }


    // =====================================================
    // SEND REQUEST
    // =====================================================

    let response: Response;


    try {

      response = await fetch(
        API_URL,
        {
          method: "POST",

          // IMPORTANT:
          // DO NOT manually set Content-Type here.
          // Browser automatically creates:
          // multipart/form-data; boundary=...
          //
          headers: {},

          body: formData,

          signal: controller.signal
        }
      );

    } catch (err) {

      if (
        err instanceof DOMException &&
        err.name === "AbortError"
      ) {

        throw new ApiError(
          "timeout",
          "Request timed out."
        );
      }


      throw new ApiError(
        "network",
        "Network request failed."
      );
    }


    // =====================================================
    // HANDLE HTTP ERRORS
    // =====================================================

    if (!response.ok) {

      let serverMessage =
        "";


      try {

        const errorJson =
          await response.json();


        if (
          typeof errorJson === "object" &&
          errorJson !== null
        ) {

          const errorObj =
            errorJson as Record<string, unknown>;


          if (
            typeof errorObj.detail === "string"
          ) {

            serverMessage =
              errorObj.detail;
          }
        }

      } catch {
        // Ignore JSON parsing error
      }


      if (
        response.status >= 400 &&
        response.status < 500
      ) {

        throw new ApiError(
          "bad_request",
          serverMessage ||
            `Request rejected (${response.status}).`,
          response.status
        );
      }


      throw new ApiError(
        "server_error",
        serverMessage ||
          `Server error (${response.status}).`,
        response.status
      );
    }


    // =====================================================
    // PARSE JSON
    // =====================================================

    let json: unknown;


    try {

      json =
        await response.json();

    } catch {

      throw new ApiError(
        "malformed_response",
        "Response body was not valid JSON."
      );
    }


    // =====================================================
    // NORMALIZE
    // =====================================================

    try {

      return normalize(json);

    } catch {

      throw new ApiError(
        "malformed_response",
        "Response JSON did not match the expected shape."
      );
    }

  } finally {

    clearTimeout(timeout);
  }
}