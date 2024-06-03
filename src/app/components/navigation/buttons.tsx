import { useNavigate } from "react-router-dom";
import useNavigationHistory from "@/app/hooks/use-navigation-history";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function NavigationButtons() {
  const navigate = useNavigate();
  const { canGoBack, canGoForward } = useNavigationHistory();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="w-full h-10"
        disabled={!canGoBack}
        onClick={() => navigate(-1)}
      >
        <ChevronLeft />
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-full h-10"
        disabled={!canGoForward}
        onClick={() => navigate(1)}
      >
        <ChevronRight />
      </Button>
    </div>
  )
}