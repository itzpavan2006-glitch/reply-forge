import ComingSoon from "@/components/app/comingsoon";

export default function Integrations() {
  return (
    <ComingSoon
      eyebrow="Integrations"
      title="Integrations Hub"
      description="One-click connections to the tools your business already runs on."
      features={[
        "Email: Gmail, Outlook, Resend",
        "Calendar: Google Calendar, Outlook",
        "Docs & storage: Google Drive, Docs, OneDrive",
        "Project management: Linear, Asana, Airtable",
        "Comms: Slack notifications on won deals",
        "Connection cards with status, scopes, and last sync",
      ]}
    />
  );
}