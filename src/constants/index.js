const navLinks = [
  {
    id: 1,
    name: "Projects",
    type: "finder",
  },
  {
    id: 3,
    name: "Contact",
    type: "contact",
  },
  {
    id: 4,
    name: "Resume",
    type: "resume",
  },
];

const navIcons = [
  /* {
    id: 1,
    img: "/icons/wifi.svg",
  }, */
  {
    id: 2,
    img: "/icons/search.svg",
    type: "safari"
  },
  {
    id: 3,
    img: "/icons/music.svg",
    type: "music",
  },
  {
    id: 4,
    img: "/icons/user.svg",
    type: "finder",
    action: "about",
  },
  /* {
    id: 5,
    img: "/icons/mode.svg",
  }, */

];

const dockApps = [
  {
    id: "finder",
    name: "Portfolio", // was "Finder"
    icon: "finder.png",
    canOpen: true,
  },
  {
    id: "safari",
    name: "Articles", // was "Safari"
    icon: "safari.png",
    canOpen: true,
  },
  {
    id: "photos",
    name: "Gallery", // was "Photos"
    icon: "photos.png",
    canOpen: true,
  },
  {
    id: "contact",
    name: "Contact", // or "Get in touch"
    icon: "contact.png",
    canOpen: true,
  },
  {
    id: "terminal",
    name: "Skills", // was "Terminal"
    icon: "terminal.png",
    canOpen: true,
  },
  {
    id: "vscode",
    name: "VS Code",
    icon: "code2.png",
    canOpen: true,
  },
  {
    id: "music",
    name: "Music", // was "Trash"
    icon: "music.png",
    canOpen: true,
  },
  {
    id: "game",
    name: "Games",
    icon: "game.png",
    canOpen: true,
  },
  {
    id: "trash", // unique id to avoid duplicate keys in Dock
    name: "Trash",
    icon: "trash.png",
    canOpen: true,
    action: "trash",
  },
];

const blogPosts = [
  
  {
    id: 2,
    date: "July 5, 2025",
    title: "Mastering Frontend Performance: Speed Up Your Website",
    image: "/images/blog3.png",
    link: "https://swastiksharma15.github.io/Portfolio/blogs.html#post-4",
  },
  {
    id: 1,
    date: "June 10, 2025",
    title:"Developing Dynamic Web Experiences Using React",
    image: "/images/blog1.png",
    link: "https://swastiksharma15.github.io/Portfolio/blogs.html#post-1",
  },
  {
    id: 3,
    date: "May 20, 2025",
    title: "CSS Animations: Bringing Your Website to Life",
    image: "/images/blog2.png",
    link: "https://swastiksharma15.github.io/Portfolio/blogs.html#post-3",
  },
];

