import { WindowControls } from '#components';
import { gallery, photosLinks } from '#constants';
import WindowWrapper from '#hoc/WindowWrapper';
import useWindowStore from '#store/window';
import { Mail, Search } from 'lucide-react/dist/esm/icons';
const Photos = () => {

  const { openWindow, focusWindow } = useWindowStore();

  const email = 'swastik15.sharma.work@gmail.com';

  return (
    <div className="flex flex-col h-full">
      <div id='window-header' className='window-drag-handle'>
        <WindowControls target="photos" />
        <h2 className='flex-1 text-center font-bold'>Gallery</h2>
        <div className='flex justify-end items-center gap-3'>
          <a
            href={`mailto:${email}`}
            title={`Email: ${email}`}
            className='p-2 hover:bg-gray-200 rounded-md transition-colors'
          >
            <Mail size={18} />
          </a>
          <Search className='icon' />
        </div>
      </div>
      <div className='flex w-full flex-1 min-h-0'>
        <div className='sidebar'>
          <h2>
            Photos
          </h2>
          <ul>
            {photosLinks.map(({id, icon, title}) => (
              <li 
                key={id}
                onClick={(e) => {
                  e.stopPropagation();
                  focusWindow('photos');
                }}
              >
                <img src={icon} alt={title} />
                <p>{title}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className='gallery'>
          <ul>
            {gallery.map(({id, img}) => (
              <li 
                key={id}
                onClick={(e) => {
                  e.stopPropagation();
                  openWindow('imgfile' , {
                    id,
                    name: "Gallery Image",
                    icon: "/images/image.png",
                    kind: "file",
                    fileType: "img",
                    imageUrl: img,
                  });
                }}
              >
                <img
                  src={img}
                  alt={`Gallery image ${id}`}
                  loading='lazy'
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

const PhotosWindow = WindowWrapper( Photos, "photos")

export default PhotosWindow;
