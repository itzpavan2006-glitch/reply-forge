import ComingSoon from "@/components/app/comingsoon";

export default function Templates() {
  return (
    <ComingSoon
      eyebrow="Marketplace"
      title="Templates Marketplace"
      description="Browse, remix, and publish proposal & reply templates from top operators."
      features={[
        "Category filters: proposals, outreach, replies, negotiation",
        "Featured & trending row with rating + usage count",
        "One-click 'Use template' that prefills the generator",
        "Upload your own templates and build a public library",
        "Creator monetization tiers (rolling out next phase)",
        "Smart search across tone, niche, and outcome",
      ]}
    />
  );
}