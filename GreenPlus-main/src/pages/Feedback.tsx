import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

function Feedback() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submit, setSubmit] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  function SubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSubmit(true);
  }

  // Form animation
  useEffect(() => {
    if (!submit && formRef.current) {
      gsap.fromTo(
        formRef.current,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        }
      );
    }
  }, [submit]);

 
  useEffect(() => {
    if (submit && successRef.current) {
      gsap.fromTo(
        successRef.current,
        {
          y: 40,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [submit]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {!submit ? (
        <form
          ref={formRef}
          onSubmit={SubmitHandler}
          className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-8 shadow-xl absolute top-9"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            Give Feedback
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            How was your experience?
          </p>

          <div className="mt-5 flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-3xl transition-transform duration-150 hover:scale-110 focus:outline-none"
              >
                {star <= rating ? "⭐" : "☆"}
              </button>
            ))}
          </div>

  
          <div className="mt-6">
            <label
              htmlFor="feedback"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Your feedback
            </label>

            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback..."
              rows={5}
              className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 p-4 text-sm text-gray-900 outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-gray-200"
            />
          </div>

   
          <button
            type="submit"
            className="mt-5 w-full rounded-xl bg-black px-6 py-4 font-medium text-white transition hover:bg-gray-800 active:scale-[0.98]"
          >
            Submit Feedback
          </button>
        </form>
      ) : (
   
        <div
          ref={successRef}
          className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-xl absolute top-9"
        >
   
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <span className="text-4xl">✓</span>
          </div>

          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Thank You!
          </h2>

          <p className="mt-3 text-gray-500">
            Thanks for taking the time to share your feedback with us.
            Your response has been received successfully.
          </p>


          {rating > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-600">
                Your rating
              </p>

              <div className="mt-2 text-2xl">
                {"⭐".repeat(rating)}
              </div>
            </div>
          )}


          {feedback && (
            <div className="mt-6 rounded-xl bg-gray-50 p-4 text-left">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Your feedback
              </p>

              <p className="mt-2 text-sm text-gray-700">
                "{feedback}"
              </p>
            </div>
          )}

          <p className="mt-8 text-sm text-gray-400">
            We appreciate your response 
          </p>
        </div>
      )}
    </div>
  );
}

export default Feedback;