const techStack = [
  {
    category: "Frontend",
    items: ["React.js", "JavaScript", "HTML5", "Vite"],
  },
  {
    category: "Styling",
    items: ["Tailwind CSS", "GSAP", "CSS3"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Python","REST APIs"],
  },
  {
    category: "Database",
    items: ["SQL"],
  },
  {
    category: "Dev Tools",
    items: ["Git", "GitHub","Axios", "Jest", "Figma"],
  }
];

const socials = [
  {
    id: 1,
    text: "Github",
    icon: "/icons/github.svg",
    bg: "#f4656b",
    link: "https://github.com/SwastikSharma15",
  },
  {
    id: 4,
    text: "LinkedIn",
    icon: "/icons/linkedin.svg",
    bg: "#05b6f6",
    link: "https://www.linkedin.com/in/swastik15sharma/",
  },
  {
    id: 2,
    text: "Youtube",
    icon: "/icons/youtube.svg",
    bg: "#4bcb63",
    link: "https://www.youtube.com/@SpeedX_",
  },
  {
    id: 3,
    text: "Discord",
    icon: "/icons/discord.svg",
    bg: "#ff866b",
    link: "https://discord.gg/sSxmkzXwv4",
  },
];

const photosLinks = [
  {
    id: 1,
    icon: "/icons/gicon1.svg",
    title: "Library",
  },
  {
    id: 2,
    icon: "/icons/gicon2.svg",
    title: "Memories",
  },
  {
    id: 3,
    icon: "/icons/file.svg",
    title: "Places",
  },
  {
    id: 4,
    icon: "/icons/gicon4.svg",
    title: "People",
  },
  {
    id: 5,
    icon: "/icons/gicon5.svg",
    title: "Favorites",
  },
];

const gallery = [
  {
    id: 1,
    img: "/images/gal2.jpg",
  },
  {
    id: 2,
    img: "/images/gal3.jpg",
  },
  {
    id: 3,
    img: "/images/gal5.png",
  },
  {
    id: 4,
    img: "/images/gal4.webp",
  },
  {
    id: 5,
    img: "/images/gal1.png",
  },
  {
    id: 6,
    img: "/images/gal6.png",
  },
  {
    id: 7,
    img: "/images/wallpaper.png",
  },
  {
    id: 8,
    img: "/images/gal7.jpg",
  },
  {
    id: 9,
    img: "/images/gal8.jpg",
  },
  {
    id: 10,
    img: "/images/gal15.jpg",
  },
  {
    id: 11,
    img: "/images/gal10.jpg",
  },
  {    
    id: 12,
    img: "/images/gal11.jpg",
  },
  {
    id: 13,
    img: "/images/gal12.jpg",
  },
  {
    id: 14,
    img: "/images/gal13.webp",
  },
  {
    id: 15,
    img: "/images/gal14.jpg",
  },
  {
    id: 16,
    img: "/images/gal9.webp",
  },
  {
    id: 17,
    img: "/images/gal16.jpg",
  }
];

const songs = [
  
  {
    id: 1,
    title: "I Really Want to Stay at Your House",
    author: "Rosa Walton (with Hallie Coggins)",
    src: "/audio/lucysong.mp3",
    cover: "/images/lucysong.jpg",
  },
  {
    id: 2,
    title: "City Ruins - Rays of Light",
    author: "NieR: Automata OST",
    src: "/audio/City Ruins - Rays of Light (NieR_Automata Original Soundtrack)Audio.mp3",
    cover: "/images/city.webp",
  },
  {
    id: 3,
    title: "Feel It",
    author: "D4vd",
    src: "/audio/feelit.mp3",
    cover: "/images/feelit.jpg",
  },
  {
    id: 4,
    title: "Ma Meilleure Ennemie",
    author: "Arcane OST",
    src: "/audio/arcane.mp3",
    cover: "/images/arcane.jpg",
  },
  {
    id: 5,
    title: "Fire Again",
    author: "VALORANT",
    src: "/audio/fireagain.mp3",
    cover: "/images/fireagain.jpg",
  },
  {
    id: 6,
    title: "Die For You",
    author: "VALORANT",
    src: "/audio/dieforyou.mp3",
    cover: "/images/dieforyou.jpg",
  },
  {
    id: 7,
    title: "Ticking Away",
    author: "VALORANT",
    src: "/audio/Ticking Away.mp3",
    cover: "/images/tickingAway.jpg",
  },
  {
    id: 8,
    title: "Be a flower",
    author: "Ryokuoushoku Shakai",
    src: "/audio/Be a flower.mp3",
    cover: "/images/maomao.jpg",
  },
  {
    id: 9,
    title: "Anytime Anywhere",
    author: "Milet",
    src: "/audio/Anytime Anywhere.mp3",
    cover: "/images/anytimeanywhere.jpg",
  },
  {
    id: 10,
    title: "The Path to Becoming a Hero",
    author: "ZZZ Miyabi's OST",
    src: "/audio/The Path to Becoming a Hero.mp3",
    cover: "/images/miyabi.jpg",
  },
  {
    id: 11,
    title: "Dandelion",
    author: "Go!go!vanillas",
    src: "/audio/Dandelion.mp3",
    cover: "/images/dandelion.jpg",
  },
  {
    id: 12,
    title: "Odoriko",
    author: "Vaundy",
    src: "/audio/odoriko.mp3",
    cover: "/images/odorika.jpg",
  },
];

export {
  navLinks,
  navIcons,
  dockApps,
  blogPosts,
  techStack,
  socials,
  photosLinks,
  gallery,
  songs,
};

const WORK_LOCATION = {
  id: 1,
  type: "work",
  name: "Work",
  icon: "/icons/work.svg",
  kind: "folder",
  children: [

    // ▶ Project 1 Cyberpunk
    {
      id: 5,
      name: "Cyberpunk",
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-45 right-80 ",
      windowPosition: "top-[10vh] left-15", // optional: Finder window position
      children: [
        {
          id: 1,
          name: "Cyberpunk Edgerunners.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5 right-10",
          description: [
            "A cinematic tribute website inspired by Cyberpunk: Edgerunners, built to capture the neon chaos and raw emotion of Night City.",
            "Instead of a simple fan page, it delivers an immersive experience with animated visuals, dynamic video transitions, and a UI styled straight out of the Cyberpunk universe.",
            "Think of it like stepping into Lucy and David’s world glitchy, vibrant, and alive with every interaction echoing the feel of the anime.",
            "It’s built with React, GSAP, and Tailwind CSS, ensuring smooth animations, fast performance, and a visually striking interface across all screen sizes.",
          ],
        },
        {
          id: 2,
          name: "CyberpunkEdgerunners.com",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://lucycyberpunk.vercel.app/",
          position: "top-20 left-20",
        },
        {
          id: 4,
          name: "Cyberpunk Edgerunners.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-52 left-80",
          imageUrl: "/images/cyberpunk.png",
        },
        {
          id: 5,
          name: "Cyberpunk Edgerunners.github",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://github.com/SwastikSharma15/CyberPunk",
          position: "top-60 right-70",
        },
      ],
    },

    // ▶ Project 2 ShopKar
    {
      id: 6,
      name: "ShopKar",
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-10 left-0", // icon position inside Finder
      windowPosition: "top-[25vh] left-30",
      children: [
        {
          id: 1,
          name: "ShopKar Project.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          description: [
            "ShopKar is a fully-featured e-commerce platform built using React.js and Vite, designed to deliver a fast and frictionless shopping experience.",
            "Instead of a basic product listing site, it focuses on smart search, instant filtering, and snappy cart interactions that feel closer to a polished commercial storefront than a student project.",
            "Behind the scenes, it uses optimized state management and REST API integration to keep navigation fast and checkout smooth, no lag, no page reloads, no nonsense.",
            "Think of it as a lightweight Amazon-style interface built specifically for speed, usability, and real-world performance.",
          ],
        },
        {
          id: 2,
          name: "ShopKar.com",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://shopkar-react.vercel.app/",
          position: "top-10 right-45",
        },
        {
          id: 4,
          name: "ShopKar.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-52 right-80",
          imageUrl: "/images/ShopKar.webp",
        },
        {
          id: 5,
          name: "ShopKar.github",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://github.com/SwastikSharma15/ShopKar",
          position: "top-65 right-30",
        },
      ],
    },

    // ▶ Project 3 Tidy Tasks
    {
      id: 7,
      name: "Tidy Tasks",
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-10 left-50",
      windowPosition: "top-[40vh] left-15",
      children: [
        {
          id: 1,
          name: "TidyTasks.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-25 left-30",
          description: [
            "TidyTasks is a clean and efficient task manager built with React and Vite, designed to help users stay organized without any unnecessary clutter.",
            "Instead of a basic to-do list, it offers smooth interactions, instant updates, and a polished UI that makes managing tasks feel effortless.",
            "Think of it like a personal productivity dashboard add tasks, edit them, categorize them, and track progress with zero friction.",
            "Built with React Hooks, Tailwind CSS, and local storage, it delivers fast performance, smooth animations, and persistent data across sessions on any device.",
          ],
        },
        {
          id: 2,
          name: "TidyTasks.com",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://tidytasks.vercel.app/",
          position: "top-10 right-20",
        },
        {
          id: 4,
          name: "TidyTasks.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-67 right-85",
          imageUrl: "/images/tidytask.png",
        },
        {
          id: 5,
          name: "TidyTasks.github",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://github.com/SwastikSharma15/TidyTasks",
          position: "top-60 right-20",
        },
      ],
    },

    // ▶ Project 4 Movie Plex
    {
      id: 8,
      name: "Movie Plex",
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-80 right-55",
      windowPosition: "top-[55vh] left-30",
      children: [
        {
          id: 1,
          name: "Movie Plex.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5 right-10",
          description: [
            "MoviePlex is a sleek movie discovery app built with React and Vite, designed for browsing films quickly and effortlessly.",
            "Instead of a plain search tool, it offers smooth navigation, real-time search results, and clean movie previews that make exploring titles genuinely fun.",
            "Think of it like a mini streaming dashboard search movies, check ratings, and view details with a UI that feels fast, modern, and distraction-free.",
            "Powered by the TMDB API, React Hooks, and a responsive layout, it delivers a sharp, app-like experience across all devices with near-instant performance."
          ],
        },
        {
          id: 2,
          name: "MoviePlex.com",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://movieplexapp.vercel.app/",
          position: "top-20 left-20",
        },
        {
          id: 4,
          name: "Movie Plex.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-52 left-80",
          imageUrl: "/images/movieplex.webp",
        },
        {
          id: 5,
          name: "Movie Plex.github",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://github.com/SwastikSharma15/Movie-React-App",
          position: "top-60 right-70",
        },
      ],
    },

    // ▶ Project 5 Mojito Mix
    {
      id: 9,
      name: "Mojito Mix",
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-80 right-5",
      windowPosition: "top-[70vh] left-15",
      children: [
        {
          id: 1,
          name: "Mojito Mix.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          description: [
            "MojitoMix is a niche beverage-store website focused entirely on handcrafted mojitos, built to showcase flavors in a clean, modern layout.",
            "Instead of a generic product grid, it delivers a refreshing browsing experience with vibrant visuals, smooth transitions, and detailed flavor profiles for every mojito variant.",
            "Think of it like walking into a specialty mojito bar each drink highlighted with its own look, description, and pricing, making the shopping flow effortless and enjoyable.",
            "Built with React and Tailwind, it offers fast performance, responsive design, and a polished UI that feels crisp across all screen sizes."
          ],
        },
        {
          id: 2,
          name: "MojitoMix.com",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://mojitomix.vercel.app",
          position: "top-50 left-20",
        },
        {
          id: 4,
          name: "Mojito Mix.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-15 right-30",
          imageUrl: "/images/mojito.png",
        },
        {
          id: 5,
          name: "Mojito Mix.github",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://github.com/SwastikSharma15/Learning-GSAP",
          position: "top-60 right-20",
        },
      ],
    },

    // ▶ Project 6 VS Code Web IDE
    {
      id: 10,
      name: "VS Code Web IDE",
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-45 right-30",
      windowPosition: "top-[40vh] left-40",
      children: [
        {
          id: 1,
          name: "VS Code.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-15 right-40",
          description: [
            "VS Code Web IDE is a browser-based recreation of Visual Studio Code, built to simulate the look, feel, and interaction patterns of a real development environment.",
            "Instead of a static code viewer, it delivers an immersive IDE-like experience with a file explorer, multi-tab editor, terminal panel, and a VS Code–inspired dark theme.",
            "Think of it as opening VS Code directly in your browser where files, tabs, and panels behave like a real editor, making the interface familiar and intuitive for developers.",
            "Built with React, Vite, and modern UI patterns, it focuses on performance, responsiveness, and clean state management, while adding a Canvas-based interactive animation layer for an engaging twist."
          ],
        },
        {
          id: 2,
          name: "VSCode.com",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://vs-code-web-ide.vercel.app/",
          position: "top-20 left-20",
        },
        {
          id: 4,
          name: "VS Code.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-52 left-80",
          imageUrl: "/images/vscode.png",
        },
        {
          id: 5,
          name: "VS Code.github",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://github.com/SwastikSharma15/VS-Code-Web-IDE",
          position: "top-60 right-70",
        },
      ],
    },
  ],
};

