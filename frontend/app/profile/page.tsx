import { ProfileExperience } from "@/components/profile-experience";
import { ProductShell } from "@/components/product-shell";
import { profileMocks, profileSectionMeta, type ProfileMockState, type ProfileSectionId } from "@/data/profile.mock";

const availableStates = new Set<ProfileMockState>(["complete", "partial", "missing-credit", "missing-spending", "validation-error", "save-failure"]);
const availableEditors = new Set<ProfileSectionId>(profileSectionMeta.map((section) => section.id));

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ state?: string; edit?: string }> }) {
  const params = await searchParams;
  const requestedState = params.state as ProfileMockState | undefined;
  const state = requestedState && availableStates.has(requestedState) ? requestedState : "complete";
  const requestedEditor = params.edit as ProfileSectionId | undefined;
  const initialEditor = state === "validation-error" ? "credit" : requestedEditor && availableEditors.has(requestedEditor) ? requestedEditor : null;
  const profile = profileMocks[state];

  return (
    <ProductShell
      compactHeader
      profileCompletion={profile.completion}
      searchPlaceholder="Search cards or ask Credlytic"
      subtitle="The financial signals Credlytic uses to understand your current card options."
      title="Financial profile"
    >
      <ProfileExperience
        forceSaveFailure={state === "save-failure"}
        initialEditor={initialEditor}
        initialProfile={profile}
        initialValidationError={state === "validation-error"}
      />
    </ProductShell>
  );
}
