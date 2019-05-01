import { HamsNearMeLocation, trackPageview } from '@bartlett705/charcoal-client'
import * as React from 'react'
import './index.scss'

declare var window: Window & {
  testing: boolean
}

declare var __FILES__: string[]

export const App = () => (
  <>
    <header>
      <h2>Check out all of our cool Emoji</h2>
    </header>
    <main>
      <ImgGallery />
    </main>
    <footer>
      {/* <div>
        [ <a href="/about.html">about</a> ]
      </div> */}
    </footer>
  </>
)

interface State {
  currentImage: string
}

class ImgGallery extends React.Component {
  public state: State = { currentImage: '' }
  // public componentDidMount() {
  //   trackPageview({ location: 'image-viewer' })
  // }

  public render() {
    return (
      <>
      <div className="current-image">
        <img src={constructSrc(this.state.currentImage)} />
      </div>
      <div className="thumbs">
        {__FILES__.map((img: string) => (
          <Thumbnail
          img={img}
          onClick={() => this.setState({ currentImage: img })}
          />
          ))}
        </div>
      </>
    )
  }
}
const Thumbnail: React.FunctionComponent<{
  img: string
  onClick: (event: React.MouseEvent<HTMLImageElement>) => void
}> = ({ img, onClick }) => (
  <img className="thumb" onClick={onClick} src={constructSrc(img)} alt={img} />
)
const constructSrc = (filename: string) => `./emojii/${filename}`
