import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import {
  AlertOctagon,
  ImagePlus,
  Mic,
  MicOff,
  RefreshCw,
  Send,
  X,
} from "lucide-react";

import { useGeolocation } from "../hooks/useGeolocation";

import {
  ApiError,
  analyzeComplaint,
  friendlyErrorMessage,
  type AnalyzeResponse,
} from "../lib/api";

import { Button, Card } from "./ui/primitives";
import { LocationCard } from "./LocationCard";
import { ProcessingState } from "./ProcessingState";
import { ResultCard } from "./ResultCard";
import { useLanguage } from "../context/LanguageContext";


// =========================================================
// TYPES
// =========================================================

type FlowStatus =
  | "form"
  | "processing"
  | "success"
  | "error";


// =========================================================
// EXAMPLES
// =========================================================

const EXAMPLES = [
  "Street lights have not been working for three months...",
  "Garbage has not been collected in our area...",
  "The road near the school is badly damaged...",
];


// =========================================================
// SPEECH RECOGNITION TYPES
// =========================================================

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;

  start: () => void;
  stop: () => void;

  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}


// =========================================================
// REPORT SECTION
// =========================================================

export function ReportSection() {

  const { t, language } = useLanguage();

  const geo = useGeolocation();


  // =======================================================
  // TEXT
  // =======================================================

  const [text, setText] = useState("");


  // =======================================================
  // FLOW
  // =======================================================

  const [flow, setFlow] =
    useState<FlowStatus>("form");

  const [result, setResult] =
    useState<AnalyzeResponse | null>(null);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);


  // =======================================================
  // VOICE
  // =======================================================

  const [isListening, setIsListening] =
    useState(false);

  const recognitionRef =
    useRef<SpeechRecognitionInstance | null>(null);


  // =======================================================
  // IMAGE
  // =======================================================

  const [image, setImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [imageError, setImageError] =
    useState<string | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);


  // =======================================================
  // LOCATION
  // =======================================================

  const hasLocation =
    geo.status === "success";


  // =======================================================
  // VALIDATION
  // =======================================================

  const canSubmit =
    text.trim().length > 0 &&
    image !== null &&
    hasLocation;


  const blockReason = useMemo(() => {

    if (text.trim().length === 0) {
      return t("description");
    }

    if (!image) {
      return t("addPhoto");
    }

    if (geo.status === "loading") {
      return t("loading");
    }

    if (!hasLocation) {
      return t("locationRequired");
    }

    return null;

  }, [
    text,
    image,
    geo.status,
    hasLocation,
  ]);


  // =======================================================
  // 🎤 VOICE INPUT
  // =======================================================

  function toggleVoice() {

    // -----------------------------------------
    // STOP CURRENT LISTENING
    // -----------------------------------------

    if (isListening) {

      recognitionRef.current?.stop();

      return;
    }


    // -----------------------------------------
    // CHECK BROWSER SUPPORT
    // -----------------------------------------

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

      alert(t("somethingWrong"));

      return;
    }


    // -----------------------------------------
    // CREATE RECOGNITION
    // -----------------------------------------

    const recognition =
      new SpeechRecognition();


    const speechLanguages: Record<string, string> = { en: "en-IN", hi: "hi-IN", or: "or-IN", bn: "bn-IN", mr: "mr-IN", te: "te-IN", ta: "ta-IN", gu: "gu-IN", kn: "kn-IN", pa: "pa-IN" };

    recognition.lang = speechLanguages[language] || "en-IN";

    recognition.continuous = true;

    recognition.interimResults = false;


    // -----------------------------------------
    // START
    // -----------------------------------------

    recognition.onstart = () => {

      setIsListening(true);
    };


    // -----------------------------------------
    // RESULT
    // -----------------------------------------

    recognition.onresult = (
      event: SpeechRecognitionEvent
    ) => {

      let transcript = "";


      for (
        let i = 0;
        i < event.results.length;
        i++
      ) {

        const result =
          event.results[i];


        if (result?.[0]) {

          transcript +=
            result[0].transcript + " ";
        }
      }


      transcript =
        transcript.trim();


      if (!transcript) {
        return;
      }


      setText(
        (previousText) => {

          const existing =
            previousText.trim();


          if (!existing) {
            return transcript;
          }


          return `${existing} ${transcript}`;
        }
      );
    };


    // -----------------------------------------
    // ERROR
    // -----------------------------------------

    recognition.onerror = (event) => {

      console.error(
        "Speech recognition error:",
        event
      );


      setIsListening(false);
    };


    // -----------------------------------------
    // END
    // -----------------------------------------

    recognition.onend = () => {

      setIsListening(false);
    };


    recognitionRef.current =
      recognition;


    // -----------------------------------------
    // START RECOGNITION
    // -----------------------------------------

    try {

      recognition.start();

    } catch (error) {

      console.error(
        "Failed to start speech recognition:",
        error
      );


      setIsListening(false);
    }
  }


  // =======================================================
  // 📷 IMAGE SELECT
  // =======================================================

  function handleImageSelect(
    event: ChangeEvent<HTMLInputElement>
  ) {

    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    setImageError(null);


    // -----------------------------------------
    // ALLOWED TYPES
    // -----------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];


    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      setImage(null);

      setImagePreview(null);

      setImageError(
        "Invalid image type. Please upload a JPEG, PNG, or WebP image."
      );


      event.target.value = "";

      return;
    }


    // -----------------------------------------
    // SIZE
    // -----------------------------------------

    const maxSize =
      10 * 1024 * 1024;


    if (file.size > maxSize) {

      setImage(null);

      setImagePreview(null);

      setImageError("Image is too large. Please upload an image smaller than 10 MB.");


      event.target.value = "";

      return;
    }


    // -----------------------------------------
    // REMOVE OLD PREVIEW
    // -----------------------------------------

    if (imagePreview) {

      URL.revokeObjectURL(
        imagePreview
      );
    }


    // -----------------------------------------
    // CREATE NEW PREVIEW
    // -----------------------------------------

    const previewUrl =
      URL.createObjectURL(file);


    setImage(file);

    setImagePreview(previewUrl);
  }


  // =======================================================
  // ❌ REMOVE IMAGE
  // =======================================================

  function removeImage() {

    if (imagePreview) {

      URL.revokeObjectURL(
        imagePreview
      );
    }


    setImage(null);

    setImagePreview(null);

    setImageError(null);


    if (fileInputRef.current) {

      fileInputRef.current.value = "";
    }
  }


  // =======================================================
  // 🚀 SUBMIT
  // =======================================================

  async function handleSubmit() {

    // -----------------------------------------
    // BASIC VALIDATION
    // -----------------------------------------

    if (!canSubmit) {
      return;
    }


    // -----------------------------------------
    // STOP MICROPHONE
    // -----------------------------------------

    if (recognitionRef.current) {

      recognitionRef.current.stop();
    }


    setIsListening(false);


    // -----------------------------------------
    // START PROCESSING
    // -----------------------------------------

    setFlow("processing");

    setErrorMessage(null);


    try {

      // =======================================
      // SAFETY CHECK — IMAGE
      // =======================================

      if (!image) {

        throw new ApiError(
          "bad_request",
          t("evidence")
        );
      }


      // =======================================
      // SAFETY CHECK — LOCATION
      // =======================================

      if (
        geo.latitude === null ||
        geo.longitude === null
      ) {

        throw new ApiError(
          "bad_request",
          t("location")
        );
      }


      // =======================================
      // SEND TO BACKEND
      // =======================================
      //
      // api.ts converts this into FormData:
      //
      // text
      // latitude
      // longitude
      // image
      //
      // =======================================

      const response =
        await analyzeComplaint({

          text:
            text.trim(),

          latitude:
            geo.latitude,

          longitude:
            geo.longitude,

          image:
            image,
        });


      // =======================================
      // SUCCESS
      // =======================================

      setResult(response);

      setFlow("success");


    } catch (err) {

      console.error(
        "Complaint submission error:",
        err
      );


      setErrorMessage(
        friendlyErrorMessage(err)
      );


      setFlow("error");


      if (!(err instanceof ApiError)) {

        console.error(
          "Unexpected error submitting complaint:",
          err
        );
      }
    }
  }


  // =======================================================
  // 🔄 RESET
  // =======================================================

  function handleReset() {

    // -----------------------------------------
    // STOP VOICE
    // -----------------------------------------

    if (recognitionRef.current) {

      recognitionRef.current.stop();
    }


    recognitionRef.current =
      null;


    setIsListening(false);


    // -----------------------------------------
    // REMOVE IMAGE
    // -----------------------------------------

    removeImage();


    // -----------------------------------------
    // CLEAR TEXT
    // -----------------------------------------

    setText("");


    // -----------------------------------------
    // RESET LOCATION
    // -----------------------------------------

    geo.reset();


    // -----------------------------------------
    // RESET RESULT
    // -----------------------------------------

    setResult(null);

    setErrorMessage(null);


    // -----------------------------------------
    // BACK TO FORM
    // -----------------------------------------

    setFlow("form");
  }


  // =======================================================
  // UI
  // =======================================================

  return (

    <section
      id="report"
      className="px-6 py-24 lg:px-10"
    >

      <div className="mx-auto max-w-3xl">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center">

          <p className="num-tag">
            {t("report")}
          </p>


          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-offwhite lg:text-4xl">

            {t("reportIssue")}

          </h2>


          <p className="mt-3 text-slate-soft">

            {t("description")}

          </p>

        </div>


        <Card className="mt-10 p-6 lg:p-10">


          {/* =================================================
              FORM
          ================================================= */}

          {flow === "form" && (

            <div className="animate-fade-up">


              {/* =================================================
                  COMPLAINT TEXT
              ================================================= */}

              <div className="relative">

                <label
                  htmlFor="complaint"
                  className="sr-only"
                >

                  {t("description")}

                </label>


                <textarea
                  id="complaint"

                  value={text}

                  onChange={(e) =>
                    setText(
                      e.target.value
                    )
                  }

                  rows={6}

                  placeholder={t("description")}

                  className="w-full resize-none rounded-2xl border border-navy-border bg-midnight/60 p-5 pb-16 text-base leading-relaxed text-offwhite placeholder:text-slate-soft/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan"
                />


                {/* =================================================
                    MIC BUTTON
                ================================================= */}

                <button
                  type="button"

                  onClick={toggleVoice}

                  className={`absolute bottom-4 right-4 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                    isListening
                      ? "border-priority-critical/50 bg-priority-critical/10 text-priority-critical"
                      : "border-cyan/30 bg-cyan/10 text-cyan hover:bg-cyan/20"
                  }`}
                >

                  {isListening ? (

                    <>

                      <MicOff
                        className="h-4 w-4"
                      />

                      {t("stop")}

                    </>

                  ) : (

                    <>

                      <Mic
                        className="h-4 w-4"
                      />

                      {t("speak")}

                    </>
                  )}

                </button>

              </div>


              {/* =================================================
                  LISTENING STATUS
              ================================================= */}

              {isListening && (

                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-cyan">

                  <span className="h-2 w-2 animate-pulse rounded-full bg-cyan" />

                  {t("listening")}

                </div>
              )}


              {/* =================================================
                  EXAMPLES
              ================================================= */}

              <ul className="mt-3 flex flex-col gap-1.5">

                {EXAMPLES.map(
                  (example) => (

                    <li
                      key={example}
                      className="text-xs text-slate-soft/70"
                    >

                      “{example}”

                    </li>

                  )
                )}

              </ul>


              {/* =================================================
                  📷 EVIDENCE PHOTO
              ================================================= */}

              <div className="mt-8">


                <div className="mb-3">

                  <h3 className="text-sm font-semibold text-offwhite">

                    {t("evidencePhoto")}

                    <span className="ml-1 text-priority-critical">

                      *

                    </span>

                  </h3>


                  <p className="mt-1 text-xs text-slate-soft">

                    {t("uploadClearPhoto")}

                  </p>

                </div>


                {/* =================================================
                    NO IMAGE
                ================================================= */}

                {!imagePreview ? (

                  <button
                    type="button"

                    onClick={() =>
                      fileInputRef.current?.click()
                    }

                    className="group flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-navy-border bg-midnight/40 px-6 py-10 transition hover:border-cyan/50 hover:bg-cyan/5"
                  >

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan/20 bg-cyan/10 text-cyan transition group-hover:scale-105">

                      <ImagePlus
                        className="h-7 w-7"
                      />

                    </div>


                    <p className="mt-4 text-sm font-medium text-offwhite">

                      {t("addPhoto")}

                    </p>


                    <p className="mt-1 text-xs text-slate-soft">

                      JPG, PNG or WEBP · Max 10 MB

                    </p>


                    <p className="mt-3 text-xs text-priority-critical">

                      {t("photoRequired")}

                    </p>

                  </button>

                ) : (


                  /* =================================================
                     IMAGE PREVIEW
                  ================================================= */

                  <div className="relative overflow-hidden rounded-2xl border border-navy-border bg-midnight">

                    <img
                      src={imagePreview}

                      alt="Selected civic evidence"

                      className="max-h-[420px] w-full object-contain"
                    />


                    {/* =================================================
                        REMOVE IMAGE
                    ================================================= */}

                    <button
                      type="button"

                      onClick={removeImage}

                      aria-label="Remove image"

                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-priority-critical"
                    >

                      <X
                        className="h-5 w-5"
                      />

                    </button>


                    {/* =================================================
                        IMAGE INFO
                    ================================================= */}

                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-4 py-3 backdrop-blur">

                      <p className="truncate text-xs font-medium text-white">

                        {image?.name}

                      </p>


                      <p className="mt-1 text-xs text-slate-300">

                        ✓ {t("photoAttached")}

                      </p>

                    </div>

                  </div>
                )}


                {/* =================================================
                    FILE INPUT
                ================================================= */}

                <input
                  ref={fileInputRef}

                  type="file"

                  accept="image/jpeg,image/png,image/webp"

                  capture="environment"

                  onChange={handleImageSelect}

                  className="hidden"
                />


                {/* =================================================
                    IMAGE ERROR
                ================================================= */}

                {imageError && (

                  <p
                    className="mt-3 text-xs text-priority-critical"
                    role="alert"
                  >

                    {imageError}

                  </p>
                )}

              </div>


              {/* =================================================
                  📍 LOCATION
              ================================================= */}

              <div className="mt-8">


                <div className="mb-3">

                  <h3 className="text-sm font-semibold text-offwhite">

                    {t("location")}

                    <span className="ml-1 text-priority-critical">

                      *

                    </span>

                  </h3>


                  <p className="mt-1 text-xs text-slate-soft">

                    {t("locationRequiredForComplaint")}

                  </p>

                </div>


                <LocationCard
                  geo={{
                    ...geo,

                    latitude:
                      geo.latitude ??
                      undefined,

                    longitude:
                      geo.longitude ??
                      undefined,
                  }}

                  onDetect={
                    geo.detect
                  }

                  skipped={false}

                  onSkip={() => {}}

                  onUndoSkip={() => {}}
                />


                {/* =================================================
                    LOCATION STATUS
                ================================================= */}

                {!hasLocation &&
                  geo.status !== "loading" && (

                    <p className="mt-3 text-center text-xs text-priority-critical">

                      📍 {t("detectLocationBeforeSubmit")}

                    </p>
                )}


                {hasLocation &&
                  geo.latitude !== null &&
                  geo.longitude !== null && (

                    <div className="mt-3 rounded-xl border border-cyan/20 bg-cyan/5 p-3 text-center">

                      <p className="text-xs font-medium text-cyan">

                        ✓ {t("locationDetected")}

                      </p>


                      <p className="mt-1 text-[11px] text-slate-soft">

                        {geo.latitude.toFixed(8)}

                        {" , "}

                        {geo.longitude.toFixed(8)}

                      </p>


                      {geo.accuracy !== null && (

                        <p className="mt-1 text-[11px] text-slate-soft">

                          {t("accuracy")}: ±
                          {Math.round(
                            geo.accuracy
                          )}
                          m

                        </p>
                      )}

                    </div>
                )}

              </div>


              {/* =================================================
                  SUBMIT
              ================================================= */}

              <div className="mt-8 flex flex-col items-center gap-3">

                <Button
                  size="lg"

                  className="w-full sm:w-auto"

                  onClick={
                    handleSubmit
                  }

                  disabled={
                    !canSubmit
                  }

                  aria-describedby={
                    blockReason
                      ? "submit-hint"
                      : undefined
                  }
                >

                  <Send
                    className="h-4 w-4"
                    aria-hidden="true"
                  />

                  {t("analyzeSubmitComplaint")}

                </Button>


                {blockReason && (

                  <p
                    id="submit-hint"

                    className="text-xs text-slate-soft"

                    aria-live="polite"
                  >

                    {blockReason}

                  </p>
                )}

              </div>

            </div>
          )}


          {/* =================================================
              PROCESSING
          ================================================= */}

          {flow === "processing" && (

            <ProcessingState />

          )}


          {/* =================================================
              SUCCESS
          ================================================= */}

          {flow === "success" &&
            result && (

              <ResultCard
                result={result}

                onReportAnother={
                  handleReset
                }

                onBackHome={() => {

                  handleReset();

                  document
                    .getElementById("home")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });

                }}
              />

          )}


          {/* =================================================
              ERROR
          ================================================= */}

          {flow === "error" && (

            <div className="animate-fade-up py-6 text-center">


              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-priority-critical/40 bg-priority-critical/10">

                <AlertOctagon
                  className="h-7 w-7 text-priority-critical"
                />

              </div>


              <h3 className="mt-5 font-display text-xl font-semibold text-offwhite">

                {t("submitFailed")}

              </h3>


              <p
                className="mx-auto mt-2 max-w-sm text-sm text-slate-soft"
                role="alert"
              >

                {errorMessage}

              </p>


              <div className="mt-7 flex justify-center gap-3">

                <Button
                  onClick={() =>
                    setFlow("form")
                  }
                >

                  <RefreshCw
                    className="h-4 w-4"
                  />

                  {t("tryAgain")}

                </Button>


                <Button
                  variant="ghost"
                  onClick={handleReset}
                >

                  {t("startOver")}

                </Button>

              </div>

            </div>
          )}

        </Card>

      </div>

    </section>
  );
}