import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/app/components/ui/button";
import { SimpleTooltip } from "@/app/components/ui/simple-tooltip";
import { usePlaylists } from "@/app/contexts/playlists-context";

export function SidebarCreatePlaylistButton() {
  const { setPlaylistDialogState } = usePlaylists()
  const { t } = useTranslation()

  return (
    <SimpleTooltip text={t('playlist.createDialog.title')}>
      <Button
        size="icon"
        variant="secondary"
        className="w-6 h-6 p-[5px]"
        onClick={() => setPlaylistDialogState(true)}
      >
        <PlusIcon />
      </Button>
    </SimpleTooltip>
  )
}