const ABOUT_LOCATION = {
  id: 2,
  type: "about",
  name: "About me",
  icon: "/icons/info.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "me.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-10 left-5",
      imageUrl: "/images/swastik_2.jpeg",
    },
    {
      id: 2,
      name: "Swastik.linkedin",
      icon: "/images/safari.png",
      kind: "file",
      fileType: "url",
      href: "https://www.linkedin.com/in/swastik15sharma/",
      position: "top-60 left-50",
    },
    {
      id: 3,
      name: "Swastik.github",
      icon: "/images/plain.png",
      kind: "file",
      fileType: "fig",
      href: "https://github.com/SwastikSharma15",
      position: "top-60 left-95",
    },
    {
      id: 4,
      name: "AboutMe.txt",
      icon: "/images/txt.png",
      kind: "file",
      fileType: "txt",
      position: "top-18 left-50",
      subtitle: "Meet the Developer Behind the Code",
      image: "/images/swastik.jpg",
      description: [
        "I’m Swastik, a frontend developer based in India, focused on building fast, responsive, and visually sharp web interfaces. I work mainly with React, JavaScript, and modern tooling to craft smooth user experiences backed by clean, maintainable code.",
        "I care about performance, clarity, and UI polish whether it’s reducing load times, solving annoying UX problems, or animating micro-interactions with GSAP. If something feels slow or clunky, I fix it. Simple.",
        "Outside coding, I work on video editing. It sharpens my eye for pacing, composition, and visual flow skills I carry directly into UI design and motion on the web. Whether it’s timing cuts in a timeline or timing animations in GSAP, the mindset is the same: make every frame feel intentional.",
      ],
    },
    {
      id: 5,
      name: "TechStack.txt",
      icon: "/images/txt.png",
      kind: "file",
      fileType: "txt",
      position: "top-10 left-95",
      subtitle: "Tech Stack",
      description: [
        "⚙️ Frontend:",
        "React.js, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, GSAP",
        "",
        "🧠 State Management:",
        "Redux, Redux Toolkit, Zustand",
        "",
        "🛠️ Tools & Build Systems:",
        "Vite, npm, Git, GitHub, Axios, Jest, Figma",
        "",
        "🎨 UI & Workflow:",
        "Responsive Design, Component Architecture, Animations, Micro-interactions, Performance Optimization, Accessibility Basics",
        "",
        "📡 APIs & Data:",
        "REST APIs, TMDB API, JSON handling, Async data fetching",
        "",
        "📱 Other / Supporting:",
        "Python, SQL, Machine Learning, React Native",
      ],
    },
    {
      id: 6,
      name: "me2.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-55 left-5",
      imageUrl: "/images/swastik.jpg",
    },
  ],
};

