import PinItem from "./PinItem";

export interface ImageType {
  id: string;
  url: string;
}
interface Props {
  images: ImageType[];
}

function ImageList({ images }: Props) {
  return (
    <div className="columns-2 mt-7 px-2 md:px-5 md:columns-3 lg:columns-4 xl:columns-6 space-y-6 mx-auto">
      {images?.map((image: ImageType, index: number) => (
        <PinItem image={image} key={index} />
      ))}
    </div>
  );
}

export default ImageList;
