import InfoPanel from '@/app/components/info/info-panel'
import {
  Collapsible,
  CollapsibleContent,
} from '@/app/components/ui/collapsible'
import { useAppDataPages } from '@/store/app.store'

interface CollpsibleInfoProps {
  title: string
  bio?: string
  lastFmUrl?: string
  musicBrainzId?: string
}

export function CollapsibleInfo({
  title,
  bio,
  lastFmUrl,
  musicBrainzId,
}: CollpsibleInfoProps) {
  const { showInfoPanel } = useAppDataPages()

  return (
    <Collapsible open={showInfoPanel}>
      <CollapsibleContent>
        <div className="mb-6">
          {bio && (
            <InfoPanel
              title={title}
              bio={bio}
              lastFmUrl={lastFmUrl}
              musicBrainzId={musicBrainzId}
            />
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