const RESUME_LOCATION = {
  id: 3,
  type: "resume",
  name: "Resume",
  icon: "/icons/file.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "Resume.pdf",
      icon: "/images/pdf.png",
      kind: "file",
      fileType: "pdf",
      // you can add `href` if you want to open a hosted resume
      // href: "/your/resume/path.pdf",
    },
  ],
};

const TRASH_LOCATION = {
  id: 4,
  type: "trash",
  name: "Trash",
  icon: "/icons/trash.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "Trash1.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-10 left-10",
      imageUrl: "/images/trash-1.png",
    },
    {
      id: 4,
      name: "Trash4.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-65 left-80",
      imageUrl: "/images/trash-4.jpg",
    },
    {
      id: 3,
      name: "Trash3.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-55 left-30",
      imageUrl: "/images/trash-3.jpg",
    },
    {
      id: 2,
      name: "Trash2.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-20 left-55",
      imageUrl: "/images/trash-2.jpg",
    },
    {
      id: 5,
      name: "Old Portfolio.com",
      icon: "/images/safari.png",
      kind: "file",
      fileType: "url",
      href: "https://swastiksharma15.github.io/Portfolio/",
      position: "top-10 right-10",
    },
  ],
};

export const locations = {
  work: WORK_LOCATION,
  about: ABOUT_LOCATION,
  resume: RESUME_LOCATION,
  trash: TRASH_LOCATION,
};

const INITIAL_Z_INDEX = 1000;

const WINDOW_CONFIG = {
  finder: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  contact: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  resume: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  safari: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  photos: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  terminal: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  vscode: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  txtfile: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  imgfile: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  music: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  game: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  trash: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
};

export { INITIAL_Z_INDEX, WINDOW_CONFIG };
