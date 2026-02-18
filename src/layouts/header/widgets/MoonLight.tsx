import { useState } from 'react'
import SvgIcon from '../../../shared/icons/SvgIcon'

const MoonLight = () => {
  const [darkMode, setDarkMode] = useState(false)

  const DarkModeHandler = (name: boolean) => {
    if (name) {
      document.body.classList.remove('dark-only')
      document.body.classList.add('light-only')
      setDarkMode(!darkMode)
    } else {
      document.body.classList.remove('light-only')
      document.body.classList.add('dark-only')
      setDarkMode(!darkMode)
    }
  }

  return (
    <li>
      <div className={`mode ${darkMode ? 'active' : ''}`} onClick={() => DarkModeHandler(darkMode)}>
        <SvgIcon iconId="moon" />
      </div>
    </li>
  )
}

export default MoonLight
