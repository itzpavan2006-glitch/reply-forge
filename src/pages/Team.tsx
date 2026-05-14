import ComingSoon from "@/components/app/comingsoon";

export default function Team() {
  return (
    <ComingSoon
      eyebrow="Collaboration"
      title="Team Workspaces"
      description="Shared dashboards, comments, approvals, and role-based access for agencies."
      features={[
        "Workspace switcher with owner/admin/editor/viewer roles",
        "Inline comments on proposals and client cards",
        "Approval workflow: draft → in review → approved",
        "Assign tasks and track teammate activity in real time",
        "Activity feed across the entire workspace",
        "Audit log for sensitive client actions",
      ]}
    />
  );
}