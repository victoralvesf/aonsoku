import { Fragment } from 'react/jsx-runtime'
import { Link } from 'react-router-dom'
import { Dot } from './dot'

type TextBadge = {
  content: string | null
  type: 'text'
}

type LinkBadge = {
  content: string | null
  type: 'link'
  link: string
}

export type BadgesData = Array<TextBadge | LinkBadge>

interface HeaderInfoProps {
  showFirstDot?: boolean
  badges: BadgesData
}

export function HeaderInfoGenerator({
  showFirstDot = true,
  badges,
}: HeaderInfoProps) {
  return (
    <div className="flex text-sm">
      <Fragment>
        {badges
          .filter((item) => item.content)
          .map((item, index, array) => (
            <Fragment key={index}>
              {showFirstDot && index === 0 && <Dot />}
              {item.type === 'link' ? (
                <Link
                  to={item.link}
                  className="flex opacity-80 drop-shadow hover:opacity-100 hover:underline"
                >
                  {item.content}
                </Link>
              ) : (
                <p className="opacity-80 drop-shadow">{item.content}</p>
              )}
              {index < array.length - 1 && <Dot />}
            </Fragment>
          ))}
      </Fragment>
    </div>
  )
}
