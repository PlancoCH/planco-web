import BackButton from "../../components/ui/BackButton";
import PageContainer from "../../components/ui/PageContainer";
import PageTitle from "../../components/ui/PageTitle";

export default function SharePlant() {
  return (
    <PageContainer>
    <BackButton text="Back to plant"/>
      <PageTitle
        title="Share a Plant"
        subtitle="Invite another user to join and track an existing plant."
      />
    </PageContainer>
  );
}
