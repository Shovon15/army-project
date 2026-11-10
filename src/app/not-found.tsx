import StatusScreen from "@/components/common/fallback/StatusScreen";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import routes from "@/config/routes";

/** 404: same navy + crimson-glow backdrop as the Featured Collections section. */
export default function NotFound() {
  return (
    <StatusScreen
      code="404"
      badge="Page Not Found"
      titleLines={["This Masterpiece Has", "Left The Gallery"]}
      description="Sorry, the page you are looking for could not be found. It may have been moved or no longer exists."
      actions={
        <>
          <PrimaryButton href={routes.home} arrow>
            Back To Home
          </PrimaryButton>
          <PrimaryButton href={routes.collection} variant="outline" arrow>
            Explore Collections
          </PrimaryButton>
        </>
      }
    />
  );
}
