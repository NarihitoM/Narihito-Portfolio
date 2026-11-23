import { FeedbackPage } from "@/features/feedback/components/FeedbackPage";

export const metadata = {
  title: "Feedback",
  description: "Share feedback about Narihito's portfolio. An AI assistant replies by email right away.",
};

export default function FeedbackRoute() {
  return <FeedbackPage />;
}
