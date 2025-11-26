import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'

import { NavBar, Welcome, Dock } from '#components';
import { Finder, Resume, Safari, Terminal, Text, Image, Contact } from '#windows';

gsap.registerPlugin(Draggable);

const App = () => {
  return (
    <main>
      <NavBar />
      <Welcome />
      <Dock />

      <Terminal />
      <Safari />
      <Resume />
      <Image />
      <Text />
      <Finder />
      <Contact />
    </main>
  )
}

export default App