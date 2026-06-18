import PageContainer from "../../components/ui/PageContainer";
import PageTitle from "../../components/ui/PageTitle";
import BackButton from "../../components/ui/BackButton";

export default function JoinPlant() {
  return (
    <PageContainer>
    <BackButton to="/plants" text="Back to plants"/>
      <PageTitle
        title="Join a Plant"
        subtitle="View and join an existing plant from another user to start tracking its health and growth."
      />

    </PageContainer>
  );
}
